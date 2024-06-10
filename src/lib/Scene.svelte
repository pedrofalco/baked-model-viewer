<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import '/src/style.css';

	import { isChecked, files } from '$lib/store';
	
	/* LOADERS */
	// Loading Manager
	const manager = new THREE.LoadingManager();
	manager.onLoad = function () {
		console.log('Loading complete!');
		setTimeout(() => {
			loading = false;
		}, 1000);
	};
	manager.onProgress = function (url, itemsLoaded, itemsTotal) {
		progress_bar = (itemsLoaded / itemsTotal) * 100;
	};
	manager.onError = function (url) {
		console.log('There was an error loading ' + url);
	};
	const textureLoader = new THREE.TextureLoader(manager);
	const loader = new GLTFLoader(manager);
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('/draco/');
	loader.setDRACOLoader(dracoLoader);

	let canvas;
	let loading = true;
	let progress_bar = 1;

	let bakedModel;
	let bakedColor;
	let bakedEmission;
	let bakedAlpha;

	let warning;

	$files.forEach((element) => {
		try {
			const fileName = element.path.toLowerCase(); // Ensure case-insensitivity

			if (fileName.includes('color')) {
				bakedColor = createTextureMaterialFromArrayBuffer(element.data);
			} else if (fileName.includes('emissive')) {
				bakedEmission = createTextureMaterialFromArrayBuffer(element.data);
			} else if (fileName.endsWith('.glb')) {
				bakedModel = element.data;
			} else if (fileName.includes('opacity')) {
				bakedAlpha = createTextureMaterialFromArrayBuffer(element.data);
			}
		} catch(e) {
			console.log('element undefined')
		}

	});

	onMount(() => {
		// Scene
		const scene = new THREE.Scene();

		// Camera
		const camera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		camera.position.y = 1.75;
		camera.position.z = 0;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.toneMappingFolder = THREE.ACESFilmicToneMapping;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x333333); // Use hexadecimal color code

		// Orbit Controls
		const controls = new PointerLockControls(camera, renderer.domElement);
		controls.pointerSpeed = 1.2
		// Ambient Light
		const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Color, Intensity
		scene.add(ambientLight);

		
		/* MAIN SCENE */
		if ($isChecked) {
			// Load Texture
			const mainTextureColor = textureLoader.load(`/models/ARCADEROOM-BAKE-COLOR.png`);
			mainTextureColor.flipY = false;
			mainTextureColor.colorSpace = THREE.SRGBColorSpace;

			//Emissive
			const mainEmissiveTexture = textureLoader.load(`/models/ARCADEROOM-EMISSIVE.png`);
			mainEmissiveTexture.flipY = false; // Flip the emissive texture map on the Y axis
			mainEmissiveTexture.encoding = THREE.sRGBEncoding; // Set emissive texture encoding

			//Load 3D Model
			loader.load(`/models/ARCADEROOM-MODEL.glb`, (gltf) => {
				const model = gltf.scene;
				model.traverse((child) => {
					if (child.isMesh) {
						child.material = new THREE.MeshStandardMaterial({
							map: mainTextureColor,
							emissiveMap: mainEmissiveTexture,
							emissive: new THREE.Color(0xffffff),
							side: THREE.DoubleSide,
						});
					}
				});
				scene.add(model);
			});
		}

		if (!bakedModel && !bakedColor && !bakedEmission && !$isChecked) {
			loading = false;
		}


		/*EXTERNAL ASSETS*/

		//Load Texture
		const externalColorTexture = bakedColor ? textureLoader.load(bakedColor) : null;
		if (externalColorTexture) {
			externalColorTexture.flipY = false;
			externalColorTexture.colorSpace = THREE.SRGBColorSpace;
		}
		//Emissive
		const externalEmissiveTexture = bakedEmission
			? textureLoader.load(bakedEmission)
			: null;
		if (externalEmissiveTexture) {
			externalEmissiveTexture.flipY = false;
			externalEmissiveTexture.encoding = THREE.sRGBEncoding;
		}
		//Alpha
		const externalAlphaTexture = bakedAlpha
			? textureLoader.load(bakedAlpha)
			: null;
		if (externalAlphaTexture) {
			externalAlphaTexture.flipY = false;
			externalAlphaTexture.encoding = THREE.sRGBEncoding;
		}

		// Load 3D Model

		if (bakedModel) {
			loader.parse(bakedModel, '', (gltf) => {
				const model = gltf.scene;
				// model.scale.set(0.25, 0.25, 0.25);

				if (externalEmissiveTexture) {
					model.traverse((child) => {
						if (child.isMesh) {
							child.material = new THREE.MeshStandardMaterial({
								map: externalColorTexture,
								emissiveMap: externalEmissiveTexture,
								emissive: new THREE.Color(0xffffff),
								alphaMap: externalAlphaTexture,
								transparent: true,
								side: THREE.DoubleSide,
								depthWrite: false, // Disable writing to the depth buffer
							});
							child.backFaceCulling = false;
						}
					});
				} else {
					model.traverse((child) => {
						if (child.isMesh) {
							child.material = new THREE.MeshBasicMaterial({
								map: externalColorTexture,
								side: THREE.DoubleSide,
							});
						}
					});
				}
				scene.add(model);
				URL.revokeObjectURL(bakedEmission);
				URL.revokeObjectURL(bakedColor);
			});
		} else {
			console.error("Error: You are currently viewing the default scene, but you have not provided a 3D model file. Please make sure to upload a model file before proceeding.");
		}
		// Resize handling
		window.addEventListener('resize', onWindowResize, false);

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		onclick = () => {
			controls.lock();
		};

		// Movement variables
		const moveSpeed = 0.1;
		const velocity = new THREE.Vector3();
		const direction = new THREE.Vector3();
		const keys = {
			forward: false,
			backward: false,
			left: false,
			right: false,
		};

		onkeydown = (event) => {
			switch (event.code) {
				case 'KeyW':
					keys.forward = true;
					break;
				case 'KeyS':
					keys.backward = true;
					break;
				case 'KeyA':
					keys.left = true;
					break;
				case 'KeyD':
					keys.right = true;
					break;
			}
		};

		onkeyup = (event) => {
			switch (event.code) {
				case 'KeyW':
					keys.forward = false;
					break;
				case 'KeyS':
					keys.backward = false;
					break;
				case 'KeyA':
					keys.left = false;
					break;
				case 'KeyD':
					keys.right = false;
					break;
			}
		};

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			// controls.update();

			//CONTROLS
			    // Update movement direction
				direction.z = Number(keys.forward) - Number(keys.backward);
				direction.x = Number(keys.right) - Number(keys.left);
				direction.normalize(); // this ensures consistent movement in all directions

				// Update velocity
				velocity.z = direction.z * moveSpeed;
				velocity.x = direction.x * moveSpeed;

				controls.moveRight(velocity.x);
				controls.moveForward(velocity.z);

			renderer.render(scene, camera);
		};

		animate();

		setTimeout(() => {
			warning.style.display = 'none';
		}, 5000);
	});

	function createTextureMaterialFromArrayBuffer(arrayBuffer) {
		// Convert ArrayBuffer to Blob
		const blob = new Blob([arrayBuffer]);
		// Create a data URL from the Blob
		const url = URL.createObjectURL(blob);
		return url;
	}
</script>

<canvas bind:this={canvas} />

{#if loading}
	<div
		class="bg-[#333] absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center gap-4 z-20"
	>
		<label class="text-white font-clash-display text-2xl h-[3%]" for={progress_bar}>
			Loading...
		</label>
		<progress
			class=" w-1/3 h-[0.5%] mt-1 bg-black @apply(-webkit-progress-value-bg-black)"
			value={progress_bar}
			max="100"
		/>
	</div>
{/if}

<div
	bind:this={warning}
	class="absolute left-1/2 top-0 -translate-x-1/2 z-20 flex flex-col gap-2 mt-4 text-xs"
>
	{#if !bakedColor}
		<div role="alert" class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Warning! There's no Base Color Texture</span>
		</div>
	{/if}

	{#if !bakedEmission}
		<div role="alert" class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Warning! There's no Emission Texture</span>
		</div>
	{/if}

	{#if !bakedModel}
		<div role="alert" class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Warning! There's no Model provided</span>
		</div>
	{/if}

</div>

{#if !bakedModel && !bakedColor && !bakedEmission && !$isChecked}
	<button on:click={() => {location.reload()}} class="absolute left-1/2 bottom-0 -translate-x-1/2 p-2 mb-2 rounded-xl border border-white" href="/">.go home &#x1F35E</button>
	<h1 class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-5xl text-center">.nothing to load —.—</h1>
{/if}

<style>
	/* Style the progress bar's filled area */
	progress::-webkit-progress-value {
		background-color: white; /* Change to desired color */
	}
</style>

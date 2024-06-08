<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import '/src/style.css';

	let canvas;
	let loading = true;
	let progress_bar = 1;

	export let file;

	let bakedModel;
	let bakedColor;
	let bakedEmission;

	let warning;

	file.forEach((element) => {
		const fileName = element.toLowerCase(); // Ensure case-insensitivity

		if (fileName.includes('color')) {
			bakedColor = element;
		} else if (fileName.includes('emissive')) {
			bakedEmission = element;
		} else if (fileName.includes('model')) {
			bakedModel = element;
		}
	});
	console.log(bakedColor, bakedModel, bakedEmission);

	if (!bakedColor) {
		console.log('there is no baked color');
	}

	onMount(() => {
		// Scene
		const scene = new THREE.Scene();

		// Camera
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		camera.position.y = 2.5;
		camera.position.z = -5;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.toneMappingFolder = THREE.ACESFilmicToneMapping;
		renderer.setSize(window.innerWidth, window.innerHeight);
		//   container.appendChild(renderer.domElement);

		// Orbit Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;

		// Ambient Light
		const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Color, Intensity
		scene.add(ambientLight);

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

		// Load Texture
		const textureLoader = new THREE.TextureLoader(manager);
		const texture = bakedColor ? textureLoader.load(`/models/${bakedColor}`) : null;
		if (texture) {
			texture.flipY = false;
			texture.colorSpace = THREE.SRGBColorSpace;
		}
		//Emissive
		const emissiveTexture = bakedEmission
			? textureLoader.load(`/models/${bakedEmission}`)
			: null;
		if (emissiveTexture) {
			emissiveTexture.flipY = false; // Flip the emissive texture map on the Y axis
			emissiveTexture.encoding = THREE.sRGBEncoding; // Set emissive texture encoding
		}

		// Load 3D Model
		const loader = new GLTFLoader(manager);
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/');
		loader.setDRACOLoader(dracoLoader);

		loader.load(`/models/${bakedModel}`, (gltf) => {
			const model = gltf.scene;
			console.log(model);

			if (emissiveTexture) {
				model.traverse((child) => {
					if (child.isMesh) {
						child.material = new THREE.MeshStandardMaterial({
							map: texture,
							emissiveMap: emissiveTexture,
							emissive: new THREE.Color(0xffffff),
							side: THREE.DoubleSide,
						});
					}
				});
			} else {
				model.traverse((child) => {
					if (child.isMesh) {
						child.material = new THREE.MeshBasicMaterial({
							map: texture,
							side: THREE.DoubleSide,
						});
					}
				});
			}
			scene.add(model);
		});

		// Resize handling
		window.addEventListener('resize', onWindowResize, false);

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		setTimeout(() => {
			warning.style.display = 'none';
		}, 3000);
	});
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
		<div role="alert" class="alert alert-error">
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
			<span>Error! There's no Base Color Texture</span>
		</div>
	{/if}

	{#if !bakedEmission}
		<div role="alert" class="alert alert-error">
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
			<span>Error! There's no Emission Texture</span>
		</div>
	{/if}

	{#if !bakedModel}
		<div role="alert" class="alert alert-error">
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
			<span>Error! There's no Model provided</span>
		</div>
	{/if}
</div>

<style>
	/* Style the progress bar's filled area */
	progress::-webkit-progress-value {
		background-color: white; /* Change to desired color */
	}
</style>

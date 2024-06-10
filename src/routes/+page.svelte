<script>
	import FileUpload from '$lib/FileUpload.svelte';
	import Scene from '$lib/Scene.svelte';
	import Toggle from '$lib/Toggle.svelte';

	let loaded = false;
</script>

{#if loaded}
	<Scene />

	<div class="absolute flex items-center left-0 bottom-0 z-20 gap-2 p-2">
		<div>
			<div class="flex justify-center w-full">
				<kbd class="kbd kbd-sm">W</kbd>
			</div>
			<div class="flex justify-center gap-6 w-full">
				<kbd class="kbd kbd-sm">A</kbd>
				<kbd class="kbd kbd-sm">D</kbd>
			</div>
			<div class="flex justify-center w-full">
				<kbd class="kbd kbd-sm">S</kbd>
			</div>
		</div>
		<svg fill="#777777" class="h-16 bg-gray-900 p-1 rounded-xl" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
			viewBox="0 0 416.031 416.031" xml:space="preserve">
			<path d="M221.605,0h-31.913C123.743,0,72.083,53.745,72.083,122.356v171.306c0,68.618,51.66,122.369,117.609,122.369h31.913
			c67.46,0,122.343-54.894,122.343-122.369V122.356C343.948,54.889,289.065,0,221.605,0z M206.781,64.12h2.469c3.859,0,7,3.14,7,7
			v49.833c0,3.86-3.141,7-7,7h-2.469c-3.859,0-7-3.14-7-7V71.12C199.781,67.26,202.922,64.12,206.781,64.12z M327.948,293.662
			c0,58.652-47.705,106.369-106.343,106.369h-31.913c-56.978,0-101.609-46.723-101.609-106.369V122.356
			C88.083,62.718,132.715,16,189.692,16h10.225v33.167c-9.34,2.927-16.136,11.661-16.136,21.954v49.833
			c0,10.292,6.796,19.027,16.136,21.953v41.166c0,4.418,3.582,8,8,8s8-3.582,8-8v-41.108c9.441-2.865,16.333-11.647,16.333-22.011
			V71.12c0-10.364-6.892-19.146-16.333-22.012V16h5.688c58.638,0,106.343,47.711,106.343,106.356V293.662z"/>
		</svg>
		<!-- <img class="h-16 bg-gray-900 rounded-xl p-1" src="/mouse.svg" alt="mouse ui"> -->
	</div>
{:else}
	<a href="https://github.com/pedrofalco/ice-model-viewer" target="_blank" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>

	<div class="md:w-1/2 flex flex-col items-baseline justify-center h-screen gap-4 mx-auto p-4">
		<p class="select-none text-4xl md:text-6xl md:mb-4 self-center">model &#x1F35E; viewer</p>
		<Toggle/>
		<FileUpload on:submit={(e) => { loaded = e.detail.loaded }} />
	</div>
{/if}


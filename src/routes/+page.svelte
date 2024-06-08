<!-- <canvas bind:this={canvas} /> -->
<script>
	import FileUpload from '$lib/FileUpload.svelte';
	import Scene from '$lib/Scene.svelte';
	import Toggle from '$lib/Toggle.svelte';

	let loaded = false;

	function handleFileSubmit(event) {
		loaded = event.detail.loaded;
	}
</script>

{#if loaded}
	<Scene />
{:else}
	<div class="flex flex-col items-baseline justify-center w-fit h-screen gap-4 mx-auto">
		<p class="select-none text-5xl mb-4">model &#x1F9CA; viewer</p>
		<Toggle/>
		<FileUpload on:submit={handleFileSubmit} />
	</div>
{/if}

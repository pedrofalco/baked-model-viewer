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
	<div class="w-1/2 flex flex-col items-baseline justify-center h-screen gap-4 mx-auto">
		<p class="select-none text-6xl mb-4 self-center">model &#x1F9CA; viewer</p>
		<Toggle/>
		<FileUpload on:submit={handleFileSubmit} />
	</div>
{/if}

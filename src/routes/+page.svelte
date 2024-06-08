<!-- <canvas bind:this={canvas} /> -->
<script>
	import FileUpload from '$lib/FileUpload.svelte';
	import Scene from '$lib/Scene.svelte';

	let message = '';
	let loaded = false;

	function handleFileSubmit(event) {
		message = event.detail.message;

		loaded = true;
		console.log(message.files);
	}
</script>

{#if loaded}
	<!-- <div class="mt-4 p-4 bg-green-100 text-green-700 rounded">
	{message}
	</div> -->

	<Scene file={[...message.files]} />
{:else}
	<FileUpload on:submit={handleFileSubmit} />
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>

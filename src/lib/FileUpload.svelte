<script>
	import '/src/style.css';
	import { files } from '$lib/store';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// let drop_area;
	// const handleDrop = (e) => {
	// 	console.log(e.dataTransfer.file);
	// };

	let localFiles = [null, null, null];
	let finalFiles = [];

    function handleFileChange(event, index) {
        const file = event.target.files[0];
        localFiles[index] = file;
        files.set(localFiles);
    }

	function handleSubmit() {
		console.log('Submitted localFiles:', localFiles);
		localFiles.forEach((file, index) => {
			if (file) {
				console.log(`File ${index + 1}: ${file.name} (${Math.round(file.size / 1024)} KB)`);
				localFiles.push(file.name);
			} else {
				console.log(`File ${index + 1}: No file selected`);
			}
		});
		// Dispatch an event to notify the parent component
		dispatch('submit', { loaded: true });
	}
</script>

<!-- <div
	bind:this={drop_area}
	class="w-full h-screen border-2 border-dashed border-gray-400 flex items-center justify-center text-2xl text-gray-400 hover:border-black hover:text-black"
	on:drop|preventDefault={(event) => handleDrop(event)}
	on:dragover|preventDefault={() => null}
>
	Drop files here
</div> -->

<label class="form-control w-full max-w-sm">
	<div class="label">
		<span class="label-text">.model</span>
	</div>
	<input
		on:change={(e) => handleFileChange(e, 0)}
		type="file"
		class="file-input file-input-sm file-input-bordered w-full max-w-sm"
	/>
</label>
{#if localFiles[0]}
	<div class="text-xs">
		{localFiles[0].name} ({Math.round(localFiles[0].size / 1024)} KB)
	</div>
{/if}
<label class="form-control w-full max-w-sm">
	<div class="label">
		<span class="label-text">.base-color-texture</span>
	</div>
	<input
		on:change={(e) => handleFileChange(e, 1)}
		type="file"
		class="file-input file-input-sm file-input-bordered w-full max-w-sm"
	/>
</label>
{#if localFiles[1]}
	<div class="text-xs">
		{localFiles[1].name} ({Math.round(localFiles[1].size / 1024)} KB)
	</div>
{/if}
<label class="form-control w-full max-w-sm">
	<div class="label">
		<span class="label-text">.emissive-texture</span>
	</div>
	<input
		on:change={(e) => handleFileChange(e, 2)}
		type="file"
		class="file-input file-input-sm file-input-bordered w-full max-w-sm"
	/>
</label>
{#if localFiles[2]}
	<div class="text-xs">
		{localFiles[2].name} ({Math.round(localFiles[2].size / 1024)} KB)
	</div>
{/if}
<button class="btn btn-glass btn-sm" on:click={handleSubmit}>.submit-localFiles</button>
<script>
	import '/src/style.css';
	import { files } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import Dropzone from "svelte-file-dropzone";

	const dispatch = createEventDispatcher();
	
	let droppedFiles = {
		accepted: [],
		rejected: []
	};

	function handleFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		droppedFiles.accepted = [...droppedFiles.accepted, ...acceptedFiles];
		droppedFiles.rejected = [...droppedFiles.rejected, ...fileRejections];

		files.set(droppedFiles.accepted);
	}

	let localFiles = [null, null, null];
	let finalFiles = [];

    // function handleFileChange(event, index) {
    //     const file = event.target.files[0];
    //     localFiles[index] = file;
    //     files.set(localFiles);
    // }

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


<Dropzone disableDefaultStyles containerClasses={'bg-gray-800 h-56 w-full border-dashed border-2 rounded-sm border-[#777] flex justify-center items-center p-4 text-sm italic'} on:drop={handleFilesSelect}>drag 'n' drop your files here, or click to select files</Dropzone>

{#if droppedFiles.accepted[0]}
	<div class="text-xs">
		{droppedFiles.accepted[0].name} ({Math.round(droppedFiles.accepted[0].size / 1024)} KB)
	</div>
{/if}
{#if droppedFiles.accepted[1]}
	<div class="text-xs">
		{droppedFiles.accepted[1].name} ({Math.round(droppedFiles.accepted[1].size / 1024)} KB)
	</div>
{/if}
{#if droppedFiles.accepted[2]}
	<div class="text-xs">
		{droppedFiles.accepted[2].name} ({Math.round(droppedFiles.accepted[2].size / 1024)} KB)
	</div>
{/if}

<button class="btn btn-glass btn-sm self-end" on:click={handleSubmit}>.submit-localFiles</button>


<!-- INPUT FILE APPROACH -->
<!-- <label class="form-control w-full max-w-sm">
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

<button class="btn btn-glass btn-sm" on:click={handleSubmit}>.submit-localFiles</button> -->



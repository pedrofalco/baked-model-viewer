<script>
	import '/src/style.css';
	import { files } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import Dropzone from "svelte-file-dropzone";

	const dispatch = createEventDispatcher();
	
	let localFiles = [];

	function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;
		localFiles = [...acceptedFiles];
		acceptedFiles.forEach(file => {
			const reader = new FileReader();
			
			reader.onload = () => {
				const fileObject = {
				path: file.name,
				data: reader.result
				};
				files.update(existingFiles => [...existingFiles, fileObject]);
			};
			reader.readAsArrayBuffer(file); // or readAsDataURL(file) depending on your needs
		});
  	}

	function handleSubmit() {
		dispatch('submit', { loaded: true });
	}
</script>


<div class="w-full space-y-2">
	<Dropzone disableDefaultStyles containerClasses={'bg-gray-800 h-56 border-dashed border-2 rounded-sm border-[#777] flex justify-center items-center p-4 text-sm italic tracking-tight'} on:drop={handleFilesSelect}>drag & drop your files here —— click to select files</Dropzone>
	
	{#each localFiles as file}
		<div class="text-xs">
			{file.path} ({Math.round(file.size / 1024)} KB)
		</div>
	{/each}

</div>
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



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
	<Dropzone disableDefaultStyles containerClasses={'flex flex-col text-center gap-3 bg-gray-800 h-56 border-dashed border-2 rounded-sm border-[#777] flex justify-center items-center p-4 text-xl tracking-tight'} on:drop={handleFilesSelect}>.drop your files here<span class="text-xs">make sure to include the words <b>color</b>, <b>emissive</b>, and/or <b>alpha</b> in your image texture filenames.</span></Dropzone>
	
	{#each localFiles as file}
		<div class="text-xs">
			{file.path} ({Math.round(file.size / 1024)} KB)
		</div>
	{/each}

</div>
<button class="btn btn-glass btn-sm self-end" on:click={handleSubmit}>.submit-localFiles</button>
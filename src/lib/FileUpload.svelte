<script>
	import { onMount } from 'svelte';
	import '/src/style.css';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// let drop_area;
	// const handleDrop = (e) => {
	// 	console.log(e.dataTransfer.file);
	// };

	let files = Array(3).fill(null);
	let finalFiles = [];

	function handleFileChange(event, index) {
		files = [...files];
		files[index] = event.target.files[0];
	}

	function handleSubmit() {
		console.log('Submitted files:', files);
		files.forEach((file, index) => {
			if (file) {
				console.log(`File ${index + 1}: ${file.name} (${Math.round(file.size / 1024)} KB)`);
				finalFiles.push(file.name);
			} else {
				console.log(`File ${index + 1}: No file selected`);
			}
		});
		// You can perform additional actions here, such as sending the files to a server
		// Dispatch an event to notify the parent component
		dispatch('submit', {
			message: {
				response: 'ok',
				files: [...finalFiles],
			},
		});
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

<div class="flex flex-col items-center justify-center h-screen gap-4">
	<p class="select-none text-5xl mb-4">model &#x1F9CA; viewer</p>
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
	{#if files[0]}
		<div class="text-xs">
			{files[0].name} ({Math.round(files[0].size / 1024)} KB)
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
	{#if files[1]}
		<div class="text-xs">
			{files[1].name} ({Math.round(files[1].size / 1024)} KB)
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
	{#if files[2]}
		<div class="text-xs">
			{files[2].name} ({Math.round(files[2].size / 1024)} KB)
		</div>
	{/if}
	<button class="btn btn-glass btn-sm" on:click={handleSubmit}>.submit-files</button>
</div>

<!-- <div class="w-1/2 text-white flex flex-col justify-center h-screen mx-auto gap-4">
							<div class="flex justify-between">
								<label for="file-input-1" class="flex-grow">Model</label>
								<input
								id="file-input-1"
								type="file"
								class="text-sm focus:outline-none"
								on:change={(e) => handleFileChange(e, 0)}
								/>
								{#if files[0]}
								<div class="text-xs">
									{files[0].name} ({Math.round(files[0].size / 1024)} KB)
			</div>
		{/if}
	</div>

	<div class="flex justify-between">
		<label for="file-input-2" class="flex-grow">Base Color Texture</label>
		<input
			id="file-input-2"
			type="file"
			class="text-sm focus:outline-none"
			on:change={(e) => handleFileChange(e, 1)}
		/>
		{#if files[1]}
			<div class="text-xs">
				{files[1].name} ({Math.round(files[1].size / 1024)} KB)
			</div>
		{/if}
	</div>

	<div class="flex justify-between">
		<label for="file-input-3" class="flex-grow">Emmisive Texture</label>
		<input
			id="file-input-3"
			type="file"
			class="text-sm focus:outline-none"
			on:change={(e) => handleFileChange(e, 2)}
		/>
		{#if files[2]}
			<div class="text-xs">
				{files[2].name} ({Math.round(files[2].size / 1024)} KB)
			</div>
		{/if}
	</div>

	<button
		on:click={handleSubmit}
		class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
	>
		Submit Files
	</button>
</div> -->

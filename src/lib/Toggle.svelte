<script>
        import { isChecked } from '$lib/store';

        const handleToggleChange = (event) => {
            isChecked.set(event.target.checked);
        }
</script>

<div class="form-control">
    <label class="label cursor-pointer space-x-5">
    <span class="label-text">.default-arcade-room</span> 
    <input type="checkbox" class="toggle toggle-success toggle-sm" 
    on:change={handleToggleChange}
    bind:checked={$isChecked} />
    </label>
</div>
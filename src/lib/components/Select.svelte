<script>
    export let label = "";
    export let id = "";
    export let placeholder = "";
    export let value = "";

    export let defaultText = "";
    export let optionsList = [];

    const onChange = e => (value = e.target.value);
</script>

<div class="form-control">
    <label class="label" for={id}>
        <span class="label-text">{label}</span>
    </label>
    <select {placeholder} {id} on:change={onChange} class="input input-bordered">
        <option value="" selected disabled hidden>{defaultText}</option>
        {#each optionsList as item}
            <option value={item.value}>{item.name}</option>
        {/each}
    </select>
</div>
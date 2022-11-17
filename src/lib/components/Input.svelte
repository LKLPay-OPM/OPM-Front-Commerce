<script>
	import Icons from '$lib/components/Icons.svelte';
    export let label = "";
    export let type = "";
    export let id = "";
    export let placeholder = "";
    export let value = "";
    export let accept = "";
    export let className = "";
		export let icon = "";
    const onInput = e => (value = e.target.value);
</script>

<div class={`form-control ${className}`}>
    <label class="label" for={id}>
        <span class="label-text">
          {label}
          {#if icon != ""}
            <Icons name={icon} width="24" height="24"/>
          {/if}
        </span>
    </label>
    <input on:click {type} {placeholder} {id} {value} on:input={onInput} class={`input input-bordered`} {accept}>
</div>

<style>
.form-control {
  display: flex;
  flex-direction: column
}

.label {
  display: flex;
  -webkit-user-select: none;
          user-select: none;
  align-items: center;
  justify-content: space-between
}

.label-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: row;
}

.input {
  flex-shrink: 1;
  height: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;
}

.button{
 margin: 10px;  
}
 
.button label {
	background-color: darkslateblue;
	display: flex;
  -webkit-user-select: none;
          user-select: none;
  align-items: center;
  justify-content: space-between;
	cursor: pointer;
  border: none;
  padding: .5rem 1.5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1px;
  cursor: pointer;
}

.button input {
	display: none;
}

.button label .label-text {
	color: darkgray;
	font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
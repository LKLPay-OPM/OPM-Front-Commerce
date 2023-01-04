<script>
	import Icons from '$lib/components/Icons.svelte';
  export let label = "";
  export let id = "";
  export let value = "";
  export let className = "";
  export let icon = "";
  export let title = "";
  export let min = 0;
  export let max = 0;
  export let list = "";
  export let step = 0;
  
  const onInput = e => {
    if(isNaN(e.target.value)){
      value = e.target.value
    }else {
      value = Math.round((e.target.value) * 100) / 100
    }
  };
</script>

<div class={`slider-wrapper ${className}`}>
    <label title={title} class="label" for={id}>
        <span class="label-text">
          {label}
          {#if icon != ""}
            <Icons name={icon} width="24" height="24"/>
          {/if}
        </span>
    </label>
    <input type="range" min={min} max={max} list={list} step={step} {id} {value} on:input={onInput} on:change={onInput}>
    <!-- <label title={title} class="label" for={id}>
        <span class="label-text">
          {value}
          {#if icon != ""}
            <Icons name={icon} width="24" height="24"/>
          {/if}
        </span>
    </label> -->
</div>

<style>
  .slider-wrapper {
    display: inline-block;
    width: 100%;
    height: 2rem;
    padding: 2rem 0rem;
  }

  .slider-wrapper input {
    width: 100%;
    margin: 0;
    transform-origin: 75px 75px;
  }
</style>
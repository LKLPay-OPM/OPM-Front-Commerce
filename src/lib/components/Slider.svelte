<script>
  import Icons from "$lib/components/Icons.svelte";
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

  const onInput = (e) => {
    if (isNaN(e.target.value)) {
      value = e.target.value;
    } else {
      value = Math.round(e.target.value * 100) / 100;
    }
  };
</script>

<div class={`slider-wrapper ${className}`}>
  <label {title} class="label" for={id}>
    <span class="label-text">
      {label}
      {#if icon != ""}
        <Icons name={icon} width="24" height="24" />
      {/if}
    </span>
  </label>
  <input
    class="slider"
    type="range"
    {min}
    {max}
    {list}
    {step}
    {id}
    {value}
    on:input={onInput}
    on:change={onInput}
  />
  <!-- <label title={title} class="label" for={id}>
        <span class="label-text">
          {value}
          {#if icon != ""}
            <Icons name={icon} width="24" height="24"/>
          {/if}
        </span>
    </label> -->
</div>

<style lang="scss">
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

  label {
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 125% */
    display: flex;
    align-items: flex-end;
    justify-content: right;
    /* Text */
    color: $primary-dark;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 1.25rem; /* 20px */
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    background: linear-gradient(134.17deg, #eef1f5 4.98%, $background-light-accent-secondary 94.88%);
    box-shadow: inset -5px -5px 15px rgba(255, 255, 255, 0.75),
      inset 5px 5px 10px rgba(166, 180, 200, 0.75);
    border-radius: 40px;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border: 5px solid #eef0f5;
    /* background: #04AA6D; */
    background: linear-gradient(108.3deg, #7fc2ff 23.49%, #75bdff 76.7%);
    box-shadow: inset 5px -4px 10px #6bb8fe;
    cursor: pointer;
    border-radius: 50%;
  }

  /* .slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #04AA6D;
  cursor: pointer;
} */
</style>

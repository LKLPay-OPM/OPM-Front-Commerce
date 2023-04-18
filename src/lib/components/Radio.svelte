<script>
  export let options;
  export let legend;
  export let userSelected = options[0].value;
  export let fontSize = 16;
  export let flexDirection = "column";

  const uniqueID = Math.floor(Math.random() * 100);

  const slugify = (str = "") =>
    str.toLowerCase().replace(/ /g, "-").replace(/\./g, "");
</script>

<div
  role="radiogroup"
  class="group-container"
  aria-labelledby={`label-${uniqueID}`}
  style="font-size:{fontSize}px; flex-direction:{flexDirection}"
  id={`group-${uniqueID}`}
>
  <div class="legend" id={`label-${uniqueID}`}>{legend}</div>
  {#each options as { value, label }}
    <input
      class="sr-only"
      type="radio"
      id={slugify(label)}
      bind:group={userSelected}
      {value}
    />
    <label for={slugify(label)}> {label} </label>
  {/each}
</div>

<style lang="scss">
  :root {
    --accent-color: linear-gradient(#50caff 0%, #0478ff 100%);
    --gray: #ccc;
  }

  .group-container {
    border-radius: 2px;
    display: flex;
    flex-direction: row;
  }

  .legend {
    font-weight: bold;
  }
  label {
    user-select: none;
    line-height: 1.2em;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* Text */
    color: #8c9fb1;
  }

  .sr-only {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }

  input[type="radio"] {
    position: absolute;
  }

  input[type="radio"]:checked + label {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 125% */
    /* display: flex; */
    /* align-items: center; */
    /* Text */
    color: $primary-dark;
  }

  input[type="radio"] + label {
    display: block;
    position: relative;
    text-align: left;
  }

  input[type="radio"] + label::before {
    content: "";
    position: relative;
    display: inline-block;
    margin-right: 0.5em;
    width: 1em;
    height: 1em;
    background: transparent;
    border: 1px solid $grey;
    border-radius: 50%;
    top: 0.2em;
  }

  input[type="radio"]:checked + label::before {
    border: 1px solid $grey;
    border-radius: 50%;
    /* Text */
    color: $primary-dark;
  }

  input[type="radio"] + label::after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    top: 0.25rem;
    left: 0.05rem;
    background: var(--accent-color);
    border: 1px solid var(--accent-color);
    border-radius: 50%;
    transform: scale(0);
  }

  input[type="radio"]:checked + label::after {
    opacity: 1;
    transform: scale(1);
  }

  input[type="radio"]:focus + label::before {
    box-shadow: 0 0 0 1px var(--accent-color);
    border-radius: 50%;
  }

  input[type="radio"]:disabled + label {
    color: darken($grey, 10);
  }

  input[type="radio"]:disabled + label::before {
    background: $grey;
  }
  /* gravy */

  input[type="radio"] + label::before {
    transition: background 0.3s ease-out;
  }

  input[type="radio"]:checked + label::before {
    transition: background 0.3s ease-in;
  }

  input[type="radio"] + label::after {
    transition: transform 0.2s ease-out;
  }

  input[type="radio"]:checked + label::after {
    transition: transform 0.2s ease-in;
  }

  input[type="radio"]:focus + label::before {
    box-shadow: 0 0px 8px var(--accent-color);
    border-radius: 50%;
  }
</style>

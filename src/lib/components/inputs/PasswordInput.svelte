<script>
  import EyeOpen from "$lib/components/icons/EyeOpen.svelte";
  import EyeClosed from "$lib/components/icons/EyeClosed.svelte";
  import { createEventDispatcher } from "svelte";
  export let label = "";
  export let id = "";
  export let name = "";
  export let placeholder = "";
  export let className = "";
  export let icon = "";
  export let title = "";
  export let value = "";
  let toggle = false;
  const onInput = (e) => {
    value = e.target.value;
  };

  const iconComponents = (toggle) => {
    const components = {
      false: { component: EyeOpen },
      true: { component: EyeClosed },
    };
    return components[toggle].component;
  };
</script>

<div class={`${className}`}>
  <label {title} class="label" for={id}>
    <span class="label-text">
      {label}
    </span>
  </label>
  <div class={`input ${icon != "" ? "" : "row"}`}>
    <input
      class="input-field"
      on:click
      type={toggle ? "text" : "password"}
      {placeholder}
      {id}
      {value}
      name={`${name}`}
      on:input={onInput}
    />
    <div class="icon">
      <label for="passwordIcon">
        <i><svelte:component this={iconComponents(toggle)} /></i>
      </label>
      <input on:click={() => (toggle = !toggle)} id="passwordIcon" type="button" />
    </div>
  </div>
</div>

<style lang="scss">
  .icon {
    input {
      display: none;
    }

    i {
      color: $grey;
    }
  }

  .input .input-field {
    border: none;
    outline: none;
    // max-width: 3.75rem;
    min-width: 80%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: 0.5rem; /* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: $primary-dark;
  }

  .txt-field label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $grey;
  }
  .txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    /* border: none; */
    border: 2px solid;
    border-radius: 4px;
    padding: 0.5rem; /* 8px */
    /* TEXT */
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $primary-dark;
    margin: 0 0 0.5rem 0;

    input {
      font-weight: 600;
      font-size: 0.8125rem; /* 13px */
      line-height: 1.125rem; /* 18px */
    }
  }

  .txt-field > .input {
    .icon {
      display: flex;
      justify-content: center;

      label {
        margin: 0;
      }
    }
  }

  .txt-field.icon-right .input {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    justify-content: space-between;
    flex-direction: row-reverse;
  }
  .txt-field.icon-right .input.row {
    flex-direction: row;
  }
  .txt-field.icon-right .input-field {
    font-weight: 600;
    font-size: 1rem; /* 16px */
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  .txt-field input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }
  .disabled-txt-field label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $grey;
  }
  .disabled-txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: 0.5rem; /* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 1.25rem; /* 20px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: $primary-dark;
  }

  .disabled-txt-field input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }

  .normal .input {
    outline: none;
    background: linear-gradient(background-light-accent-primary, #e6e8ef) padding-box,
      linear-gradient(187deg, #ffffff, #d6e3f3) border-box;
    border-radius: 4px;
    border: 2px solid transparent;
  }
  .valid .input {
    outline-color: #00c48c;
    border-color: #00c48c;
  }

  .invalid > .input {
    outline-color: #ff0000;
    border-color: #ff0000;
  }

  .fill-blue label {
    font-size: 0.875rem;
    color: $primary-dark;
  }
  .thin label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0 0 0.3rem 0;
  }

  .label-white label {
    color: $background-light-secondary;
  }
  .label-blue label {
    color: $primary-dark;
  }
</style>

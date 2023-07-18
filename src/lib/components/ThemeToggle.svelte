<script>
  /* svelte */
  import { darkMode } from "$lib/stores";
  /* component */
  import Icons from "$lib/components/Icons.svelte";
  import { onMount } from "svelte";
  function toggle() {
    // window.document.body.classList.toggle("dark-mode");
    $darkMode = !$darkMode;
  }

  let icon = "";
  $: {
    if ($darkMode) {
      // window.document.body.classList.add("dark-mode");
      icon = "moon";
    } else {
      // window.document.body.classList.remove("dark-mode");
      icon = "sun";
    }
  }

  onMount(() => {});
</script>

<div class="appearance">
  <span class="caption">Theme</span>
  <button on:click={toggle} type="button" aria-pressed="true" aria-label="Dark mode" class="">
    <span class={`check ${$darkMode ? "checked" : ""}`}>
      <span class="icon">
        {#key icon}
          <Icons name={icon} width="16" height="16" />
        {/key}
      </span>
    </span>
  </button>
</div>

<style lang="scss">
  .appearance {
    align-items: center;
    margin: 0.5rem 0 0.5rem 20px;
    display: flex;
    .caption {
      font-size: 1.3rem;
      margin-right: 0.5rem;
      line-height: 1;
      display: none;
    }
  }

  button {
    cursor: pointer;
    border: 1px solid $grey;
    background-color: $background-light-secondary;
    border-radius: 11px;
    flex-shrink: 0;
    width: 40px;
    height: 22px;
    transition: border-color 0.25s;
    display: block;
    position: relative;
  }

  .check {
    background-color: lighten($color: $grey, $amount: 20);
    pointer-events: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    transition: -webkit-transform 0.25s, transform 0.25s;
    position: absolute;
    top: 1px;
    left: 1px;
    box-shadow: 0 1px 2px #0000000a, 0 1px 2px #0000000f;
    &.checked {
      transform: translate(18px);
    }
  }

  .icon {
    color: $grey;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: block;
    position: relative;
    overflow: hidden;
  }

  :global(body.dark-mode) {
    button {
      border: 1px solid $grey;
      background: $background-dark-secondary;
    }

    .check {
      background: lighten($color: $background-dark-accent-primary, $amount: 10);
    }

    .icon {
      color: $grey;
    }
  }
</style>

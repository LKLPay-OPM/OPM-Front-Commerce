<script>
  import {
    booleanStore,
    toastMsg,
    toastShown,
    toastType,
    toast,
  } from "$lib/stores";
  import Icons from "$lib/components/Icons.svelte";
  /* utils */
  import {
    errorCustomMsgToast,
    successCustomMsgToast,
    tryAgainErrorToast,
  } from "$lib/utils/toast.js";
  import { onMount } from "svelte";

  const store = booleanStore(false);
  const { isOpen, open, close } = store;
  let dialog = "";
  let shown = false;
  let isShown = $toastShown;
  let type = $toastType;
  let text = $toastMsg;
  export let className = "";
  export let transparent = false;

  const backdropClick = (event) => {
    event.target === dialog && dialog.close(event);
  };

  export const show = () => {
    dialog.showModal();
    shown = true;
  };
  export const closeModal = () => {
    dialog.close();
    shown = false;
  };

  const modal = () => {};

  const getToastType = (type, text) => {
    if (type === "error") {
      if (text != "") {
        errorCustomMsgToast(`${text}`);
      }
      tryAgainErrorToast();
    } else {
      successCustomMsgToast(`${text}`);
    }
  };

  $: {
    if (isShown) {
    }
  }
</script>

<!-- <slot name="trigger" /> -->
<div class="modal-container">
  <dialog {type} {text}>
    <div>
      <!-- {successCustomMsgToast(`${text}`)} -->
      {#if isShown}
        {getToastType(type, text)}
      {/if}
    </div>
  </dialog>
</div>

<style lang="scss">
  .close-modal {
    display: flex;
    flex-direction: row-reverse;
  }
  .close-modal input {
    display: none;
  }

  .close {
    color: $primary-dark;
    &:hover {
      color: $red;
      transition: all 0.4s ease;
    }
  }
  .modal-medium {
    width: 30rem;
  }
  .modal-small {
    width: 20rem;
  }
  dialog::backdrop {
    background-color: transparent;
  }

  * {
    box-sizing: border-box;
  }
  dialog {
    /* margin: auto;
    padding: 0;
    position: fixed;
    inset: 0;
    border-radius: 10px;
    border: none;
    outline: none; */
  }
  div.modal-container {
    /* position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh; */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
  }

  .content-wrapper {
    z-index: 10;
    /* max-width: 70vw; */
    border-radius: 0.3rem;
    background: white;
    overflow: hidden;
    padding: 1rem;
  }
  .header {
    margin: 10px;
    display: flex;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    align-items: center;
    color: $primary-dark;
    width: 100%;
  }
  .content {
    max-height: 50vh;
    overflow: auto;
    padding: 15px;
  }

  .footer {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  :global(body.dark-mode) {
    dialog {
      background: $background-dark-secondary;
      box-shadow: none;
    }

    .close {
      color: $font-dark-primary;
      &:hover {
        color: $red;
      }
    }
    .content-wrapper {
      background: $background-dark-secondary;
      // box-shadow: $dark-box-shadow-card;
    }

    .header {
      color: $font-dark-primary;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }

    dialog.transparent::backdrop {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
</style>

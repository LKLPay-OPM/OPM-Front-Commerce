<script>
  import { booleanStore, toastId } from "$lib/stores";
  import Icons from "$lib/components/Icons.svelte";

  const store = booleanStore(false);
  const { isOpen, open, close } = store;
  let dialog;
  let shown = false;
  export let className = "";
  export let transparent = false;
  export let id = "";

  const backdropClick = (event) => {
    event.target === dialog && dialog.close(event);
  };

  export const show = () => {
    $toastId = id;
    dialog.showModal();
    shown = true;
  };
  export const closeModal = () => {
    $toastId = "";
    dialog.close();
    shown = false;
  };
</script>

<!-- <slot name="trigger" /> -->
<div class="modal-container">
  <dialog {id} class={`${className} ${transparent ? "transparent" : ""}`} bind:this={dialog} on:click={backdropClick}>
    {#if shown}
      <div class="content-wrapper">
        <div class="close-modal">
          <label class="clickable close" for="closeModalButton">
            <i>
              <Icons name="close" width="24" height="24" />
            </i>
          </label>
          <input on:click={closeModal} id="closeModalButton" type="button" />
        </div>
        <div class="header">
          <slot name="header" />
        </div>
        <div class="content">
          <slot name="content" />
        </div>
        <div class="footer">
          <slot name="footer" />
        </div>
      </div>
    {/if}
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
    background-color: rgba(0, 0, 0, 0.4);
  }
  dialog.transparent::backdrop {
    background-color: rgba(0, 0, 0, 0.1);
  }

  * {
    box-sizing: border-box;
  }
  dialog {
    margin: auto;
    padding: 0;
    position: fixed;
    inset: 0;
    background: $background-light-secondary;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    border: none;
    outline: none;
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
    padding: 1rem 0;
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

<script>
  import { booleanStore } from "../stores";

  const store = booleanStore(false);
  const { isOpen, open, close } = store;
  let dialog;
  export let className = "";

  export const show = () => {
    dialog.showModal();
  };
  export const closeModal = () => {
    dialog.close();
  };
</script>

<slot name="trigger">
  <!-- fallback trigger to open the modal -->
  <!-- <button on:click={open}>Open</button> -->
</slot>
<div class="modal-container">
  <dialog class={`${className}`} bind:this={dialog}>
    <div class="content-wrapper">
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
  </dialog>
</div>

<style lang="scss">
  .modal-medium {
    width: 30rem;
  }
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
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
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    border: none;
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
    background-color: white;
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
    display: flex;
    align-items: center;
    color: $primary-dark;
  }
  .content {
    max-height: 50vh;
    overflow: auto;
    margin: 15px;
  }

  .footer {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
</style>

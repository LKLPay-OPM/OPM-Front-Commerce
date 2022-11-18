<script>
	import { booleanStore } from '../stores'

  const store = booleanStore(false)
  const { isOpen, open, close } = store
  function keydown(e) {
    // e.stopPropagation()
    if (e.keyCode == 27) {
      close
    }
  }
</script>

<slot name="trigger" {open}>
  <!-- fallback trigger to open the modal -->
  <button on:click={open}>Open</button>
</slot>
{#if $isOpen}
  <div class="modal" >
    <div class="backdrop" on:click={close} on:keydown={keydown}/>
    <div class="content-wrapper">
      <slot name="header" {store}>
        <!-- fallback -->
      </slot>

      <div class="content">
        <slot name="content" {store} />
      </div>

      <slot name="footer" {store}>
        <!-- fallback -->
      </slot>
    </div>

  </div>
{/if}

<style>
  div.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
  }
  div.modal:not(:focus-within) {
    transition: opacity 0.1ms;
    opacity: 0.99;
  }
  div.backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    width: 100vw;
    height: 100%;
  }
  div.content-wrapper {
    z-index: 10;
    max-width: 70vw;
    border-radius: 0.3rem;
    background-color: white;
    overflow: hidden;
		padding: 1rem;
  }

  div.content {
    max-height: 50vh;
    overflow: auto;
  }
</style>
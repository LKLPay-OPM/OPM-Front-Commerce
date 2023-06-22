<script>
  // import { createEventDispatcher } from 'svelte'

  /* props */
  export let placeholder;

  /* dispatcher */
  // const dispatch = createEventDispatcher()
</script>

<div class="write-comment__container">
  <button type="button" on:click>{placeholder}</button>
</div>

<style lang="scss">
  .write-comment__container {
    margin: 12px 0;
  }

  button {
    padding: 16px 20px;
    border-radius: 25px;
    background-color: lighten($grey, $amount: 30);
    border-width: none;
    border-style: none;
    color: rgb(0 0 0 / 20%);
    display: block;
    width: 100%;
    font-size: 15px;
    &:hover {
      cursor: pointer;
      background-color: lighten($grey, $amount: 28);
    }
  }
</style>

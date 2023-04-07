<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { createEventDispatcher } from "svelte";
  /* variables */
  export let paginationStart;
  export let paginationEnd;
  export let count;

  const dispatch = createEventDispatcher();

  function paginationBack() {
    paginationStart -= 10;
    paginationEnd -= 10;
    dispatch("pagination");
    if (paginationStart > 0) {
      paginationStart -= 10;
      paginationEnd -= 10;
    }
  }
  function paginationFwd() {
    paginationStart += 10;
    paginationEnd += 10;
    dispatch("pagination");
    if (count > paginationEnd) {
      paginationStart += 10;
      paginationEnd += 10;
    }
  }
</script>

<div class="btns-pagination">
  <div class="button">
    <input type="button" id="PaginationBack" on:click={paginationBack} />
    <label for="PaginationBack">
      <i class="arrow-blue">
        <Icons name="arrow-bwd" width="24" height="24" />
      </i>
    </label>
  </div>
  <div class="pagination-text">
    {paginationStart + 1} - {paginationEnd}
  </div>
  <div class="button">
    <input type="button" id="PaginationFwd" on:click={paginationFwd} />
    <label for="PaginationFwd">
      <i class="arrow-blue">
        <Icons name="arrow-fwd" width="24" height="24" />
      </i>
    </label>
  </div>
</div>

<style>
  /* Paginación */
  .btns-pagination {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .pagination-text {
    font-weight: 700;
    font-size: 1rem; /* 16px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: #113a62;
    align-self: center;
  }

  .button input {
    display: none;
  }
</style>

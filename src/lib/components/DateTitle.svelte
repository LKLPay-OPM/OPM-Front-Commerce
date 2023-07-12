<script>
  /* utils */
  import { getMonthName } from "$lib/utils/date";

  export let date = new Date();
</script>

<div class="title">
  <p>
    {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
  </p>
</div>

<style lang="scss">
  .title p {
    font-style: normal;
    font-weight: 700;
    font-size: 1.5rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* text-placeholder */
    color: #113a62;
  }

  :global(body.dark-mode) {
    .title {
      p {
        color: $font-dark-primary;
      }
    }
  }
</style>

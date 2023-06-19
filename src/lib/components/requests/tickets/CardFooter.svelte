<script>
  import { getPastRelativeTime } from "$lib/utils/date";

  /* props */
  export let date;
</script>

<div>
  <p>{getPastRelativeTime(date)}</p>
</div>

<style lang="scss">
  p {
    padding: 12px 0 6px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 300;
    text-transform: capitalize;
    font-size: 12px;
  }
</style>

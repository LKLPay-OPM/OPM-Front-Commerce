<script>
  /* components */
  import StatusBadge from "$lib/components/requests/StatusBadge.svelte";
  /* variables */
  export let id;
  export let type;
  export let status;
  // export let statusClass = "green";
</script>

<div class="card-header">
  <div class="card-left">
    <p>{type ?? ""}</p>
  </div>
  <StatusBadge {status} />
</div>
<div class="card-subtitle">
  <p>#{id}</p>
</div>

<style lang="scss">
  .card-header,
  .card-subtitle {
    width: 100%;
  }
  .card-header {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 3px;
    .card-left {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      text-align: left;
    }
  }

  .card-subtitle {
    font-weight: 500;
    text-align: left;
    font-size: 14px;
    color: rgb(0 0 0 / 30%);
    padding-top: 3px;
    padding-bottom: 12px;
  }
</style>

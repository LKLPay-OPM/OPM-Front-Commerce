<script>
  export let id;
  export let type;
  export let status;
  export let statusClass = "green";
</script>

<div class="card-header">
  <div class="card-left">
    <p>{type ?? "mucho sex"}</p>
  </div>
  <div class="card-right {statusClass}">
    <p>{status ?? "Queso"}</p>
  </div>
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
    .card-right {
      p {
        text-align: right;
        position: relative;
        z-index: 1;
        display: inline-block;
        &::before {
          position: absolute;
          content: "";
          top: 50%;
          left: -12px;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          z-index: 2;
        }
      }
      &.green {
        p::before {
          background-color: green;
        }
      }
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

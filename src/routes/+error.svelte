<script>
  /* app */
  import { page } from "$app/stores";
  /* components */
  // import ErrorLogo from "$lib/components/Error.svelte";
  import Icons from "$lib/components/Icons.svelte";

  $: {
    console.error($page.status + ": " + $page.error.message);
  }
</script>

<div class="container">
  <div class="title">Ups, Algo salió mal</div>
  <div class="svg">
    <Icons name="close-circle-line" width="150" height="150" />
    <!-- <ErrorLogo /> -->
  </div>
  <div class="title">{$page.status}</div>
  <div class="subtitle">{$page.error.message}</div>
</div>

<style lang="scss">
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .svg {
    display: flex;
    justify-content: center;
    color: $error-light;
  }

  .title {
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b9eb0;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b9eb0;
  }
</style>

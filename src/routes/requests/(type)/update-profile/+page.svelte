<script>
  /* components */
  import EditProfile from "$lib/components/EditProfile.svelte";

  export let data;
  let user = data?.profile;

  $: {
    // console.log(data);
  }
</script>

<EditProfile {user} />

<style lang="scss">
</style>

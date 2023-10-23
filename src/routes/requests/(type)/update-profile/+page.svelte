<script>
  /* components */
  import EditProfile from "$lib/components/EditProfile.svelte";

  export let data;
  let user = data?.profile;
</script>

<EditProfile {user} />

<style lang="scss">
</style>

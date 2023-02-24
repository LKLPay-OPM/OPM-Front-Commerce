<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { redirectUrgentDispersions } from '$lib/stores';


  onMount(()=>{
    $redirectUrgentDispersions = true;
    goto('/dispersions')
  })
</script>


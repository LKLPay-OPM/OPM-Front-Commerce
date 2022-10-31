<script>
    import { isLoggedIn } from '$lib/stores';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    onMount(() => {
        //console.log($page)
    });
</script>
{#if $isLoggedIn === true}
<div class="">
    <div>
        <h1 class="text-8xl">Home</h1>
        <!-- {JSON.stringify($page.data)} -->
    </div>
</div>
{/if}
<script>
	import { isLoggedIn } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'

	onMount(() => {
			//console.log($page)
	});
</script>
{#if $isLoggedIn === true}
<div class="content">
	<div class="title">
		<h1 class="text-8xl">Home</h1>
		<!-- {JSON.stringify($page.data)} -->
	</div>
</div>
{/if}

<style>
	.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.title{
  display: flex;
  justify-content: center;
}
</style>
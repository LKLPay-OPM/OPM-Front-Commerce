<script>
	import { isLoggedIn, loggedInUser } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'
	import Onboarding from '$lib/components/Onboarding.svelte';
	import Select from '$lib/components/Select.svelte';
	import Input from '$lib/components/Input.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import noUser from '$lib/assets/no_user.png';
	import Logo from '$lib/assets/Logo.png';

	let modalOnboarding;
	let selected;

  $: {
    // console.log(selected)
  }
	
	onMount(() => {
		//console.log($page)
	});
</script>



{#if $isLoggedIn === true}
	{#if $loggedInUser.firstTimeUser == true}
		<Onboarding/>
		{:else}
		<div class="content">
			<div class="title">
				<h1 class="text-8xl">Home</h1>
				<!-- {JSON.stringify($page.data)} -->
			</div>
		</div>
	{/if}
{/if}

<style>
	.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.modal-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.modal-header p {
	font-weight: 700;
	font-size: 1rem;
	line-height: 1.25rem;
	/* display: flex; */
	/* align-items: center; */
	/* text-align: center; */
	color: #8B9EB0;
}

.title{
  display: flex;
  justify-content: center;
}
</style>
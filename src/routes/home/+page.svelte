<script>
	import { isLoggedIn, loggedInUser, onboardingSuccess } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'
	import Onboarding from '$lib/components/Onboarding.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
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
	{#if 
		$loggedInUser.firstTimeUser == true || $onboardingSuccess == true
	}
		<Onboarding/>
		{:else}
		<Dashboard/>
	{/if}
{/if}

<style>
</style>
<script>
    import { linkSelected } from '$lib/stores.js'
    import { onMount } from 'svelte';
    import {goto} from '$app/navigation';

    async function redirectHome() {
        goto('/home');
        //alert("No tienes los permisos necesarios para visitar esta sección")
    }

    onMount(async () => {
			$linkSelected = "Inicio"
        redirectHome();
	});
</script>
<div class="container">
	<section>
		<span class="loader"></span>
	</section>
<!-- <div class="flex flex-col justify-center items-center"> -->
    <!-- <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle 
            class="opacity-25" 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            stroke-width="4"
        ></circle>
        <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg> -->
    <!-- <span class="">Redirigiendo...</span> -->
</div>

<style>
:root {
	--white: #fff;
	--light: #E4E9F7;
	--brand: #11101d;
	--brand-light: #1d1b31; 
}

.container {
	background: var(--light);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

.loader {
	width: 48px;
	height: 48px;
	border: 5px solid var(--white);
	border-bottom-color: var(--brand-light);
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	animation: loader 1s linear infinite;
	}
	@keyframes loader {
	0% {
			transform: rotate(0deg);
	}
	100% {
			transform: rotate(360deg);
	}
} 
</style>
<script>
	import { isLoggedIn, loggedInUser } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'
	import Slider from '$lib/components/Slider.svelte';
	import Select from '$lib/components/Select.svelte';
	import Input from '$lib/components/Input.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import noUser from '$lib/assets/no_user.png';
	import Logo from '$lib/assets/Logo.png';

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }

	let monthlyAverage = 0;
  let sliderValue = 0;
  let total = 0;
  let installmentsTotal = 0;
  let installmentsPreference = "";

  let creditExtraFees = [
    {
      value: "weekly",
      name: "Semanal"
    },
    {
      value: "daily",
      name: "Diario"
    }
  ]

  $: {
    let percentage = 0;
    if(installmentsPreference === "weekly"){
      percentage = 0.03
    }else{
      percentage = 0.025
    }
    installmentsTotal = Math.round(((sliderValue+(sliderValue*percentage))/installments(installmentsPreference)) * 100) / 100
    total = sliderValue+(sliderValue*percentage)
  }

  const monthlyAveragePercentage = (qty) => {
    return qty * .30;
  }

  const installments = (preference) => {
    const day = new Date().getDate();
    const date = new Date()
    const date_1 = new Date();
    const date_2 = new Date(date.setMonth(date.getMonth() + 1, day));
    const difference = date_2.getTime() - date_1.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));

    const option = {
      "daily": {
        value: totalDays,
      },
      "weekly": {
        value: 4,
      },
    }
    if(preference){
      return option[preference].value;
    }
  }

	onMount(() => {
		//console.log($page)
	});
</script>

{#if $isLoggedIn === true}
<div class="title">
  <h1 class="">Créditos</h1>
</div>
<div class="content">
  <div class="simulator-container">
    <div class="credit-simulator">
      <div class="title">
        <h1 class="">Simulador de Créditos</h1>
      </div>
      <div>
        <p>
          <b>Recuerda</b> que sólo puedes solicitar como máximo el <b>30%</b> de tu promedio de ventas mensual y se te cargará un porcentaje de comisión extra
          dependiendo de la periodicidad de tus pagos
        </p>
      </div>
      <div>
        <Input label="Promedio de Ventas ($)" id="monthlyAverageInput" bind:value={monthlyAverage} className="txt-field normal" type="number"/>
        <Slider bind:value={sliderValue} label={monthlyAveragePercentage(monthlyAverage).toLocaleString(localeParam.language, localeParam.currency)} min=0 max={monthlyAveragePercentage(monthlyAverage)} step=1/>
      </div>
      <div>
        <p>
          <span>{sliderValue.toLocaleString(localeParam.language, localeParam.currency)}</span>
        </p>
      </div>
      <div>
        <Select bind:value={installmentsPreference} label="Periodicidad de los pagos" defaultText={"Elige una opción"} bind:optionsList={creditExtraFees}/>
        <br>
        <p>
          Realizarías {installments(installmentsPreference)}
          {installmentsPreference === "weekly" ? "Pagos Semanales" : "Pagos Diarios"} de {installmentsTotal.toLocaleString(localeParam.language, localeParam.currency)}
          para un total de {total.toLocaleString(localeParam.language, localeParam.currency)} con la comisión extra del {installmentsPreference === "weekly" ? "3%" : "2.5%"}
        </p>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
	.content {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .simulator-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .credit-simulator {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 0.625rem;
    width: 30rem;
    height: 40rem;
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }
</style>
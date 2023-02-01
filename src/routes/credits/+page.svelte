<script>
	import { isLoggedIn, loggedInUser } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'
	import Slider from '$lib/components/Slider.svelte';
	import Select from '$lib/components/Select.svelte';
	import Input from '$lib/components/Input.svelte';
	import IconInput from '$lib/components/IconInput.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
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
  let installmentsPreference = 0;
  let installments = 0;
  let radioValue = "1";
  let percentage = .015;

  let radioOptions = [
    {
      label: "Diarios",
      value: "1",
    },
    {
      label: "Semanales",
      value: "2",
    }
  ]

  let creditExtraFees = [
    {
      value: 30,
      name: "1 Mes"
    },
    {
      value: 90,
      name: "3 Meses"
    },
    {
      value: 180,
      name: "6 Meses"
    },
    {
      value: 270,
      name: "9 Meses"
    },
  ]

  $: {
    if(radioValue === "1"){
      installments = installmentsPreference
      installmentsTotal = Math.round(((sliderValue+(sliderValue*(percentage/100)))/installments) * 100) / 100
      total = sliderValue+(sliderValue*percentage)
    }else if(radioValue === "2"){
      installments = installmentsPreference/7.5
      installmentsTotal = Math.round(((sliderValue+(sliderValue*(percentage/100)))/installments) * 100) / 100
      total = sliderValue+(sliderValue*percentage)
    }
  }

  const monthlyAveragePercentage = (qty) => {
    return qty * .50;
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
      <div class="header">
        <p class="title">Simulador de Créditos</p>
      </div>
      <div class="input">
        <div class="element">
          <IconInput icon="dollar" label="Promedio de Ventas Mensuales" id="monthlyAverageInput" bind:value={monthlyAverage} className="txt-field normal" type="number"/>
        </div>
      </div>
      <div>
        <Slider bind:value={sliderValue} label={monthlyAveragePercentage(monthlyAverage).toLocaleString(localeParam.language, localeParam.currency)} min=0 max={monthlyAveragePercentage(monthlyAverage)} step=1/>
      </div>
      <div class="total">
        <p>
          <span>{sliderValue.toLocaleString(localeParam.language, localeParam.currency)}</span>
        </p>
      </div>
      <div class="payments-months">
        <div class="element">
          <p>Pagos</p>
          <Radio bind:options={radioOptions} fontSize={16} legend='' bind:userSelected={radioValue}/>
        </div>
        <div class="vertical-divider"></div>
        <div class="element">
          <p>Meses</p>
          <Select bind:value={installmentsPreference} label="" defaultText={"Elige una opción"} bind:optionsList={creditExtraFees}/>
        </div>
      </div>
      <div class="installments">
        <div class="element">
          <span>Cantidad de Pagos</span>
          <p>{installments}</p>
        </div>
        <div class="element">
          <span>Tasa</span>
          <p>{percentage}%</p>
        </div>
        <div class="element">
          <span>Monto Por Pago</span>
          <p>{installmentsTotal.toLocaleString(localeParam.language, localeParam.currency)}</p>
        </div>
        <!-- <p>
          Realizarías {installments(installmentsPreference)}
          {installmentsPreference === "weekly" ? "Pagos Semanales" : "Pagos Diarios"} de {installmentsTotal.toLocaleString(localeParam.language, localeParam.currency)}
          para un total de {total.toLocaleString(localeParam.language, localeParam.currency)} con la comisión extra del {installmentsPreference === "weekly" ? "3%" : "2.5%"}
        </p> -->
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
    max-width: 30rem;
    /* height: 40rem; */
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  /* .credit-simulator .header {
    
  } */
  .credit-simulator .header .title{
    font-weight: 700;
    font-size: 24px;
    line-height: 20px;
    /* identical to box height, or 83% */
    display: flex;
    align-items: center;
    /* Text */
    color: #113A62;
  }
  .credit-simulator .input {
    /* max-width: 15rem; */
    display: flex;
    justify-content: center;
  }
  .credit-simulator .input .element {
    max-width: 15rem;
  }

  .credit-simulator .total {
    display: flex;
    justify-content: center;
  }
  .credit-simulator .total p {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    /* Text */
    color: #113A62;
  }
  .credit-simulator .payments-months {
    display: flex;
    justify-content: space-between;
    height: 100px;
  }
  .credit-simulator .payments-months .element{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    min-width: 10rem;
  }
  .credit-simulator .payments-months .element p{
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #113A62;
    text-align: center;
  }
  .credit-simulator .payments-months .vertical-divider{
    display: flex;
    justify-content: center;
    width: 10px;
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #EAECF0;
    background-blend-mode: soft-light, normal;
    /* n-stroke */
    
    border: 1px solid rgba(255, 255, 255, 0.4);
    /* n-icon-1-1-2-in */
    
    box-shadow: inset -1px -1px 2px #FAFBFF, inset 1px 1px 2px #A6ABBD;
    border-radius: 5px;
  }
  
  .credit-simulator .installments {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .credit-simulator .installments .element{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .credit-simulator .installments span{
    margin-bottom: 1rem;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #8C9FB1;
  }
  .credit-simulator .installments p{
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;
    color: #113A62;
  }
</style>
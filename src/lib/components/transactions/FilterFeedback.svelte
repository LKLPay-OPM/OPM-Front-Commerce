<script>
  /* component variables */
  export let filters;
  export let branches;
  export let terminals;
  export let indexSelect;
  let options = [
    {name: "SUCURSALES", value: filters.branch},
    {name: "MARCA DE TARJETA", value: filters.brand},
    {name: "TERMINAL", value: filters.terminal},
    {name: "TIPO DE TRANSACCIÓN", value: filters.type},
    {name: "ESTATUS DE TRANSACCIÓN", value: filters.status},
  ]

  // $: console.log(filters)

  /* functions */
  const filtersValidation = (value) => {
    if(value == "" || value == "all") return false;
    else return true;
  }

</script>


<div class="feedback-filters__container">
  <div class="feedback-filters__content">
    <p class="feedback-filters__title">Sucursal: {branches[indexSelect.branch].name}</p>
    <p class="feedback-filters__title">Terminal: {terminals[indexSelect.terminal].name}</p>
  </div>
  <div class="feedback-filters__content">
    <p class="feedback-filters__title">Filtros:</p>
    {#each options as option, i}
      {#if filtersValidation(option.value)}
        <label class="feedback-filters__option" for={`option-${i}`}>{option.name}</label>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .feedback-filters__container {
    display: flex;
    flex-direction: column;
    padding: .5rem 4rem;
    .feedback-filters__content {
      display: flex;
      // grid-auto-flow: column;
      gap: 1rem;
      & > .feedback-filters__title {
        color: $font-light-primary;
        font-size: .8rem;
        font-weight: 500;
      }
      & > .feedback-filters__option {
        color: $font-light-primary;
        font-size: .8rem;
        font-weight: 500;
      }
    }
  }
</style>
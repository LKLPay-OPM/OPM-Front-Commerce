<script>
  export let label = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let index = 0;
  export let classList = "";
  export let selectedItem = "";

  export let defaultText = "";
  export let optionsList = [];

  $: {
    // console.log(optionsList)
    // console.log(value)
    if (optionsList[index].value) {
      value = optionsList[index].value;
      // console.log(value)
    }
  }

  const onChange = (e) => (value = e.target.value);
</script>

<div class="box">
  <label class="label" for={id}>
    <span class="label-text">{label}</span>
  </label>
  <select
    class={index >= 0 ? "option" : "default"}
    {placeholder}
    bind:value={index}
    {id}
  >
    <!-- <option class="default" value={0} selected disabled>{label}</option> -->
    {#each optionsList as item, i}
      <option selected={item.name === selectedItem} class="option" value={i}
        >{item.name}</option
      >
    {/each}
  </select>
</div>

<style lang="scss">
  .box {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .label {
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    display: flex;
    justify-content: left;
    color: #6f7e8c;
  }

  .box select.default {
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1.125rem;
    color: $grey;
    height: 3rem;
    width: 100%;
    padding-left: 1.25rem;
    border: none;
    outline: none;
    /* background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #E6E8EF 100%);
		box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0; */
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    box-shadow: -5px -5px 8px #f2f4f8, 5px 5px 7px rgba(174, 174, 192, 0.5);
    border-radius: 4px;
  }

  /*  */
  .box select.option {
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1.125rem;
    color: $primary-dark;
    height: 3rem;
    width: 100%;
    padding-left: 1.25rem;
    border: none;
    outline: none;
    /* background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #E6E8EF 100%);
		box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0; */
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    box-shadow: -5px -5px 8px #f2f4f8, 5px 5px 7px rgba(174, 174, 192, 0.5);
    border-radius: 4px;
  }

  /* .box::before {
  content: "\f13a";
  font-family: FontAwesome;
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  text-align: center;
  font-size: 28px;
  line-height: 45px;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
} */
  .box select option.default {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #6f7e8c;
    padding: 2rem;
    margin: 2rem;
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
  }
  .box select option.option {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    color: $primary-dark;
    padding: 2rem;
    margin: 2rem;
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
  }
</style>

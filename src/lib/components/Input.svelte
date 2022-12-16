<script>
	import Icons from '$lib/components/Icons.svelte';
    export let label = "";
    export let type = "";
    export let id = "";
    export let placeholder = "";
    export let value = "";
    export let accept = "";
    export let className = "";
		export let icon = "";
    export let title = "";
    export let max = 0;
    export let min = 0;
    const onInput = e => {
      if(isNaN(e.target.value)){
        value = e.target.value
      }else {
        // value = parseFloat(e.target.value).round(2)
        value = Math.round((e.target.value) * 100) / 100
      }
    };
</script>

<div class={`${className}`}>
    <label title={title} class="label" for={id}>
        <span class="label-text">
          {label}
          {#if icon != ""}
            <Icons name={icon} width="24" height="24"/>
          {/if}
        </span>
    </label>
    <input on:click {type} {placeholder} {id} {value} on:input={onInput} {max} {min} {accept}>
</div>

<style>

  .txt-field label {
    margin-top: 1rem;
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8B9EB0;
  }
  .txt-field input {
    width: 100%;
    height: 3.125rem;
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0;
    /* border: none; */
    border-radius: 4px;
    padding-left: 1.25rem;
    /* TEXT */
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113A62;
  }

  .txt-field input::placeholder{
    color: #D9D9D9;
  }

  /* .txtField input:focus {
    outline: none;
  } */

  .normal input {
    outline: none;
    background: 
      linear-gradient(#EFEEF5, #E6E8EF) padding-box,
      linear-gradient(187deg, #FFFFFF, #D6E3F3) border-box;
    border-radius: 4px;
    border: 2px solid transparent;
  }
  .valid input {
    outline-color: #00C48C;
    border-color: #00C48C;
  }

  .invalid input {
    outline-color: #FF0000;
    border-color: #FF0000;
  }

  div.btn {
    width: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(270deg, #0478FF 0%, #50CAFF 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .btn label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #FFFFFF;
  }

  .btn input {
    display: none;
  }
  div.btn-success {
    width: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(270deg, #00C48C 0%, #50FFD5 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .btn-success label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #FFFFFF;
  }

  .btn-success input {
    display: none;
  }
  div.btn-error {
    width: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(270deg, #FD5353 0%, #FFA450 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .btn-error label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #FFFFFF;
  }

  .btn-error input {
    display: none;
  }

  div.btn-disabled {
    width: 100%;
    align-content: center;
    justify-content: center;
    cursor: not-allowed;
    pointer-events: none;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(91.36deg, #E6E8EF 0%, #EFEEF5 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .btn-disabled label {
    width: 100%;
    cursor: not-allowed;
    pointer-events: none;
    /* TEXT */
    font-weight: 700;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #A6B4C8;
  }

  .btn-disabled input {
    display: none;
  }
  .form-control {
    display: flex;
    flex-direction: column
  }

  .label {
    display: flex;
    -webkit-user-select: none;
            user-select: none;
    align-items: center;
    justify-content: space-between
  }

.label-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: row;
}

.input {
  flex-shrink: 1;
  height: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;
}

.button{
 margin: 10px;
}
 
.button label {
	background-color: darkslateblue;
	display: flex;
  -webkit-user-select: none;
          user-select: none;
  align-items: center;
  justify-content: space-between;
	cursor: pointer;
  border: none;
  padding: .5rem 1.5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1px;
  cursor: pointer;
  max-width: fit-content;
  transition: all 0.5s ease;
}

.button input {
	display: none;
}

.button label .label-text {
	color: darkgray;
	font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-button label {
  /* background-color: darkslateblue; */
	display: flex;
  -webkit-user-select: none;
          user-select: none;
  align-items: center;
  justify-content: space-between;
	cursor: pointer;
  border: none;
  /* padding: .5rem 1.5rem; */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1px;
  /* cursor: pointer; */
  width: fit-content;
  /* max-width: fit-content; */
  transition: all 0.5s ease;
}

.text-button input {
	display: none;
}

.text-button label .label-text {
	color: darkslateblue;
	font-size: 1.25rem;
  line-height: 1.25rem;
  cursor: pointer;
}

.modal-toggle {
  display: none;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.profile-pic-upload {
  display: none;
}
</style>
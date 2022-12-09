<script>
	export let label = "";
	export let id = "";
	export let placeholder = "";
	export let value = "";
	export let index = 0;
	export let classList = "";

	export let defaultText = "";
	export let optionsList = [];

	$: {
			value = optionsList[index]
			// console.log(value)
	}

	const onChange = e => (value = e.target.value);
</script>

<div class="box">
	<label class="label" for={id}>
		<span class="label-text">{label}</span>
	</label>
	<select {placeholder} bind:value={index} {id}>
		{#each optionsList as item, i}
				<option value={i}>{item.name}</option>
		{/each}
	</select>
</div>


<style>

	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.label {
		font-weight: 700;
		font-size: .8125rem;
		line-height: 1.25rem;
		display: flex;
		justify-content: left;
		color: #6F7E8C;
	}

	.box select {
		font-weight: 500;
		font-size: .8125rem;
		line-height: 1.125rem;
		color: #8B9EB0;
		height: 3rem;
		width: 10.5rem;
		padding-left: 1.25rem;
		border: none;
		outline: none;
		background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
		box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0;
		border-radius: 4px;
	}

	.box::before {
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
}
	.box select option {
		font-weight: 700;
		font-size: 1rem;
		line-height: 1.25rem;
		color: #6F7E8C;
		padding: 2rem;
		margin: 2rem;
		background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
	}
</style>
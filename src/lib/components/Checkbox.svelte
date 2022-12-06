<script>
	export let checked;
</script>

<label class="container">
  <input type="checkbox" bind:checked={checked}>
  <span class="checkmark"></span>
</label>

<style>
  .container {
    display: block;
    position: relative;
    padding-left: 2.1875rem;
    margin-bottom: .75rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

/* Create a custom checkbox */
  .container span {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.5rem;
    width: 1.5rem;
    background: #E3EDF7;
    box-shadow: inset -4px -4px 9px rgba(255, 255, 255, 0.6), inset 4px 4px 14px #C5D7EE;
    border-radius: 6px;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background: linear-gradient(270deg, #50CAFF 0%, #0478FF 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 6px;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
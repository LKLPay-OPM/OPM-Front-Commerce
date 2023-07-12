<script>
  export let checked;
</script>

<label class="chk-container">
  <input type="checkbox" bind:checked />
  <span class="checkmark" />
</label>

<style lang="scss">
  .chk-container {
    display: block;
    position: relative;
    padding-left: 2.1875rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .chk-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .chk-container span {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.5rem;
    width: 1.5rem;
    background: #e3edf7;
    box-shadow: inset -4px -4px 9px rgba(255, 255, 255, 0.6), inset 4px 4px 14px #c5d7ee;
    border-radius: 6px;
  }

  /* On mouse-over, add a grey background color */
  .chk-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .chk-container input:checked ~ .checkmark {
    background: linear-gradient(270deg, #50caff 0%, #0478ff 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 6px;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .chk-container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .chk-container .checkmark:after {
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

  /* Dark Mode */
  :global(body.dark-mode) {
    .chk-container {
      span {
        background: $background-dark;
        box-shadow: inset -4px -4px 9px #202020;
      }
    }

    .chk-container:hover input ~ .checkmark {
      background-color: #404040;
    }

    .chk-container input:checked ~ .checkmark {
      box-shadow: 5px 5px 8px #202020, -5px -5px 6px #303030;
    }

  }
</style>

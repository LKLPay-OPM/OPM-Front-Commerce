<script>
  export let text = "";
</script>

<div class="container">
  <div class="loader-container">
    <span class="loader" />
    <span class="text">{text}</span>
  </div>
</div>

<style lang="scss">
  :root {
    --white: #fff;
    --light: #e4e9f7;
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

    .loader-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      .text {
        font-weight: 600;
        font-size: 1.125rem;
        color: $primary-dark;
        text-align: center;
      }
    }
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

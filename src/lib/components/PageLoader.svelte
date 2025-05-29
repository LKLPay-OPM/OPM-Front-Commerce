<script>
</script>

<div class="container">
  <section>
    <span class="loader" />
    <!-- <span class="">Redirigiendo...</span> -->
  </section>
</div>

<style>
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

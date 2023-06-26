<script>
  import Logo from "$lib/assets/Logo.png";
  import Circulo from "$lib/assets/Circulo.png";
  export let text = "";
</script>

<div class="container">
  <div class="loader-container">
    <div class="loader">
      <img class="logo" src={Logo} alt="Logo" />
      <img class="circle" src={Circulo} alt="Círculo" />
    </div>
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
        z-index: 100;
      }
    }
  }

  .loader {
    position: relative;
    height: 200px;
    width: 200px;
    .logo {
      top: 50%;
      left: 50%;
      // transform: translate(-50%, -50%);
      position: absolute;
      width: 48px;
      height: 48px;
      animation: logo 2s linear infinite;
    }
    .circle {
      top: 50%;
      left: 50%;
      // transform: translate(-50%, -50%);
      position: absolute;
      width: 200px;
      height: 200px;
      filter: invert(20%);
      animation: circle 10s linear infinite;
    }
  }
  @keyframes logo {
    0% {
      scale: 1.1;
      rotate: 0deg;
      translate: -50% -50%;
      // transform: scale(1.1) rotate(0deg);
    }
    50% {
      scale: 0.8;
      rotate: 180deg;
      translate: -50% -50%;
      // transform: scale(0.8) rotate(180deg);
    }
    100% {
      scale: 1;
      rotate: 360deg;
      translate: -50% -50%;
      // transform: scale(1) rotate(360deg);
    }
  }

  @keyframes circle {
    0% {
      // scale: 1.1;
      rotate: 0deg;
      translate: -50% -50%;
      // transform: scale(1.1) rotate(0deg);
    }
    50% {
      // scale: 0.8;
      rotate: -180deg;
      translate: -50% -50%;
      // transform: scale(0.8) rotate(180deg);
    }
    100% {
      // scale: 1;
      rotate: -360deg;
      translate: -50% -50%;
      // transform: scale(1) rotate(360deg);
    }
  }
</style>

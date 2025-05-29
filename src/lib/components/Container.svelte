<script></script>

<main class="container">
  <slot />
</main>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2rem 2rem; /* 32px 32px */
    @media (max-width: 425px) {
      margin: 0 0 2rem 0;
    }

    @media (max-width: 540px) {
      margin: 0 0 2rem 0;
    }
  }
</style>

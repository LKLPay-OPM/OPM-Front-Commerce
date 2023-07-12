<script>
  /* FAQs */
  import { firstSteps, transactions, support } from "$lib/mock/faqs.js";
</script>

<section class="faq container" aria-label="Preguntas Frecuentes">
  <header class="faq__header">
    <h2 class="faq__header-title">Preguntas Frecuentes</h2>
  </header>
  <div class="faq__body">
    <details id="firstSteps">
      <summary class="faq__label-title">Primeros Pasos</summary>
      {#each firstSteps as faq}
        <details class="faq__panel card-primary">
          <summary class="faq__label">{faq.question}</summary>
          <div class="faq__panel-body">
            <p class="faq__panel-answer">{faq.answer}</p>
          </div>
        </details>
      {/each}
    </details>
    <details id="support">
      <summary class="faq__label-title">Soporte</summary>
      {#each support as faq}
        <details class="faq__panel card-primary">
          <summary class="faq__label">{faq.question}</summary>
          <div class="faq__panel-body">
            <p class="faq__panel-answer">{faq.answer}</p>
          </div>
        </details>
      {/each}
    </details>
    <details id="transactions">
      <summary class="faq__label-title">Transacciones</summary>
      {#each transactions as faq}
        <details class="faq__panel card-primary">
          <summary class="faq__label">{faq.question}</summary>
          <div class="faq__panel-body">
            <p class="faq__panel-answer">{faq.answer}</p>
          </div>
        </details>
      {/each}
    </details>
  </div>
</section>

<style lang="scss">
  .container {
    width: min(60%, 40rem);
    margin-inline: auto;
  }

  .faq__header {
    display: flex;
    justify-content: center;
  }

  .faq__header-title {
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.25rem;
    color: $primary-dark;
    margin: 2rem 0;
  }

  .faq__panel {
    padding: 0.5rem 1.5rem;
    margin: 0 0 1.5rem 0;
  }

  .faq__label {
    padding-block: 0.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: $primary-light;
    cursor: pointer;
  }

  .faq__label:is(:hover) {
    font-weight: 800;
    // color: $primary-dark;
  }
  .faq__label-title {
    padding-block: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: $primary-dark;
    cursor: pointer;
  }

  .faq__label-title:is(:hover) {
    font-weight: 800;
    // color: $primary-dark;
  }
  .faq__panel-answer {
    font-size: 1rem;
    font-weight: 500;
    color: $primary-dark;
    padding: 0.5rem 0;
    white-space: pre-line;
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .faq__header-title,
    .faq__label-title,
    .faq__panel-answer {
      color: $font-dark-primary;
    }
    .faq__label {
      color: $grey;
    }
  }

  @media (max-width: 425px) {
  }
  @media (min-width: 426px) and (max-width: 540px) {
  }

  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>

<script>
  /* FAQs */
  import { faqs } from "$lib/mock/faqs.js";
</script>

<section class="faq container" aria-label="Preguntas Frecuentes">
  <header class="faq__header">
    <h2 class="faq__header-title">Preguntas Frecuentes</h2>
  </header>
  <div class="faq__body">
    {#each faqs as faq}
      <details class="faq__panel card-container">
        <summary class="faq__label">{faq.question}</summary>
        <div class="faq__panel-body">
          <p class="faq__panel-answer">{faq.answer}</p>
        </div>
      </details>
    {/each}
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
  .faq__panel-answer {
    font-size: 1rem;
    font-weight: 500;
    color: $primary-dark;
    padding: 0.5rem 0;
  }

  @media (max-width: 425px) {
  }
  @media (min-width: 426px) and (max-width: 540px) {
  }

  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>

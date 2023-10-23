<script>
  /* svelte */
  import { onMount } from "svelte";
  /* components */
  import DateTitle from "$lib/components/DateTitle.svelte";
  /* navigation */
  import { goto } from "$app/navigation";

  export let data;

  let terminal = data?.terminal;
  $: goto(`${terminal.id}/day`);
  /* onMount(() => {
    goto(`${terminal.id}/day`);
  }); */
</script>

<style lang="scss">
  /* ========================================== */

  .card {
    min-width: 100%;
  }
  .trigger {
    label {
      cursor: pointer;
    }
    input {
      display: none;
    }
  }

  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .element {
    &.rates {
      display: grid;
      gap: 1rem;
    }
  }

  .date {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
  }
  .padding-1 {
    padding: 1rem;
  }

  .padding-2 {
    padding: 2rem;
  }
  .content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: -webkit-fill-available;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }

  .left {
    // min-width: 17.5rem; /* 280px */
    min-width: fit-content;
  }

  .right {
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .avatar-container {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .avatar {
    position: relative;
    width: 130px;
    height: 130px;
    border-radius: 25px;
    overflow: hidden;
    background-color: $primary-dark;
  }
  .avatar img {
    height: 100%;
    width: 100%;
    border-radius: 25px;
    object-fit: cover;
    justify-content: center;
    cursor: pointer;
  }

  .title-blue {
    font-weight: 700;
    font-size: 20px;
    line-height: 16px;
    text-align: left;
    color: $primary-dark;
    margin: 0rem 0rem 0.5rem 0rem;
  }
  .description {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    color: $primary-dark;
    display: flex;
    align-items: center;
  }

  .title {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    color: #fd9053;
    margin: 0rem 0rem 0.5rem 0rem;
  }

  .text-center {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .text-left {
    display: flex;
    justify-content: left;
    text-align: left;
  }

  .arrow-blue {
    color: $primary-light;
    cursor: pointer;
  }

  .modal-buttons {
    width: 70%;
    height: 2.5rem; /* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .avatar {
      background-color: $dark;
    }
    .title-blue,
    .description {
      color: $font-dark-primary;
    }
  }

  @media (max-width: 425px) {
    .content {
      flex-direction: column;
    }
  }

  @media (max-width: 540px) {
    .content {
      flex-direction: column;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .content {
      flex-direction: column;
    }
  }
</style>

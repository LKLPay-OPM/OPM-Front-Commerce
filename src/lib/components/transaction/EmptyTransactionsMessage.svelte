<script>
  /* svelte */
  import { goto } from "$app/navigation";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
</script>

<div class="msg__container card-primary">
  <div class="message">
    <div class="msg">
      <p>No hay ventas realizadas el día de hoy</p>
    </div>
    <div class="description">
      <p>Aquí podrás ver el resumen de las últimas ventas realizadas</p>
    </div>
  </div>
</div>

<style lang="scss">
  .msg__container {
    min-height: 25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0rem;
    gap: 16px;
    margin: 0rem 4rem 2rem 4rem;
    border-radius: 10px;
    flex: none;
    flex-grow: 0;
    > .message {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: inherit;
      gap: 0.5rem;
      > .msg {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.25rem;
        text-align: center;
        color: #001650;
      }
      > .description {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25rem;
        text-align: center;
        color: #8c9fb1;
      }
    }
  }
  .element {
    margin: 0 auto 0 auto;
  }

  .icon-container {
    width: 22px;
    height: 22px;
    /* base-gray */
    background: #e6e9ef;
    /* base-gray */
    border: 1px solid #e6e9ef;
    /* n-5-5-10-out */
    box-shadow: -5px -5px 8px #f2f4f8, 5px 5px 7px rgba(174, 174, 192, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-container {
    width: 100%;
  }

  .button-container {
    button {
      width: 100%;
      padding: 16px;
      border-width: 0;
      background: #e9edf0;
      /* inner-flat */
      box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
      border-radius: 10px;
      text-align: left;
      display: flex;
      justify-content: start;
      align-items: center;
      cursor: pointer;
      p {
        margin-left: 16px;
      }
    }
  }
</style>

<script>
  /* components */
  import Input from "$lib/components/Input.svelte";
  /* axios */
  import { axiosDevicesClient } from "$lib/repos/axios";
  /* variables */
  export let dateStart;
  export let dateEnd;
  export let selectedTerminal;

  const exportDataToExcel = async () => {
    try {
      const excel = axiosDevicesClient
        .get(`/transaction/report/transactionsReport?startDate=${dateStart}&endDate=${dateEnd}${selectedTerminal ? `&serialNumber=${selectedTerminal}` : ''}`, {
          responseType: "blob",
        })
        .then((response) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(response.data);

          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `ventas_${dateStart}-${dateEnd}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    } catch (e) {
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };
</script>

<div class="export-buttons">
  <Input
    id="export-xlsx"
    className="btn-plain green btn-square"
    type="button"
    icon="xls-fill"
    on:click={exportDataToExcel}
  />
</div>

<style lang="scss">
  .export-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin: 0;
  }
</style>

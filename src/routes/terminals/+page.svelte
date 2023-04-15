<script>
  let terminals = [
    {
      name: "Matriz 1",
      serial: "F20-003925",
      branch: "Matriz",
      type: "Master",
      transactions: "000000200000",
    },
    {
      name: "Matriz 2",
      serial: "i9100-012680",
      branch: "Matriz",
      type: "Master",
      transactions: "000000100000",
    },
    {
      name: "Sucursal 1",
      serial: "i2000-019007",
      branch: "Sucursal",
      type: "Master",
      transactions: "000000265880",
    },
  ];

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  let date = new Date();

  const getMonth = (month) => {
    const monthsArray = {
      0: { value: "Enero" },
      1: { value: "Febrero" },
      2: { value: "Marzo" },
      3: { value: "Abril" },
      4: { value: "Mayo" },
      5: { value: "Junio" },
      6: { value: "Julio" },
      7: { value: "Agosto" },
      8: { value: "Septiembre" },
      9: { value: "Octubre" },
      10: { value: "Noviembre" },
      11: { value: "Diciembre" },
    };
    return monthsArray[month].value;
  };
</script>

<div class="container">
  <div class="date">
    {date.getDate()} de {getMonth(date.getMonth())} del {date.getFullYear()}
  </div>
  <div class="content">
    <div class="terminal-tables">
      <div class="table-container">
        <div class="card-container">
          <table class="table-content">
            <thead>
              <tr>
                <th>Terminal</th>
                <th class="r425 r540">Serie</th>
                <th>Sucursal</th>
                <th class="r425 r540">Tipo</th>
                <th>Ventas</th>
              </tr>
            </thead>
            <tbody>
              {#each terminals as terminal}
                <tr class="">
                  <td>{terminal.name}</td>
                  <td class="r425 r540">{terminal.serial}</td>
                  <td>{terminal.branch}</td>
                  <td class="r425 r540">{terminal.type}</td>
                  <td
                    >{parseFloat(terminal.transactions / 100).toLocaleString(
                      localeParam.language,
                      localeParam.currency
                    )}</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
  /* .padding-1 {
    padding: 1rem;
  }

  .padding-2 {
    padding: 2rem;
  } */

  .terminal-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .table-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .table-content {
    border-collapse: collapse;
    margin: 2rem;
    border-spacing: 1rem;
    min-width: 40rem;
  }

  .table-content thead {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    color: $primary-dark;
    height: 2.375rem;
  }

  .table-content td {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8c9fb1;
    padding: 0.625rem 0rem 0.625rem 0rem;
    min-width: 7rem;
  }

  th:first-child {
    text-align: left;
  }
  td:first-child {
    text-align: left;
  }

  @media (max-width: 425px) {
    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
    }
    .r425 {
      display: none;
    }
  }

  @media (max-width: 540px) {
    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
    }
    .r540 {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>

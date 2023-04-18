<script>
  import { loggedInUser } from "$lib/stores";
  import Layout from "$lib/components/requests/Layout.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import EditProfile from "$lib/components/EditProfile.svelte";
  import Terminals from '$lib/components/requests/Terminals.svelte';
  import Support from '$lib/components/requests/Support.svelte';
  import { terminate } from "firebase/firestore";
  let date = new Date();
  let optionSelected = 0;
  let submenu = 0;
  let rollsQty = 0;
  let modalSupport;
  let detailTicketView = false;
  let selectedTicket = {};
  let terminals = {
    pocket: 0,
    smart: 0,
    master: 0,
  };
  let supportDetails = {
    user: $loggedInUser.uid,
    description: "",
  };

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;
  const getMonthName = (month) => {
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
      "01": { value: "Enero" },
      "02": { value: "Febrero" },
      "03": { value: "Marzo" },
      "04": { value: "Abril" },
      "05": { value: "Mayo" },
      "06": { value: "Junio" },
      "07": { value: "Julio" },
      "08": { value: "Agosto" },
      "09": { value: "Septiembre" },
      "10": { value: "Octubre" },
      "11": { value: "Noviembre" },
      "12": { value: "Diciembre" },
    };
    return monthsArray[month].value;
  };

  let tickets = [
    {
      id: 1,
      type: "Asistencia y Soporte",
      description:
        "Problema con terminal Problema con terminal en la sucursal Matriz, se traba al abrir la aplicación",
      status: "Pendiente",
    },
    {
      id: 2,
      type: "Asistencia y Soporte",
      description: "Revisión de terminal en sucursal Vallarta",
      status: "Pendiente",
    },
  ];

  const requestRolls = () => {
    (optionSelected = 0), (submenu = 0), (rollsQty = 0);
  };
  const requestTerminals = () => {
    (optionSelected = 0), (submenu = 0);
    terminals = { pocket: 0, smart: 0, master: 0 };
  };
  const requestSupport = () => {
    console.log("Soporte");
  };
  const requestProfileUpdate = () => {
    console.log("Perfil");
  };

  const handleSupportRequest = () => {};

  $: {
    // console.log($loggedInUser.state)
  }
</script>

<Layout/>

<style lang="scss">
  // @import 'src/lib/styles/requests.scss';
</style>

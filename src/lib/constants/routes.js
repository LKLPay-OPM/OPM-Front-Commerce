export const routes = (route) => {
  const routeName = {
    "": "Inicio",
    transactions: "Mis Ventas",
    dispersions: "Depósitos",
    requests: "Solicitudes",
    "payment-link": "Link de Pago",
    help: "Ayuda",
    profile: "Perfil",
  };
  return routeName[route];
};

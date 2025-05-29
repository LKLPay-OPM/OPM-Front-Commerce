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

export const allroutes = {
  "/": true,
  "/login": true,
  "/profile": true,
  "/transactions": true,
  "/requests": true,
  "/dispersions": true,
  "/branch-office": false,
  "/terminals": false,
}
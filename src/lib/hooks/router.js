const userRoutes = (role, route) => {
  /// ROUTE PERMISSION PER ROLE
  const routesByRole = {
    0: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/requests": true,
      "/dispersions": true,
      "/branch-office": false,
      "/terminals": false,
    },
    1: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/transactions/(filter)/day": true,
      "/transactions/(filter)/week": true,
      "/transactions/(filter)/week/[date]": true,
      "/transactions/(filter)/month": true,
      "/transactions/(filter)/month/[date]": true,
      "/transactions/(filter)/range": true,
      "/transactions/(filter)/id": true,
      "/transactions/detail": true,
      "/transactions": true,
      "/requests/(type)/tickets": true,
      "/requests/(type)/tickets/[id]": true,
      "/requests/(type)/rolls/[id]": true,
      "/requests/(type)/terminals/[id]": true,
      "/requests/(type)/rolls": true,
      "/requests/(type)/update-profile": true,
      "/requests/(type)/terminals": true,
      "/requests": true,
      "/dispersions": true,
      "/dispersions/detail": true,
      // TODO: Sprint 2 Sucursales
      "/branch-office": false,
      // TODO: Sprint 2 Terminales
      "/terminals": false,
      "/terminals/[id]": false,
      "/terminals/[id]/(filter)/day": false,
      "/terminals/[id]/(filter)/week": false,
      "/terminals/[id]/(filter)/week/[date]": false,
      "/terminals/[id]/(filter)/month": false,
      "/terminals/[id]/(filter)/month/[date]": false,
      "/urgent": false,
      "/credits": false,
      "/payment-link": true,
      "/help": true,
    },
    2: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/transactions/(filter)/day": true,
      "/transactions/(filter)/week": true,
      "/transactions/(filter)/week/[date]": true,
      "/transactions/(filter)/month": true,
      "/transactions/(filter)/month/[date]": true,
      "/transactions/(filter)/range": true,
      "/transactions/(filter)/id": true,
      "/transactions/detail": true,
      "/transactions": true,
      "/requests/(type)/tickets": true,
      "/requests/(type)/tickets/[id]": true,
      "/requests/(type)/rolls/[id]": true,
      "/requests/(type)/terminals/[id]": true,
      "/requests/(type)/rolls": true,
      "/requests/(type)/update-profile": true,
      "/requests/(type)/terminals": true,
      "/requests": true,
      "/dispersions": true,
      "/dispersions/detail": true,
      // TODO: Sprint 2 Sucursales
      "/branch-office": false,
      // TODO: Sprint 2 Terminales
      "/terminals": false,
      "/terminals/[id]": false,
      "/terminals/[id]/(filter)/day": false,
      "/terminals/[id]/(filter)/week": false,
      "/terminals/[id]/(filter)/week/[date]": false,
      "/terminals/[id]/(filter)/month": false,
      "/terminals/[id]/(filter)/month/[date]": false,
      "/urgent": false,
      "/credits": false,
      "/payment-link": true,
      "/help": true,
    },
    3: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/transactions/(filter)/day": true,
      "/transactions/(filter)/week": true,
      "/transactions/(filter)/week/[date]": true,
      "/transactions/(filter)/month": true,
      "/transactions/(filter)/month/[date]": true,
      "/transactions/(filter)/range": true,
      "/transactions/(filter)/id": true,
      "/transactions/detail": true,
      "/transactions": true,
      "/requests/(type)/tickets": true,
      "/requests/(type)/tickets/[id]": true,
      "/requests/(type)/rolls/[id]": true,
      "/requests/(type)/terminals/[id]": true,
      "/requests/(type)/rolls": true,
      "/requests/(type)/update-profile": true,
      "/requests/(type)/terminals": true,
      "/requests": true,
      "/dispersions": true,
      "/dispersions/detail": true,
      // TODO: Sprint 2 Sucursales
      "/branch-office": false,
      // TODO: Sprint 2 Terminales
      "/terminals": false,
      "/terminals/[id]": false,
      "/terminals/[id]/(filter)/day": false,
      "/terminals/[id]/(filter)/week": false,
      "/terminals/[id]/(filter)/week/[date]": false,
      "/terminals/[id]/(filter)/month": false,
      "/terminals/[id]/(filter)/month/[date]": false,
      "/urgent": false,
      "/credits": false,
      "/payment-link": true,
      "/help": true,
    },
  };
  return routesByRole[role][route];
};

const sidebarOptions = (accountType) => {
  if (accountType !== "3") {
    accountType = "";
  }
  const optionsList = {
    "": [
      /// ACCOUNT TYPE BASIC, PRO, E-COMMERCE
      { name: "Inicio", path: "/", icon: "home" },
      { name: "Mis Ventas", path: "/transactions", icon: "terminal" },
      { name: "Depósitos", path: "/dispersions", icon: "deposits" },
      { name: "Solicitudes", path: "/requests", icon: "adviser" },
      // { name: "Sucursales", path: "/branch-office", icon: "franchise" }, // TODO: Sprint 2 Sucursales
      // { name: "Terminales", path: "/terminals", icon: "terminal" }, // TODO: Sprint 2 Terminales
      { name: "Link de Pago", path: "/payment-link", icon: "qr-code" },
    ],
    3: [
      /// ACCOUNT TYPE BUSINESS
      { name: "Inicio", path: "/", icon: "home" },
      { name: "Mis Ventas", path: "/transactions", icon: "transactions" },
      { name: "Depósitos", path: "/dispersions", icon: "deposits" },
      { name: "Solicitudes", path: "/requests", icon: "adviser" },
      // { name: "Sucursales", path: "/branch-office", icon: "franchise" }, // TODO: Sprint 2 Sucursales
      // { name: "Terminales", path: "/terminals", icon: "terminal" }, // TODO: Sprint 2 Terminales
      { name: "Link de Pago", path: "/payment-link", icon: "qr-code" },
    ],
  };
  return optionsList[accountType];
};

export const router = async (role, route) => {
  const res = await userRoutes(role, route);
  return res;
};

export const optionsSidebar = async (account) => {
  const res = sidebarOptions(account);
  return res;
};

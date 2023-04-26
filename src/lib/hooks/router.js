const userRoutes = (role, route) => {
  /// ROUTE PERMISSION PER ROLE
  // console.log(role+" "+route)
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
      "/transactions/detail": true,
      "/requests": true,
      "/dispersions": true,
      "/branch-office": false,
      "/terminals": false,
      "/urgent": false,
      "/credits": false,
      "/payment-link": true,
    },
    2: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/requests": true,
      "/dispersions": true,
      "/branch-office": false,
      "/terminals": false,
      "/urgent": true,
      "/payment-link": true,
    },
    3: {
      "/login": true,
      "/": true,
      "/profile": true,
      "/transactions": true,
      "/requests": true,
      "/dispersions": true,
      "/branch-office": true,
      "/terminals": true,
      "/urgent": true,
      "/requests": true,
      "/help": true,
      "/payment-link": true,
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
      { name: "Link de Pago", path: "/payment-link", icon: "qr-code" },
      // {name: 'Depósito Urgente', path: '/urgent-dispersion', icon: 'terminal'},
      // {name: 'Cuenta Bancaria', path: '/bank-account', icon: 'bank-line'},
      // {name: 'Créditos', path: '/credits', icon: 'bank-line'},
      // {name: 'Nueva Venta', path: '/new-sale', icon: 'bank-card-line'},
    ],
    3: [
      /// ACCOUNT TYPE BUSINESS
      { name: "Inicio", path: "/", icon: "home" },
      { name: "Mis Ventas", path: "/transactions", icon: "transactions" },
      { name: "Depósitos", path: "/dispersions", icon: "deposits" },
      { name: "Sucursales", path: "/branch-office", icon: "franchise" },
      { name: "Terminales", path: "/terminals", icon: "terminal" },
      { name: "Depósito Urgente", path: "/urgent", icon: "deposits" },
      { name: "Link de Pago", path: "/payment-link", icon: "qr-code" },
      // {name: 'Depósito Urgente', path: '/urgent-dispersion', icon: 'terminal'},
      // {name: 'Cuenta Bancaria', path: '/bank-account', icon: 'bank-line'},
      // {name: 'Créditos', path: '/credits', icon: 'bank-line'},
      // {name: 'Nueva Venta', path: '/new-sale', icon: 'bank-card-line'},
    ],
  };
  // console.log(optionsList[accountType])
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

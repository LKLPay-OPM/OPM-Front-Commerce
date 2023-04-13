/* sveltekit */
import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const appwriteUser = writable(
  browser && (JSON.parse(localStorage.getItem("appwriteUser")) || {})
);
appwriteUser.subscribe(
  (val) => browser && (localStorage.appwriteUser = JSON.stringify(val))
);

export const loggedInUser = writable(
  browser && (JSON.parse(localStorage.getItem("userData")) || {})
);
loggedInUser.subscribe(
  (val) => browser && (localStorage.userData = JSON.stringify(val))
);

export const bankAccountData = writable(
  browser && (JSON.parse(localStorage.getItem("bankAccountData")) || {})
);
bankAccountData.subscribe(
  (val) => browser && (localStorage.bankAccountData = JSON.stringify(val))
);

export const isLoggedIn = writable(
  browser && (JSON.parse(localStorage.getItem("isLoggedIn")) || false)
);
isLoggedIn.subscribe((val) => browser && (localStorage.isLoggedIn = val));

export const bankDataDelivered = writable(
  browser && (JSON.parse(localStorage.getItem("bankDataDelivered")) || false)
);
bankDataDelivered.subscribe(
  (val) => browser && (localStorage.bankDataDelivered = val)
);

export const userId = "";

export function booleanStore(initial) {
  const isOpen = writable(initial);
  const { set, update } = isOpen;
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle: () => update((n) => !n),
  };
}
export const linkSelected = writable(
  (browser && localStorage.getItem("selectedTab")) || "Inicio"
);
linkSelected.subscribe((val) => browser && (localStorage.selectedTab = val));

export const sidebar = writable(
  browser && (JSON.parse(localStorage.getItem("sidebarState")) || true)
);
sidebar.subscribe((val) => browser && (localStorage.sidebarState = val));

export const onboardingSuccess = writable(false);
export const redirectBankProfile = writable(false);
export const redirectUrgentDispersions = writable(false);
export const previousPage = writable("");
/* type NavigationState = "loading" | "loaded" | null;

export default writable<NavigationState>(null); */

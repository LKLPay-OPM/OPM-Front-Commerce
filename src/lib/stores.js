/* sveltekit */
import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const sessionUser = browser ? writable(JSON.parse(localStorage.getItem("sessionUser")) || {}) : writable({});
export const loggedInUser = browser ? writable(JSON.parse(localStorage.getItem("userData")) || {}) : writable({});
export const isLoggedIn = browser ? writable(JSON.parse(localStorage.getItem("isLoggedIn")) || false) : writable(false);
export const bankAccountData = browser
  ? writable(JSON.parse(localStorage.getItem("bankAccountData")) || {})
  : writable({});
export const bankDataDelivered = browser
  ? writable(JSON.parse(localStorage.getItem("bankDataDelivered")) || false)
  : writable(false);
export const linkSelected = browser ? writable(localStorage.getItem("selectedTab") || "Inicio") : writable("Inicio");
export const sidebar = browser ? writable(JSON.parse(localStorage.getItem("sidebarState")) || true) : writable(true);

export const userId = "";
export const onboardingSuccess = writable(false);
export const redirectBankProfile = writable(false);
export const redirectUrgentDispersions = writable(false);
export const previousPage = writable("");

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

if (browser) {
  sessionUser.subscribe((val) => localStorage.setItem("sessionUser", JSON.stringify(val)));
  loggedInUser.subscribe((val) => localStorage.setItem("userData", JSON.stringify(val)));
  isLoggedIn.subscribe((val) => localStorage.setItem("isLoggedIn", val));
  bankAccountData.subscribe((val) => localStorage.setItem("bankAccountData", JSON.stringify(val)));
  bankDataDelivered.subscribe((val) => localStorage.setItem("bankDataDelivered", val));
  linkSelected.subscribe((val) => localStorage.setItem("selectedTab", val));
  sidebar.subscribe((val) => localStorage.setItem("sidebarState", val));
}

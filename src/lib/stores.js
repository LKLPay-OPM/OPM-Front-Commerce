import { writable } from 'svelte/store';
/// SvelteKit
import { browser } from '$app/environment';
export const loggedInUser = writable(browser && (JSON.parse(sessionStorage.getItem("userData")) || {}));
loggedInUser.subscribe(
	(val) => browser && (sessionStorage.userData = JSON.stringify(val))
)
export const bankAccountData = writable(browser && (JSON.parse(sessionStorage.getItem("bankAccountData")) || {}));
bankAccountData.subscribe(
	(val) => browser && (sessionStorage.bankAccountData = JSON.stringify(val))
)
export const isLoggedIn = writable(browser && (JSON.parse(sessionStorage.getItem("isLoggedIn")) || false));
isLoggedIn.subscribe(
	(val) => browser && (sessionStorage.isLoggedIn = val)
)
export const bankDataDelivered = writable(browser && (JSON.parse(sessionStorage.getItem("bankDataDelivered")) || false));
bankDataDelivered.subscribe(
	(val) => browser && (sessionStorage.bankDataDelivered = val)
)
export const userId = ("");

export function booleanStore(initial) {
	const isOpen = writable(initial)
	const { set, update } = isOpen
	return {
		isOpen,
		open: () => set(true),
		close: () => set(false),
		toggle: () => update((n) => !n),
	}
}
export const linkSelected = writable(browser && sessionStorage.getItem("selectedTab") || "Inicio");
linkSelected.subscribe(
	(val) => browser && (sessionStorage.selectedTab = val)
)
export const sidebar = writable(browser && (JSON.parse(sessionStorage.getItem("sidebarState")) || true));
sidebar.subscribe(
	(val) => browser && (sessionStorage.sidebarState = val)
)
export const onboardingSuccess = writable(false);
export const redirectBankProfile = writable(false);
export const redirectUrgentDispersions = writable(false);
/* type NavigationState = "loading" | "loaded" | null;

export default writable<NavigationState>(null); */
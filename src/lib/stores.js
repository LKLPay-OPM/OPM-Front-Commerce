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
/// Svelte
/* export const loggedInUser = writable(JSON.parse(sessionStorage.getItem("userData")) || {});
loggedInUser.subscribe((val) => sessionStorage.setItem("userData", val))
export const isLoggedIn = writable<boolean>(sessionStorage.getItem("isLoggedIn") || false);
isLoggedIn.subscribe((val) => sessionStorage.setItem("isLoggedIn", val))
export const userId = (""); */
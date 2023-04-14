<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  //import * as firebase from 'firebase/firestore';
  import {
    collection,
    Timestamp,
    query,
    orderBy,
    limit,
    getDocs,
    startAt,
    endAt,
  } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Dispersions from "$lib/components/Dispersions.svelte";
  import { onMount } from "svelte";

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let dispersions = [];
  let selectedDispersion = {};
  let dispersionDetailView = false;
  let notFound = false;
  let loading = false;
  let active = "day";

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  onMount(async () => {
    // await fetchByDayButton()
    dispersions = [...$loggedInUser.dispersions];
  });

  const dispersionFound = () => {
    if (dispersions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  const fetchByDayButton = async () => {
    active = "day";
    dispersionDetailView = false;
    selectedDispersion = {};
    loading = true;
    //transactions = [];
    const curr = new Date();
    const today = new Date(curr.setDate(curr.getDate())).setHours(0, 0, 0, 0); // Sets Date to today day at 00:00
    const tomorrow = new Date(curr.setDate(curr.getDate() + 1)).setHours(
      0,
      0,
      0,
      0
    ); // Sets Date to tomorrow at 00:00

    /* console.log(new Date(today))
    console.log(new Date(tomorrow)) */
    const q = query(
      collection(db, dbCollection, uid, "transactions"),
      //where('uid', '==', uid),
      orderBy("date", "desc"),
      startAt(Timestamp.fromDate(new Date(tomorrow))),
      endAt(Timestamp.fromDate(new Date(today))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return { ...doc.data() };
    });
    dispersionFound();
    //console.log(transactions)
  };
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader />
  {:else}
    <Dispersions bind:user={$loggedInUser} />
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
</style>

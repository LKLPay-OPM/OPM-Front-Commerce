<script>
  export let name;
  export let width = "";
  export let height = "";
  //export let color = "";

  let icons = [
    {
      box: 24,
      name: "arrow-up-s-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/>
      `
    },
    {
      box: 24,
      name: "arrow-down-s-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"/>
      `
    },
    {
      box: 24,
      name: "user-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"/>
      `
    },
    {
      box: 24,
      name: "user-outline",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
      `
    },
    {
      box: 24,
      name: "home-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M20 20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9z"/>
      `
    },
    {
      box: 24,
      name: "home-outline",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z"/>
      `
    },
    {
      box: 24,
      name: "bank-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M2 20h20v2H2v-2zm2-8h2v7H4v-7zm5 0h2v7H9v-7zm4 0h2v7h-2v-7zm5 0h2v7h-2v-7zM2 7l10-5 10 5v4H2V7zm2 1.236V9h16v-.764l-8-4-8 4zM12 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      `
    },
    {
      box: 24,
      name: "bank-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M2 20h20v2H2v-2zm2-8h2v7H4v-7zm5 0h2v7H9v-7zm4 0h2v7h-2v-7zm5 0h2v7h-2v-7zM2 7l10-5 10 5v4H2V7zm10 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      `
    },
    {
      box: 24,
      name: "bank-card-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-6 6h4v2h-4v-2z"/>
      `
    },
    {
      box: 24,
      name: "bank-card-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M22 10v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10h20zm0-2H2V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v4zm-7 8v2h4v-2h-4z"/>
      `
    },
    {
      box: 24,
      name: "logout-box-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"/>
      `
    },
    {
      box: 24,
      name: "logout-box-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm4 9V8l-5 4 5 4v-3h6v-2H9z"/>
      `
    },
    {
      box: 24,
      name: "menu-lines",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
      `
    },
    {
      box: 24,
      name: "search",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/>
      `
    },
    {
      box: 24,
      name: "camera-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path fill="currentColor" d="M9 3h6l2 2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4l2-2zm3 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
      `
    },
  ]
  let displayIcon = icons.find((e) => e.name === name);
</script>

<svg
  class={$$props.class}
  {width}
  {height}
  viewBox="0 0 {displayIcon.box} {displayIcon.box}">{@html displayIcon.svg}
</svg>
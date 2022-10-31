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
      <path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/>
      `
    },
    {
      box: 24,
      name: "arrow-down-s-line",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"/>
      `
    },
    {
      box: 24,
      name: "user-fill",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"/>
      `
    },
    {
      box: 24,
      name: "user-outline",
      svg: `
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
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
import { sveltekit } from "@sveltejs/kit/vite";

const config = {
  plugins: [sveltekit()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *; @use "src/animations.scss" as *;',
      },
    },
  },
};

export default config;

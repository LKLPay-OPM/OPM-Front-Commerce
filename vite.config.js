import { sveltekit } from "@sveltejs/kit/vite";
import fs from "fs";

const config = {
  plugins: [sveltekit()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *; @use "src/animations.scss" as *;',
      },
    },
  },
  server: {
    https: {
      key: fs.readFileSync(`${__dirname}/ssl/key.pem`),
      cert: fs.readFileSync(`${__dirname}/ssl/cert.pem`),
    },
    proxy: {},
  },
};

export default config;

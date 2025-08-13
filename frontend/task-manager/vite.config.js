import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // theme: {
  //   extend:{
  //     // color used in the project 
  //     colors:{
  //       primary: "#2B85FF",
  //       secondary: "#EF863E",
  //     },
  //   },
  // },
 
  plugins: [
    react(), 
    tailwindcss()
  ],
});

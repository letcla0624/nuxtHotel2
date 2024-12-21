import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

declare module "#app" {
  interface NuxtApp {
    $bootstrap: typeof bootstrap;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("bootstrap", bootstrap);
});

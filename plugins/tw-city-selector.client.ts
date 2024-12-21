import TwCitySelector from "tw-city-selector";

declare module "#app" {
  interface NuxtApp {
    $twCitySelector: typeof TwCitySelector;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("twCitySelector", TwCitySelector);
});

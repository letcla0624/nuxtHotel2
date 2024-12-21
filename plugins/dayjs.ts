import dayjs from "dayjs";
import "dayjs/locale/zh-tw";

declare module "#app" {
  interface NuxtApp {
    $dayjs: typeof dayjs;
  }
}

dayjs.locale("zh-tw");
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("dayjs", dayjs);
});

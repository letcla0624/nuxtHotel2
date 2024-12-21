// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    // 全域的 meta 內容
    head: {
      title: "享樂酒店｜Enjoyment Luxury Hotel",
      meta: [
        {
          name: "description",
          content:
            "高雄豪華住宿之選，我們致力於為您提供無與倫比的奢華體驗與優質服務。",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: "享樂酒店｜Enjoyment Luxury Hotel" },
        {
          property: "og:description",
          content:
            "高雄豪華住宿之選，我們致力於為您提供無與倫比的奢華體驗與優質服務。",
        },
        {
          property: "og:site_name",
          content: "享樂酒店｜Enjoyment Luxury Hotel",
        },
        { property: "og:type", content: "website" },
      ],
    },
  },
  // 全域套用的 scss 樣式
  css: ["@/assets/styles/all.scss"],
  vite: {
    define: {
      "process.env": process.env,
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 自定義的 scss 變數樣式，修改 Bootstrap 預設樣式
          additionalData: `@import "@/assets/styles/_variables.scss";`,
        },
      },
    },
  },
  router: {
    options: {
      // 讓 NuxtLink 可以套用 .active 的樣式
      linkActiveClass: "active",
      linkExactActiveClass: "active",
    },
  },
  imports: {
    dirs: ["stores"],
  },
  modules: [
    "nuxt-swiper",
    "@nuxtjs/google-fonts",
    "@samk-dev/nuxt-vcalendar",
    "@pinia/nuxt",
    [
      "@vee-validate/nuxt",
      {
        autoImports: true,
        componentNames: {
          Form: "VeeForm",
          Field: "VeeField",
          FieldArray: "VeeFieldArray",
          ErrorMessage: "VeeErrorMessage",
        },
      },
    ],
  ],
  googleFonts: {
    families: {
      "Noto+Serif+TC": {
        wght: "200..900",
      },
    },
  },
});

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getRooms } from "~/api/rooms";
import { heroList } from "~/data/heroList";

const modules = ref([Autoplay, Navigation, Pagination]);
const roomSwiper = ref<any | null>(null);

// 取得房型
const { data: roomsList } = await useAsyncData("rooms", () => getRooms());

// seo
const requestURL = useRequestURL();
const title = useMetaTitle("客房旅宿");
useSeoMeta({
  title,
  description: "各種房型，任您挑選。",
  ogTitle: title,
  ogDescription: "各種房型，任您挑選。",
  ogSiteName: title,
  ogType: "website",
  ogUrl: requestURL.href,
});
</script>

<template>
  <main>
    <section class="hero position-relative">
      <ClientOnly>
        <swiper
          ref="roomSwiper"
          :modules="modules"
          :slides-per-view="1"
          :pagination="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
          }"
        >
          <swiper-slide v-for="(hero, idx) in heroList" :key="idx">
            <picture>
              <source :srcset="hero.imageBig" media="(min-width:576px)" />
              <img class="hero-img" :src="hero.imageSmall" alt="hero banner" />
            </picture>
          </swiper-slide>
        </swiper>
      </ClientOnly>

      <div
        class="hero-wrapper d-flex flex-column justify-content-center align-items-center flex-md-row gap-10 gap-md-20 w-100 position-absolute z-2"
      >
        <div
          class="d-flex flex-column align-items-center text-center d-md-block text-md-start"
        >
          <div class="mt-10 mb-5 mt-md-0 mb-md-10 text-primary-100 fw-bold">
            <h2 class="fw-semibold">享樂酒店</h2>
            <h5 class="fs-7 fs-md-5 fw-semibold">Enjoyment Luxury Hotel</h5>
          </div>
          <div class="deco-line" />
        </div>
        <h1 class="mb-0 text-neutral-0 fw-bold">客房旅宿</h1>
      </div>
    </section>

    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container mb-md-12">
        <h4 class="mb-2 mb-md-4 fs-8 fs-md-6 fw-bold text-neutral-80">
          房型選擇
        </h4>
        <h2 class="mb-10 mb-md-20 fs-1 fw-bold text-primary-100">
          各種房型，任您挑選
        </h2>
        <ul class="d-flex flex-column gap-6 gap-md-12 list-unstyled">
          <li
            v-for="room in roomsList"
            :key="room._id"
            class="card flex-lg-row border-0 rounded-3xl overflow-hidden"
          >
            <div class="row">
              <div class="col-12 col-lg-7">
                <ClientOnly>
                  <swiper
                    ref="roomSwiper"
                    :modules="modules"
                    :slides-per-view="1"
                    :navigation="true"
                    :pagination="{
                      clickable: true,
                    }"
                    :autoplay="{
                      delay: 2500,
                      disableOnInteraction: false,
                    }"
                  >
                    <swiper-slide
                      v-for="(img, index) in room.imageUrlList"
                      :key="index"
                    >
                      <picture>
                        <source :srcset="img" media="(min-width: 768px)" />
                        <img
                          class="w-100 object-fit-cover"
                          :src="img"
                          loading="lazy"
                          :alt="room.name"
                        />
                      </picture>
                    </swiper-slide>
                  </swiper>
                </ClientOnly>
              </div>
              <div class="col-12 col-lg-5">
                <div class="card-body pe-md-10 py-md-10">
                  <h3 class="card-title fs-2 fw-bold text-neutral-100">
                    {{ room.name }}
                  </h3>
                  <p
                    class="card-text mb-6 mb-md-10 fs-8 fs-md-7 fw-medium text-neutral-80"
                  >
                    {{ room.description }}
                  </p>
                  <ul class="d-flex gap-4 mb-6 mb-md-10 list-unstyled">
                    <li
                      class="card-info px-4 py-5 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ room.areaInfo }} 坪
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ room.bedInfo }} 張大床
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ room.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                  <div class="deco-line w-100 mb-6 mb-md-10" />
                  <div
                    class="d-flex justify-content-between align-items-center fs-7 fs-md-5 text-primary-100"
                  >
                    <p class="mb-0 fw-bold">
                      NT$ {{ useThousands(room.price) }}
                    </p>
                    <NuxtLink
                      :to="`/rooms/${room._id}`"
                      class="icon-link icon-link-hover text-primary-100"
                    >
                      <Icon class="bi fs-5" icon="mdi:arrow-right" />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";
@import "@/assets/styles/swiper";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.hero img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(40%);
}

.hero-wrapper {
  inset: 0;
}

.deco-line {
  width: 33vw;
  height: 2px;
  background-image: linear-gradient(to right, #be9c7c, #ffffff);
}

.hero .deco-line {
  @include media-breakpoint-down(md) {
    width: 2px;
    height: 83px;
    z-index: 1;
    background-image: linear-gradient(to bottom, #be9c7c, #fff);
    margin-bottom: 2.5rem;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.card-info {
  width: 97px;
  height: 97px;
}
</style>

<script setup lang="ts">
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getFoods } from "~/api/foods";
import { getNews } from "~/api/news";
import { getRooms } from "~/api/rooms";
import { heroList } from "~/data/heroList";
import { Icon } from "@iconify/vue";

const modules = ref([Autoplay, Navigation, Pagination]);
const roomSwiper = ref<any | null>(null);

const slidePrev = () => {
  if (roomSwiper.value?.$el.swiper) {
    roomSwiper.value.$el.swiper.slidePrev();
  } else {
    console.error("Swiper 還沒有實例");
  }
};

const slideNext = () => {
  if (roomSwiper.value?.$el.swiper) {
    roomSwiper.value.$el.swiper.slideNext();
  } else {
    console.error("Swiper 還沒有實例");
  }
};

// 取得最新消息
const { data: newsList } = await useAsyncData("news", () => getNews());

// 取得房型
const { data: roomsList } = await useAsyncData("rooms", () => getRooms());
const room = roomsList.value![0];

// 取得最新消息
const { data: foodsList } = await useAsyncData("foods", () => getFoods());

// seo
const requestURL = useRequestURL();
useSeoMeta({
  ogUrl: requestURL.href,
  ogImage: `${requestURL.origin}${heroList[0].imageBig}`,
});
</script>

<template>
  <main class="overflow-hidden">
    <section class="hero position-relative">
      <ClientOnly>
        <swiper
          ref="roomSwiper"
          :modules="modules"
          :slides-per-view="1"
          :pagination="{
            clickable: true,
          }"
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
        class="hero-wrapper d-flex flex-column justify-content-center align-items-center flex-md-row justify-content-md-between gap-md-10 w-100 px-md-20 position-absolute z-2"
      >
        <div
          class="d-flex flex-column align-items-center text-center d-md-block text-md-start"
        >
          <div class="mt-10 mb-5 mt-md-0 mb-md-10 text-primary-100 fw-bold">
            <h2>享樂酒店</h2>
            <h5 class="mb-0 fs-7 fs-md-5">Enjoyment Luxury Hotel</h5>
          </div>
          <div class="deco-line" />
        </div>
        <div class="hero__intro position-relative">
          <div class="hero__intro-content">
            <h1 class="mb-6 text-white fw-bold text-nowrap">
              高雄<br />豪華住宿之選
            </h1>
            <p class="text-neutral-40 fw-semibold">
              我們致力於為您提供無與倫比的奢華體驗與優質服務
            </p>
            <NuxtLink
              to="/rooms"
              class="btn btn-neutral-0 d-flex justify-content-end align-items-center gap-3 w-100 text-end text-neutral-100 fs-5 fw-semibold border-0"
            >
              立即訂房
              <div class="cta-deco" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="news bg-primary-10 py-20 py-md-30">
      <div class="container position-relative">
        <div class="row">
          <div class="col-12 col-md-2">
            <div class="mb-10 mb-md-0">
              <h2 class="mb-6 mb-md-10 fs-1 fw-bold text-primary-100">
                最新<br />消息
              </h2>
              <div class="deco-line" />
            </div>
          </div>
          <div class="col-12 col-md-10 d-flex flex-column gap-10">
            <div
              v-for="news in newsList"
              :key="news._id"
              class="card bg-transparent border-0"
            >
              <div
                class="d-flex flex-column flex-md-row align-items-center gap-6"
              >
                <picture>
                  <source :srcset="news.image" media="(min-width: 576px)" />
                  <img
                    :src="news.smallImage"
                    class="w-100 rounded-3"
                    :alt="news.title"
                  />
                </picture>
                <div class="card-body p-0">
                  <h3 class="card-title mb-2 mb-md-6 fw-bold">
                    {{ news.title }}
                  </h3>
                  <p class="card-text text-neutral-80 fs-8 fs-md-7 fw-medium">
                    {{ news.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about position-relative z-n1 bg-neutral-120 py-20 py-md-30">
      <div class="container p-0">
        <div
          class="about-content p-6 p-md-20 mt-10 ms-10 me-5 mt-md-20 mx-md-auto text-neutral-0"
        >
          <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
            <h2 class="text-nowrap mb-0 fs-1 fw-bold">關於<br />我們</h2>
            <div class="deco-line" />
          </div>
          <div class="d-flex flex-column gap-4 gap-md-10 fw-medium">
            <p class="mb-0 fs-8 fs-md-7">
              享樂酒店，位於美麗島高雄的心臟地帶，是這座城市的璀璨瑰寶與傲人地標。
              <br />
              我們的存在，不僅僅是為了提供奢華的住宿體驗，更是為了將高雄的美麗與活力，獻給每一位蒞臨的旅客。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              我們的酒店，擁有時尚典雅的裝潢，每一個細節都充滿著藝術與設計的精緻。
              <br />
              我們的員工，都以熱情的服務與專業的態度，讓每一位客人都能感受到賓至如歸的溫暖。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              在這裡，您可以遙望窗外，欣賞高雄的城市景色，感受這座城市的繁華與活力；您也可以舒適地坐在我們的餐廳，品嚐精緻的佳餚，體驗無與倫比的味覺盛宴。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              享樂酒店，不僅是您在高雄的住宿之選，更是您感受高雄魅力的最佳舞台。我們期待著您的蒞臨，讓我們共同編織一段難忘的高雄故事。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      class="room-intro position-relative px-3 py-20 px-md-0 py-md-30 bg-neutral-120"
    >
      <div
        class="d-flex flex-column flex-md-row justify-content-center align-items-center justify-content-md-start align-items-md-end gap-6 gap-md-20"
      >
        <ClientOnly>
          <swiper
            ref="roomSwiper"
            :modules="modules"
            :slides-per-view="1"
            :pagination="{
              clickable: true,
            }"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            :loop="true"
          >
            <swiper-slide v-for="(img, idx) in room.imageUrlList" :key="idx">
              <picture>
                <source :srcset="img" media="(min-width:576px)" />
                <img class="w-100" :src="img" :alt="room.name" />
              </picture>
            </swiper-slide>
          </swiper>
        </ClientOnly>

        <div class="room-intro-content text-neutral-0 flex-grow-1">
          <h2 class="mb-2 mb-md-4 fw-bold">{{ room.name }}</h2>
          <p class="mb-6 mb-md-10 fs-8 fs-md-7">
            {{ room.description }}
          </p>
          <div class="mb-6 mb-md-10 fs-3 fw-bold">
            NT$ {{ useThousands(room.price) }}
          </div>
          <NuxtLink
            to="/rooms"
            class="btn btn-neutral-0 d-flex justify-content-end align-items-center gap-3 w-100 p-5 p-md-10 mb-6 mb-md-10 text-end text-neutral-100 fs-7 fs-md-5 fw-bold border-0"
          >
            查看更多
            <div class="cta-deco" />
          </NuxtLink>
          <div class="d-flex justify-content-end">
            <button
              class="bg-transparent text-primary-100 icon-link icon-link-hover border-0"
              type="button"
              @click="slidePrev"
            >
              <Icon
                icon="mdi:arrow-left"
                class="bi m-4"
                style="
                  font-size: 1.5rem;
                  --bs-icon-link-transform: translateX(-0.25em);
                "
              />
            </button>
            <button
              class="bg-transparent text-primary-100 icon-link icon-link-hover border-0"
              type="button"
              @click="slideNext"
            >
              <Icon
                icon="mdi:arrow-right"
                class="bi m-4"
                style="font-size: 1.5rem"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="delicacy position-relative py-20 py-md-30 bg-primary-10">
      <div class="container">
        <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
          <h2 class="mb-0 fs-1 fw-bold text-primary-100">佳餚<br />美饌</h2>
          <div class="deco-line" />
        </div>
        <div class="row flex-nowrap overflow-x-auto">
          <div
            v-for="food in foodsList"
            :key="food._id"
            class="col-10 col-md-6 col-xl-4"
          >
            <div class="card position-relative border-0 rounded-3">
              <picture>
                <source :srcset="food.image" media="(min-width: 576px)" />
                <img
                  class="w-100 rounded-3"
                  :src="food.smallImage"
                  :alt="food.title"
                />
              </picture>
              <div
                class="card-body position-absolute bottom-0 p-4 p-md-6 rounded-bottom-3 text-neutral-0"
              >
                <div
                  class="d-flex justify-content-between align-items-center mb-4 mb-md-6"
                >
                  <h5 class="card-title mb-0 fw-bold">{{ food.title }}</h5>
                  <div
                    class="d-flex justify-content-between gap-4 text-neutral-40 fs-8 fs-md-7"
                  >
                    <span class="fw-bold">
                      {{ food.diningTime?.slice(0, 7) }}
                    </span>
                    <span class="fw-bold">
                      {{ food.diningTime?.slice(8) }}
                    </span>
                  </div>
                </div>
                <p class="card-text fs-8 fs-md-7">
                  {{ food.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="transportation bg-neutral-120">
      <div class="container pt-20 pb-10 pt-md-30 pb-md-20">
        <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
          <h2 class="mb-0 fs-1 fw-bold text-primary-100">交通<br />方式</h2>
          <div class="deco-line" />
        </div>
        <div class="row gap-6 gap-md-0">
          <div class="col-12 mb-md-10">
            <p class="text-neutral-40 fw-bold">台灣高雄市新興區六角路123號</p>
            <picture>
              <source
                srcset="/images/home-map.png"
                media="(min-width: 576px)"
              />
              <img
                class="w-100"
                src="/images/home-map-sm.png"
                alt="描述地圖中酒店所在的位置"
              />
            </picture>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon
              class="mb-2 mb-md-4 display-1 text-primary-100"
              icon="ic:baseline-directions-car"
            />
            <h5 class="fs-7 fs-md-5 fw-bold">自行開車</h5>
            <p class="mb-0 fs-8 fs-md-7">
              如果您選擇自行開車，可以透過國道一號下高雄交流道，往市區方向行駛，並依路標指示即可抵達「享樂酒店」。飯店內設有停車場，讓您停車方便。
            </p>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon
              class="mb-2 mb-md-4 display-1 text-primary-100"
              icon="ic:baseline-train"
            />
            <h5 class="fs-7 fs-md-5 fw-bold">高鐵/火車</h5>
            <p class="mb-0 fs-8 fs-md-7">
              如果您是搭乘高鐵或火車，可於左營站下車，外頭有計程車站，搭乘計程車約20分鐘即可抵達。或者您也可以轉乘捷運紅線至中央公園站下車，步行約10分鐘便可抵達。
            </p>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon
              class="mb-2 mb-md-4 display-1 text-primary-100"
              icon="mdi:car-side"
            />
            <h5 class="fs-7 fs-md-5 fw-bold">禮賓車服務</h5>
            <p class="mb-0 fs-8 fs-md-7">
              承億酒店提供禮賓專車接送服務，但因目的地遠近會有不同的收費，請撥打電話將由專人為您服務洽詢專線：(07)123-4567
            </p>
          </div>
        </div>
      </div>
      <picture>
        <source
          srcset="/images/deco-line-group-horizontal-full.svg"
          media="(min-width:576px)"
        />
        <img
          class="w-100"
          src="/images/deco-line-group-horizontal-sm.svg"
          alt="deco-line-group"
        />
      </picture>
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

section .btn {
  --primary: #bf9d7d;
  --neutral: #ffffff;
  height: clamp(4rem, 12vh, 7.25rem);
  padding: 5%;

  &:hover {
    box-shadow: inset 48vw 0 0 0 var(--primary);
    color: var(--neutral) !important;
    transition-duration: 0.25s;

    .cta-deco {
      background-color: var(--neutral) !important;
      width: 8vw;
    }
  }

  @include media-breakpoint-down(md) {
    height: 4rem;
  }
}

.cta-deco {
  width: 10vw;
  height: 1px;
  background-color: #000;
  transition: background-color 0.25s ease-in-out, width 0.25s ease-in-out;

  @include media-breakpoint-down(md) {
    width: 5rem;
  }
}

.hero img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(40%);
}

.hero-wrapper {
  inset: 0;
}

.hero__intro {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: clamp(291px, 48vw, 924px);
  max-height: min(62vh, 672px);
  padding: 5.5%;
  background-image: linear-gradient(to bottom, #ffffff00, #ffffff4d);
  border-width: 1px 1px 0px 0px;
  border-style: solid;
  border-color: #f5f7f9;
  border-radius: 80px;
  backdrop-filter: blur(6px);

  @include media-breakpoint-down(md) {
    transform: translateX(10%);
    height: 420px;
  }
}

.hero__intro-content {
  max-width: 39vw;
  transform: translateX(-18%);

  @include media-breakpoint-down(md) {
    max-width: none;
    transform: translateX(-11%);
  }
}

.hero__intro-content h1 {
  font-size: clamp(3rem, 5.2vw, 6.25rem);
}
.hero__intro-content p {
  font-size: clamp(1rem, 1.7vw, 2rem);
  margin-bottom: min(5vh, 3.75rem);
  white-space: nowrap;

  @include media-breakpoint-down(md) {
    white-space: normal;
  }
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

.news .deco-line {
  width: 140px;
}

.news picture {
  --parent-witdh: 1076;
  --width: 474;
  --percent-width: calc(var(--width) / var(--parent-witdh) * 100%);
  width: var(--percent-width);
  flex-shrink: 0;

  @include media-breakpoint-down(md) {
    width: 100%;
  }
}

.news .container::before {
  background-image: url("/images/deco-dot-group.svg");
  content: "";
  display: block;
  position: absolute;
  top: -20px;
  right: -120px;
  width: 200px;
  height: 200px;

  @include media-breakpoint-down(md) {
    background-image: url("/images/deco-dot-group-sm.svg");
    width: 100px;
    height: 100px;
    top: -40px;
    right: 24px;
  }
}

.news .container::after {
  background-image: url("/images/deco-dot-group.svg");
  content: "";
  display: block;
  position: absolute;
  bottom: -200px;
  left: -100px;
  width: 200px;
  height: 200px;

  @include media-breakpoint-down(md) {
    background-image: url("/images/deco-dot-group-sm.svg");
    width: 100px;
    height: 100px;
    bottom: -140px;
    left: 24px;
  }
}

.about {
  background-image: url("/images/home-about.png");
  height: 992px;
  background-position-y: 120px;
  background-repeat: no-repeat;

  @include media-breakpoint-down(md) {
    background-position-y: 80px;
    height: 794px;
  }
}

.about-content {
  max-width: 1044px;
  background-image: linear-gradient(
    180deg,
    rgba(20, 15, 10, 0.8) 0%,
    rgba(190, 156, 124, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  border-width: 0px 0px 1px 1px;
  border-style: solid;
  border-color: #ffffff;
  border-radius: 80px 80px 0px 80px;
  transform: translateX(7vw);

  @include media-breakpoint-down(md) {
    height: 594px;
    border-radius: 40px 40px 0px 40px;
    transform: none;
  }
}

.about-content .deco-line {
  width: 165px;
  background: #fff;

  @include media-breakpoint-down(md) {
    width: 161px;
  }
}

.room-intro::before {
  position: absolute;
  top: -24px;
  right: -80px;
  z-index: 2;
  content: "";
  width: 375px;
  height: 84px;
  background-image: url("/images/deco-line-group-horizontal-sm.svg");
  background-repeat: no-repeat;

  @include media-breakpoint-up(md) {
    background-image: url("/images/deco-line-group-horizontal.svg");
    width: 1060px;
    height: 187px;
    top: -50px;
    left: 430px;
    right: auto;
  }

  @include media-breakpoint-up(lg) {
    top: 0px;
    left: 430px;
  }

  @include media-breakpoint-up(xl) {
    top: 130px;
    left: 630px;
  }

  @include media-breakpoint-up(xxxl) {
    top: 180px;
    left: 860px;
  }
}

.room-intro::after {
  position: absolute;
  z-index: -1;
  bottom: 265px;
  right: 0;
  content: "";
  width: 375px;
  height: 132px;
  background-image: url("/images/deco-wave-bg-sm.svg");
  background-repeat: no-repeat;

  @include media-breakpoint-up(md) {
    background-image: url("/images/deco-wave-bg.svg");
    width: 1920px;
    height: 86%;
    bottom: 0;
    left: -280px;
    right: auto;
  }

  @include media-breakpoint-up(lg) {
    height: 80%;
  }

  @include media-breakpoint-up(xl) {
    height: 62.5%;
    left: -100px;
  }

  @include media-breakpoint-up(xxxl) {
    height: 677px;
    bottom: 0;
    left: 0;
  }
}

.room-intro .swiper {
  --origin-width: 900;
  --container-width: 1920;
  --percent-width: calc(var(--origin-width) / var(--container-width) * 100vw);
  max-width: var(--percent-width);
  margin: 0;

  @include media-breakpoint-down(md) {
    max-width: 100%;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    overflow: hidden;
  }
}

.room-intro-content {
  max-width: 628px;

  @include media-breakpoint-up(xxxl) {
    flex-grow: 1;
  }
}

.delicacy::before {
  @include media-breakpoint-up(lg) {
    position: absolute;
    top: -40px;
    right: 80px;
    content: "";
    width: 200px;
    height: 200px;
    background-image: url("/images/deco-dot-group.svg");
  }
}

.delicacy::after {
  @include media-breakpoint-up(xxxl) {
    position: absolute;
    top: 55px;
    left: 40px;
    content: "";
    width: 187px;
    height: 1068px;
    background-image: url("/images/deco-line-group-vertical.svg");
  }
}

.delicacy .deco-line {
  width: 200px;

  @include media-breakpoint-up(md) {
    width: 167px;
  }
}

.delicacy .card-body {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #140f0a 77.6%);
  backdrop-filter: blur(10px);
}

.transportation .deco-line {
  width: 161px;

  @include media-breakpoint-down(md) {
    width: 194px;
  }
}
</style>

<script setup lang="ts">
import { Pagination } from "swiper/modules";
import type { GetResult, Order } from "~/api/types";

definePageMeta({
  layout: "user-layout",
  middleware: ["auth"],
});

const modules = ref([Pagination]);

const baseURL = process.env.BASE_URL;
const token = useCookie("auth");
const { formatter } = useDayjs();

const allOrdersList = ref<Order[]>();
const recentlyOrdersList = ref<Order[]>();
const pastOrdersList = ref<Order[]>();

// 取得全部訂單
const getAllOrders = async () => {
  try {
    const res = await $fetch<GetResult<Order[]>>("/orders/", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: token.value || "",
      },
      onResponseError({ response }) {
        token.value = null;
        console.error(response._data.message);
      },
    });

    return res.result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 排序即將到來的訂單
const softRecentlyOrdersList = () =>
  allOrdersList
    .value!.filter(
      (item) => new Date(item.checkInDate) > new Date() && item.status !== -1
    )
    .sort(
      (a, b) =>
        Number(new Date(a.checkInDate)) - Number(new Date(b.checkInDate))
    );

onMounted(async () => {
  allOrdersList.value = [...(await getAllOrders())];

  if (allOrdersList.value?.length !== 0) {
    // 即將到來的訂單
    recentlyOrdersList.value = softRecentlyOrdersList();

    // 歷史訂單記錄
    pastOrdersList.value = allOrdersList
      .value!.filter(
        (item) => new Date(item.checkInDate) < new Date() && item.status !== -1
      )
      .sort(
        (a, b) =>
          Number(new Date(b.checkInDate)) - Number(new Date(a.checkInDate))
      );
  } else {
    recentlyOrdersList.value = [];
    pastOrdersList.value = [];
  }
});

// 刪除單筆訂單
const orderId = ref("");
const { sweetAlert } = useSweetAlert();
const setOrderId = (id: string) => {
  orderId.value = id;
};
const deleteOrder = async () => {
  try {
    await $fetch(`/orders/${orderId.value}`, {
      method: "DELETE",
      baseURL,
      headers: {
        Authorization: token.value || "",
      },
      onResponseError({ response }) {
        const { message } = response._data;
        console.error("Error:", message);
      },
    });

    sweetAlert("success", "取消成功！");

    // 重新取得全部訂單
    const updatedOrders = await getAllOrders();
    allOrdersList.value = [...updatedOrders];
    // 重新排序即將到來的訂單
    recentlyOrdersList.value = softRecentlyOrdersList();
  } catch (error) {
    console.error(error);
    sweetAlert("error", "取消失敗！");
  }
};

// seo
const requestURL = useRequestURL();
const title = useMetaTitle("我的訂單");
useSeoMeta({
  title,
  description: "顯示即將到來的行程和歷史訂單。",
  ogTitle: title,
  ogDescription: "顯示即將到來的行程和歷史訂單。",
  ogSiteName: title,
  ogType: "website",
  ogUrl: requestURL.href,
});
</script>

<template>
  <div>
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-7">
        <ClientOnly>
          <h1 v-if="recentlyOrdersList?.length === 0" class="text-white fs-3">
            目前沒有即將到來的行程...
          </h1>
          <swiper
            v-else
            ref="roomSwiper"
            :modules="modules"
            :slides-per-view="1"
            :pagination="{
              clickable: true,
            }"
          >
            <swiper-slide
              v-for="recentlyOrder in recentlyOrdersList"
              :key="recentlyOrder._id"
            >
              <div
                class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 pb-10 p-md-10 bg-neutral-0"
                style="max-width: 730px"
              >
                <div>
                  <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
                    預訂參考編號： {{ recentlyOrder?._id }}
                  </p>
                  <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    即將來的行程
                  </h2>
                </div>

                <img
                  class="img-fluid rounded-3"
                  :src="recentlyOrder?.roomId?.imageUrl"
                  alt="room-a"
                />

                <section class="d-flex flex-column gap-6">
                  <h3
                    class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
                  >
                    <p class="mb-0">
                      {{ recentlyOrder?.roomId?.name }}，{{
                        useDaysCount(
                          recentlyOrder?.checkInDate!,
                          recentlyOrder?.checkOutDate!
                        )
                      }}
                      晚
                    </p>
                    <span
                      class="d-inline-block mx-4 bg-neutral-80"
                      style="width: 1px; height: 18px"
                    />
                    <p class="mb-0">
                      住宿人數：{{ recentlyOrder?.peopleNum }} 位
                    </p>
                  </h3>

                  <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
                    <p class="title-deco mb-2">
                      入住：{{ formatter(recentlyOrder.checkInDate) }}，15:00
                      可入住
                    </p>
                    <p class="title-deco mb-0">
                      退房：{{ formatter(recentlyOrder.checkOutDate) }}，12:00
                      前退房
                    </p>
                  </div>

                  <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                    NT$
                    {{
                      useThousands(
                        recentlyOrder.roomId?.price! *
                          useDaysCount(
                            recentlyOrder.checkInDate,
                            recentlyOrder.checkOutDate
                          )
                      )
                    }}
                  </p>
                </section>

                <hr class="my-0 opacity-100 text-neutral-40" />

                <section>
                  <h3
                    class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="item in recentlyOrder?.roomId?.facilityInfo"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ item.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="item in recentlyOrder?.roomId?.amenityInfo"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ item.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <div class="d-flex gap-4">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#cancelModal"
                    class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
                    style="--bs-btn-hover-color: #fff"
                    type="button"
                    @click="setOrderId(recentlyOrder._id!)"
                  >
                    取消預訂
                  </button>
                  <NuxtLink
                    :to="`/rooms/${recentlyOrder.roomId?._id}`"
                    class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
                    type="button"
                  >
                    查看詳情
                  </NuxtLink>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </ClientOnly>
      </div>
      <template v-if="allOrdersList">
        <div class="col-12 col-md-5">
          <div
            v-if="pastOrdersList?.length !== 0"
            class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
          >
            <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>

            <div class="passOrders">
              <div v-for="item in pastOrdersList" :key="item._id" class="order">
                <div class="d-flex flex-column flex-lg-row gap-6">
                  <img
                    class="img-fluid object-fit-cover rounded-3"
                    style="max-width: 120px; height: 80px"
                    :src="item.roomId?.imageUrl"
                    :alt="item.roomId?.name"
                  />
                  <section class="d-flex flex-column gap-4">
                    <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                      預訂參考編號： {{ item._id }}
                    </p>

                    <h3
                      class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
                    >
                      {{ item.roomId?.name }}
                    </h3>

                    <div class="text-neutral-80 fw-medium">
                      <p class="mb-2">
                        住宿天數：
                        {{ useDaysCount(item.checkInDate, item.checkOutDate) }}
                        晚
                      </p>
                      <p class="mb-0">住宿人數：{{ item.peopleNum }} 位</p>
                    </div>

                    <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                      <p class="title-deco mb-2">
                        入住：
                        {{ formatter(item.checkInDate) }}
                        ，15:00 可入住
                      </p>
                      <p class="title-deco mb-0">
                        退房：
                        {{ formatter(item.checkOutDate) }}
                        ，12:00 前退房
                      </p>
                    </div>
                    <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                      NT$
                      {{
                        useThousands(
                          item.roomId?.price! *
                            useDaysCount(item.checkInDate, item.checkOutDate)
                        )
                      }}
                    </p>
                  </section>
                </div>
              </div>
            </div>
            <button
              class="btn btn-outline-primary-100 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              type="button"
            >
              查看更多
            </button>
          </div>
        </div>
      </template>
    </div>

    <div id="cancelModal" class="modal fade" tabindex="-1">
      <div
        class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100"
      >
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div
            class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold"
          >
            確定要取消此房型的預訂嗎？
          </div>
          <div class="modal-footer d-flex gap-4">
            <button
              type="button"
              class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              data-bs-dismiss="modal"
            >
              關閉視窗
            </button>
            <button
              type="button"
              class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
              data-bs-dismiss="modal"
              @click="deleteOrder"
            >
              確定取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}

.passOrders {
  max-height: 1100px;
  overflow-y: scroll;
}

.order {
  border-bottom: 1px solid #e9ecef;
  padding: 24px 0;
}

.swiper :deep(.swiper-pagination-bullet) {
  width: 32px;
  height: 4px;
  background-color: #f1eae4;
  border-radius: 100px;
  opacity: 1;
}

.swiper :deep(.swiper-pagination-bullet-active) {
  width: 60px;
  background-color: #bf9d7d;
}
</style>

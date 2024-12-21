<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { FormContext } from "vee-validate";
import { getRoomById, getRooms } from "~/api/rooms";
import type { GetResult, Order } from "~/api/types";
import DatePickerModal from "~/components/rooms/DatePickerModal.vue";
import { useThousands } from "~/composables/useThousands";
import ZipCodeMap from "~/data/zipCodeMap";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  county: string;
  district: string;
  detail: string;
}

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const bookingStore = useBookingStore();
const { bookingDate, bookingPeople, daysCount } = storeToRefs(bookingStore);

const baseURL = process.env.BASE_URL;
const token = useCookie("auth");

// 取得用戶
const { user } = await useGetUser();

// 會員初始資料
let userInfo = {
  name: "",
  phone: "",
  email: "",
  address: {
    zipcode: "",
    detail: "",
  },
};

// 日期 Modal
const datePickerModal = ref<InstanceType<typeof DatePickerModal> | null>(null);
const openModal = () => {
  datePickerModal.value?.openModal();
};

const handleDateChange = (bookingInfo: any) => {
  // 要注意 bookingInfo 的結構
  const { start, end } = bookingInfo.date;
  bookingDate.value.date.start = start;
  bookingDate.value.date.end = end;

  bookingPeople.value = bookingInfo?.people || 1;
  daysCount.value = bookingInfo.daysCount.value;
};

// 轉變日期字串
const { formatter, formatterDate } = useDayjs();

// 取得全部房型
const { data: roomsList } = await useAsyncData("rooms", () => getRooms());

// 取得詳細房間資訊
const roomId = route.params.roomId as string;
const { data: room } = await useAsyncData("room", () => getRoomById(roomId));

// 改變房型
const roomName = ref(room.value?.name);
const showRoomEdit = ref(false);
const editRoomHandler = () => {
  showRoomEdit.value = !showRoomEdit.value;
};
const changeRoom = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  const dataId = selectedOption.getAttribute("data-id");
  router.push(`/rooms/${dataId}/booking`);
};

// 改變人數
const showPeople = ref(false);
const showPeopleEdit = () => {
  showPeople.value = !showPeople.value;
};

// 地址
const selectedCounty = ref("臺北市");
const selectedDistrict = ref("中正區");
const zpCodeRef = ref<HTMLInputElement | null>(null);
const countyRef = ref<HTMLSelectElement | null>(null);
const districtRef = ref<HTMLSelectElement | null>(null);

onMounted(() => {
  // 初始化台灣縣市二級選單 plugin tw-city-selector
  const { $twCitySelector } = useNuxtApp();
  new $twCitySelector({
    el: ".city-selector-set",
    standardWords: true,
    elCounty: ".county",
    elDistrict: ".district",
    elZipcode: ".zipcode",
    hasZipcode: true,
    hiddenZipcode: true,
    countyValue: selectedCounty.value, // 預設城市
    districtValue: selectedDistrict.value, // 預設地區
  });
});

// 判斷有無登入，未登入須先登入
const { sweetAlert } = useSweetAlert();
const loginFn = () => {
  sweetAlert("info", "請先登入", "2 秒後將自動跳轉到登入頁");
  setTimeout(() => {
    router.push("/account/login");
  }, 2000);
};

// 套用會員資料
const handleUserData = () => {
  if (user.value) {
    userInfo.name = user.value?.name!;
    userInfo.phone = user.value?.phone!;
    userInfo.email = user.value?.email!;
    userInfo.address.zipcode = user.value?.address.zipcode!;
    userInfo.address.detail = user.value?.address.detail!;

    selectedCounty.value = ZipCodeMap.find(
      (item) => item.zipcode === Number(user?.value?.address.zipcode)
    )?.city!;
    selectedDistrict.value = ZipCodeMap.find(
      (item) => item.zipcode === Number(user?.value?.address.zipcode)
    )?.county!;
    zpCodeRef.value!.value = user.value?.address.zipcode!;

    // 清空舊的選項，不然選單會重複
    if (countyRef.value) countyRef.value.innerHTML = "";
    if (districtRef.value) districtRef.value.innerHTML = "";

    // 重新初始化台灣縣市二級選單 tw-city-selector，不然值無法變更
    const { $twCitySelector } = useNuxtApp();
    new $twCitySelector({
      el: ".city-selector-set",
      standardWords: true,
      elCounty: ".county",
      elDistrict: ".district",
      elZipcode: ".zipcode",
      hasZipcode: true,
      hiddenZipcode: true,
      countyValue: selectedCounty.value, // 更新預設城市
      districtValue: selectedDistrict.value, // 更新預設地區
    });
  } else {
    loginFn();
  }
};

// 表單送出隱藏按鈕
const submitButtonRef = ref<HTMLButtonElement | null>(null);
const confirmBooking = () => {
  // 沒登入就導到登入頁
  if (user.value) {
    submitButtonRef.value?.click();
  } else {
    loginFn();
  }
};

// 送出表單
const onSubmit = async (
  data: any,
  { resetForm }: Pick<FormContext<FormValues>, "resetForm">
) => {
  userInfo = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: {
      zipcode: zpCodeRef.value?.value!,
      detail: data.detail,
    },
  };

  const body = {
    roomId,
    checkInDate: bookingDate.value.date.start.replaceAll("-", "/"),
    checkOutDate: bookingDate.value.date.end.replaceAll("-", "/"),
    peopleNum: bookingPeople.value,
    userInfo,
  };

  isLoading.value = true;

  try {
    const res = await $fetch<GetResult<Order>>(`/orders/`, {
      method: "POST",
      baseURL,
      body,
      headers: {
        Authorization: token.value || "",
      },
      onResponseError({ response }) {
        const { message } = response._data;
        console.error(message);
      },
    });

    // 還原當前日期
    bookingDate.value.date.start = formatterDate(new Date());
    bookingDate.value.date.end = formatterDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );

    // 還原初始人數
    bookingPeople.value = 1;

    // 沒有 await 會有奇怪的短暫停留時間
    await router.push(`/booking/confirmation/${res.result._id}`);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

// seo
const requestURL = useRequestURL();
const title = useMetaTitle("確認訂房資訊");
useSeoMeta({
  title,
  description: "確認預定房型，並填寫訂房人資訊。",
  ogTitle: title,
  ogDescription: "確認預定房型，並填寫訂房人資訊。",
  ogSiteName: title,
  ogType: "website",
  ogUrl: requestURL.href,
  ogImage: `${room.value?.smallImageUrl}`,
});
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="navigateTo(`/rooms/${room?._id}`)"
        >
          <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                    <p v-if="!showRoomEdit" class="mb-0 fw-medium">
                      {{ room?.name }}
                    </p>
                    <select
                      v-else
                      class="form-select"
                      aria-label="Select room"
                      v-model="roomName"
                      @change="changeRoom"
                    >
                      <option
                        v-for="item in roomsList"
                        :key="item._id"
                        :value="item.name"
                        :data-id="item._id"
                      >
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="editRoomHandler"
                  >
                    {{ !showRoomEdit ? "編輯" : "確定" }}
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                    <p class="mb-2 fw-medium">
                      入住：{{ formatter(bookingDate.date.start) }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{ formatter(bookingDate.date.end) }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="openModal"
                  >
                    編輯
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                    <p v-if="!showPeople" class="mb-0 fw-medium">
                      {{ bookingPeople }} 人
                    </p>
                    <select
                      v-else
                      class="form-select"
                      aria-label="Default select example"
                      v-model="bookingPeople"
                    >
                      <option
                        v-for="people in room?.maxPeople"
                        :key="people"
                        :value="people"
                      >
                        {{ people }}
                      </option>
                    </select>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="showPeopleEdit"
                  >
                    {{ !showPeople ? "編輯" : "確認" }}
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="handleUserData"
                >
                  套用會員資料
                </button>
              </div>

              <VeeForm
                v-slot="{ errors }"
                class="d-flex flex-column gap-6"
                @submit="onSubmit"
              >
                <div class="text-neutral-100">
                  <label for="name" class="form-label fs-8 fs-md-7 fw-bold">
                    姓名
                  </label>
                  <VeeField
                    id="name"
                    name="name"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['name'] }"
                    placeholder="請輸入姓名"
                    rules="required|min:2"
                    v-model="userInfo.name"
                  />
                  <VeeErrorMessage class="invalid-feedback" name="name" />
                </div>

                <div class="text-neutral-100">
                  <label for="phone" class="form-label fs-8 fs-md-7 fw-bold">
                    手機號碼
                  </label>
                  <VeeField
                    id="phone"
                    name="phone"
                    type="tel"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['phone'] }"
                    placeholder="請輸入手機號碼"
                    rules="required|isPhone"
                    v-model="userInfo.phone"
                  />
                  <VeeErrorMessage class="invalid-feedback" name="phone" />
                </div>

                <div class="text-neutral-100">
                  <label for="email" class="form-label fs-8 fs-md-7 fw-bold">
                    電子信箱
                  </label>
                  <VeeField
                    id="email"
                    name="email"
                    type="email"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['email'] }"
                    placeholder="請輸入電子信箱"
                    rules="required|email"
                    v-model="userInfo.email"
                  />
                  <VeeErrorMessage class="invalid-feedback" name="email" />
                </div>

                <div class="text-neutral-100">
                  <label for="address" class="form-label fs-8 fs-md-7 fw-bold">
                    地址
                  </label>
                  <div class="city-selector-set d-flex gap-2 mb-4">
                    <div class="w-50">
                      <select
                        id="county"
                        class="county form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                        v-model="selectedCounty"
                        ref="countyRef"
                      />
                    </div>
                    <div class="w-50">
                      <select
                        id="district"
                        class="district form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                        v-model="selectedDistrict"
                        ref="districtRef"
                      />
                    </div>
                    <input
                      id="zipcode"
                      class="zipcode form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3 d-none"
                      type="text"
                      placeholder="郵遞區號"
                      ref="zpCodeRef"
                      readOnly
                    />
                  </div>
                  <VeeField
                    id="address"
                    name="detail"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['detail'] }"
                    placeholder="請輸入詳細地址"
                    rules="required"
                    v-model="userInfo.address.detail"
                  />
                  <VeeErrorMessage class="invalid-feedback" name="detail" />
                </div>

                <button ref="submitButtonRef" type="submit" class="d-none" />
              </VeeForm>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ room?.areaInfo }} 坪
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ room?.bedInfo }} 張大床
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ room?.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <template
                      v-for="layout in room?.layoutInfo"
                      :key="layout.title"
                    >
                      <li v-if="layout.isProvide" class="d-flex gap-2">
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ layout.title }}
                        </p>
                      </li>
                    </template>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <template
                      v-for="facility in room?.facilityInfo"
                      :key="facility.title"
                    >
                      <li
                        v-if="facility.isProvide"
                        class="flex-item d-flex gap-2"
                      >
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ facility.title }}
                        </p>
                      </li>
                    </template>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <template
                      v-for="amenity in room?.amenityInfo"
                      :key="amenity.title"
                    >
                      <li
                        v-if="amenity.isProvide"
                        class="flex-item d-flex gap-2"
                      >
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ amenity.title }}
                        </p>
                      </li>
                    </template>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="room?.imageUrl"
                :alt="room?.name"
              />

              <div>
                <h2 class="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>NT$ {{ useThousands(room!.price) }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ daysCount }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    NT$ {{ useThousands(room!.price * daysCount) }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100"> -NT$ 1,000 </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span>
                    NT$ {{ useThousands(room!.price * daysCount - 1000) }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <DatePickerModal
      ref="datePickerModal"
      :date-time="bookingDate"
      @handle-date-change="handleDateChange"
    />

    <RoomsBookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  width: 97.28px;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>

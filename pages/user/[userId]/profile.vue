<script setup lang="ts">
import type { FormContext } from "vee-validate";
import ZipCodeMap from "~/data/zipCodeMap";

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

definePageMeta({
  layout: "user-layout",
  middleware: ["auth"],
});

const isEditPassword = ref(false);
const isEditProfile = ref(false);

const years = new Date().getFullYear() - 1910;

const token = useCookie("auth");
const baseURL = process.env.BASE_URL;

// 取得用戶
const { user } = await useGetUser();

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const { sweetAlert } = useSweetAlert();

// 變更密碼
const onChangePassWord = async (
  data: Record<string, string>,
  { resetForm }: Pick<FormContext<PasswordData>, "resetForm">
) => {
  const body = {
    userId: user.value?._id,
    name: user.value?.name,
    phone: user.value?.phone,
    birthday: user.value?.birthday,
    address: {
      zipcode: user.value?.address.zipcode,
      detail: user.value?.address.detail,
    },
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
  };

  try {
    await $fetch("/user/", {
      method: "PUT",
      baseURL,
      body,
      headers: {
        Authorization: token.value!,
      },
      onResponseError({ response }) {
        console.error(response._data.message);
      },
    });

    sweetAlert("success", "變更密碼成功！");
    resetForm();
    isEditPassword.value = false;
  } catch (error: any) {
    sweetAlert("error", "變更密碼失敗！", `${error.response._data.message}`);
    console.error(error);
  }
};

// 日期轉換格式
const { formatterYearToDate } = useDayjs();
const birthday = ref(formatterYearToDate(user.value?.birthday!));

// 出生年
const userBirthYear = birthday.value.slice(0, 6);
const selectedYear = ref(userBirthYear);

const changeYear = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  selectedYear.value = selectedOption.value;
};

// 出生月
const userBirthMonth = birthday.value.slice(7, 11);
const selectedMonth = ref(userBirthMonth);

const changeMonth = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  selectedMonth.value = selectedOption.value;
};

// 出生日
const userBirthDay = birthday.value.slice(12);
const selectedDay = ref(userBirthDay);

const changeDay = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  selectedDay.value = selectedOption.value;
};

// 地址
const city = ZipCodeMap.find(
  (item) => item.zipcode === Number(user?.value?.address.zipcode)
)?.city;
const district = ZipCodeMap.find(
  (item) => item.zipcode === Number(user?.value?.address.zipcode)
)?.county;

// 初始化台灣縣市二級選單 plugin tw-city-selector
const selectedCounty = ref(city || "");
const selectedDistrict = ref(district || "");

onMounted(() => {
  const { $twCitySelector } = useNuxtApp();
  new $twCitySelector({
    el: ".city-selector-set",
    standardWords: true,
    elCounty: ".county",
    elDistrict: ".district",
    elZipcode: ".zipcode",
    hasZipcode: true,
    hiddenZipcode: true,
    countyValue: city, // 預設城市
    districtValue: district, // 預設地區
  });
});

const userForm = ref({
  name: user.value?.name,
  phone: user.value?.phone,
  detail: user.value?.address.detail,
});

// 更新用戶資料
const onChangeUserData = async (data: any) => {
  const changeYear = data.userYear.slice(0, 4);
  const changeMonth = data.userMonth.slice(0, 2);
  const changeDay = data.userDay.slice(0, 2);

  const zipCode = ZipCodeMap.find(
    (item) =>
      item.city === selectedCounty.value &&
      item.county === selectedDistrict.value
  )?.zipcode;

  const body = {
    userId: user.value?._id,
    name: data.name,
    phone: data.phone,
    birthday: `${changeYear}/${changeMonth}/${changeDay}`,
    address: {
      zipcode: zipCode,
      detail: data.detail,
    },
  };

  try {
    await $fetch("/user/", {
      method: "PUT",
      baseURL,
      body,
      headers: {
        Authorization: token.value!,
      },
      onResponseError({ response }) {
        console.error(response._data.message);
      },
    });

    // 重新渲染用戶資料 (不這樣做資料無法變更)
    await useGetUser();

    sweetAlert("success", "變更資料成功！");
    isEditProfile.value = false;
  } catch (error: any) {
    sweetAlert("error", "變更資料失敗！", `${error.response._data.message}`);
    console.error(error);
  }
};

// seo
const requestURL = useRequestURL();
const title = useMetaTitle("個人資料");
useSeoMeta({
  title,
  description: "查看和修改個人基本資料和密碼。",
  ogTitle: title,
  ogDescription: "查看和修改個人基本資料和密碼。",
  ogSiteName: title,
  ogType: "website",
  ogUrl: requestURL.href,
});
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
            >
              {{ user?.email }}
            </span>
          </div>

          <div
            class="d-flex justify-content-between align-items-center"
            :class="{ 'd-none': isEditPassword }"
          >
            <div>
              <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                密碼
              </label>
              <input
                class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                type="password"
                value="**********"
              />
            </div>

            <button
              class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
              type="button"
              @click="isEditPassword = !isEditPassword"
            >
              重設
            </button>
          </div>

          <VeeForm
            v-slot="{ errors }"
            class="d-flex flex-column gap-4 gap-md-6"
            :class="{ 'd-none': !isEditPassword }"
            @submit="onChangePassWord"
          >
            <div>
              <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold">
                舊密碼
              </label>
              <VeeField
                id="oldPassword"
                name="oldPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                :class="{ 'is-invalid': errors['oldPassword'] }"
                placeholder="請輸入舊密碼"
                rules="required|min:8"
                v-model="passwordForm.oldPassword"
              />
              <VeeErrorMessage class="invalid-feedback" name="oldPassword" />
            </div>

            <div>
              <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold">
                新密碼
              </label>
              <VeeField
                id="newPassword"
                name="newPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                :class="{ 'is-invalid': errors['newPassword'] }"
                placeholder="請輸入 8 碼以上新密碼"
                rules="required|min:8|newPasswordMatch:@oldPassword"
                v-model="passwordForm.newPassword"
              />
              <VeeErrorMessage class="invalid-feedback" name="newPassword" />
            </div>

            <div>
              <label
                for="confirmPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >
                確認新密碼
              </label>
              <VeeField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                :class="{ 'is-invalid': errors['confirmPassword'] }"
                placeholder="請再輸入一次新密碼"
                rules="required|min:8|passwordMatch:@newPassword"
                v-model="passwordForm.confirmPassword"
              />
              <VeeErrorMessage
                class="invalid-feedback"
                name="confirmPassword"
              />
            </div>

            <button
              :class="{
                disabled:
                  passwordForm.oldPassword === '' ||
                  passwordForm.newPassword === '' ||
                  passwordForm.confirmPassword === '',
              }"
              class="btn btn-primary-100 align-self-md-start px-8 py-4 text-white rounded-3"
              type="submit"
            >
              儲存設定
            </button>
          </VeeForm>
        </div>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
        <VeeForm
          v-slot="{ errors }"
          class="d-flex flex-column gap-4 gap-md-6"
          @submit="onChangeUserData"
        >
          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="name"
            >
              姓名
            </label>
            <VeeField
              id="name"
              name="name"
              type="text"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
                'is-invalid': errors['name'],
              }"
              placeholder="請輸入姓名"
              rules="required|min:2"
              v-model="userForm.name"
            />
            <VeeErrorMessage class="invalid-feedback" name="name" />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="phone"
            >
              手機號碼
            </label>
            <VeeField
              id="phone"
              name="phone"
              type="tel"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
                'is-invalid': errors['phone'],
              }"
              placeholder="請輸入手機號碼"
              rules="required|isPhone"
              v-model="userForm.phone"
            />
            <VeeErrorMessage class="invalid-feedback" name="phone" />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
            >
              生日
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
            >
              {{ formatterYearToDate(user?.birthday!) }}
            </span>
            <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
              <div class="w-50">
                <VeeField
                  as="select"
                  name="userYear"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :class="{
                    'is-invalid': errors['userYear'],
                  }"
                  rules="required"
                  v-model="selectedYear"
                  @change="changeYear"
                >
                  <option
                    v-for="year in years"
                    :key="year"
                    :value="`${year + 1910} 年`"
                  >
                    {{ year + 1910 }} 年
                  </option>
                </VeeField>
                <VeeErrorMessage class="invalid-feedback" name="userYear" />
              </div>
              <div class="w-50">
                <VeeField
                  as="select"
                  name="userMonth"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :class="{
                    'is-invalid': errors['userMonth'],
                  }"
                  rules="required"
                  v-model="selectedMonth"
                  @change="changeMonth"
                >
                  <option
                    v-for="month in 12"
                    :key="month"
                    :value="`${month < 10 ? `0${month}` : month} 月`"
                  >
                    {{ month < 10 ? `0${month}` : month }} 月
                  </option>
                </VeeField>
                <VeeErrorMessage class="invalid-feedback" name="userMonth" />
              </div>
              <div class="w-50">
                <VeeField
                  as="select"
                  name="userDay"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :class="{
                    'is-invalid': errors['userDay'],
                  }"
                  rules="required"
                  v-model="selectedDay"
                  @change="changeDay"
                >
                  <option
                    v-for="day in 31"
                    :key="day"
                    :value="`${day < 10 ? `0${day}` : day} 日`"
                  >
                    {{ day < 10 ? `0${day}` : day }} 日
                  </option>
                </VeeField>
                <VeeErrorMessage class="invalid-feedback" name="userDay" />
              </div>
            </div>
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
            >
              地址
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
            >
              {{
                `${
                  ZipCodeMap.find(
                    (item) => item.zipcode === Number(user?.address.zipcode)
                  )?.city
                }${
                  ZipCodeMap.find(
                    (item) => item.zipcode === Number(user?.address.zipcode)
                  )?.county
                }${user?.address.detail}`
              }}
            </span>
            <div :class="{ 'd-none': !isEditProfile }">
              <div class="city-selector-set d-flex gap-2 mb-4">
                <div class="w-50">
                  <select
                    id="county"
                    class="county form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                    v-model="selectedCounty"
                  />
                </div>
                <div class="w-50">
                  <select
                    id="district"
                    class="district form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                    v-model="selectedDistrict"
                  />
                </div>
                <input
                  id="zipcode"
                  class="zipcode form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3 d-none"
                  type="text"
                  placeholder="郵遞區號"
                  readOnly
                />
              </div>
              <VeeField
                id="detail"
                name="detail"
                type="text"
                class="form-control p-4 rounded-3"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                  'is-invalid': errors['detail'],
                }"
                placeholder="請輸入詳細地址"
                rules="required"
                v-model="userForm.detail"
              />
              <VeeErrorMessage class="invalid-feedback" name="detail" />
            </div>
          </div>

          <button
            :class="{ 'd-none': !isEditProfile }"
            class="btn btn-primary-100 align-self-md-start px-8 py-4 text-white rounded-3"
            type="submit"
          >
            儲存設定
          </button>
        </VeeForm>
        <button
          :class="{ 'd-none': isEditProfile }"
          class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
          type="button"
          style="--bs-btn-hover-color: #fff"
          @click="isEditProfile = !isEditProfile"
        >
          編輯
        </button>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>

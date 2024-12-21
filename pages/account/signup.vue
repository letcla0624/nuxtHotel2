<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { signup } from "~/api/auth";
import ZipCodeMap from "~/data/zipCodeMap";

definePageMeta({
  layout: "account-layout",
});

const router = useRouter();
const { sweetAlert } = useSweetAlert();
const isEmailAndPasswordValid = ref(false);

const date = new Date();
const years = date.getFullYear() - 1910;

// 表單初始
const signupFirstForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});
const signupSecondForm = ref({
  name: "",
  phone: "",
  userYear: "1911 年",
  userMonth: "01 月",
  userDay: "01 日",
  detail: "",
});

// 出生年
const changeYear = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  signupSecondForm.value.userYear = selectedOption.value;
};

// 出生月
const changeMonth = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  signupSecondForm.value.userMonth = selectedOption.value;
};

// 出生日
const changeDay = (e: Event) => {
  const select = e.target as HTMLSelectElement;
  const selectedOption = select.options[select.selectedIndex];
  signupSecondForm.value.userDay = selectedOption.value;
};

// 初始化台灣縣市二級選單 plugin tw-city-selector
const selectedCounty = ref("");
const selectedDistrict = ref("");

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
  });
});

const onSubmitFirst = (data: any) => {
  signupFirstForm.value = data;
};
const onSubmitSecond = async (data: any) => {
  signupSecondForm.value = data;

  const zipCode = ZipCodeMap.find(
    (item) =>
      item.city === selectedCounty.value &&
      item.county === selectedDistrict.value
  )?.zipcode;

  const body = {
    email: signupFirstForm.value.email,
    password: signupFirstForm.value.password,
    name: signupSecondForm.value.name,
    phone: signupSecondForm.value.phone,
    birthday: `${signupSecondForm.value.userYear.slice(
      0,
      4
    )}/${signupSecondForm.value.userMonth.slice(
      0,
      2
    )}/${signupSecondForm.value.userDay.slice(0, 2)}`,
    address: {
      zipcode: `${zipCode}`,
      detail: signupSecondForm.value.detail,
    },
  };

  try {
    await signup(body);
    sweetAlert("success", "註冊成功！");
    router.push("/account/login");
  } catch (error: any) {
    sweetAlert("error", "註冊失敗！", `${error.response._data.message}`);
    console.error(error);
  }
};

// seo
const title = useMetaTitle("註冊會員");
useSeoMeta({
  title,
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VeeForm
        v-slot="{ errors }"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
        @submit="onSubmitFirst"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            電子信箱
          </label>
          <VeeField
            id="email"
            name="email"
            type="email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入電子信箱"
            rules="required|email"
            v-model="signupFirstForm.email"
          />
          <VeeErrorMessage class="invalid-feedback" name="email" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            密碼
          </label>
          <VeeField
            id="password"
            name="password"
            type="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['password'] }"
            placeholder="請輸入 8 碼以上英數密碼"
            rules="required|min:8"
            v-model="signupFirstForm.password"
          />
          <VeeErrorMessage class="invalid-feedback" name="password" />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
            確認密碼
          </label>
          <VeeField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['confirmPassword'] }"
            placeholder="請再輸入一次新密碼"
            rules="required|min:8|passwordMatch:@password"
            v-model="signupFirstForm.confirmPassword"
          />
          <VeeErrorMessage class="invalid-feedback" name="confirmPassword" />
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-white fw-bold"
          :class="{
            disabled:
              signupFirstForm.email === '' ||
              signupFirstForm.password === '' ||
              signupFirstForm.confirmPassword === '',
          }"
          type="submit"
          @click="isEmailAndPasswordValid = true"
        >
          下一步
        </button>
      </VeeForm>
      <VeeForm
        v-slot="{ errors }"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
        @submit="onSubmitSecond"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
          <VeeField
            id="name"
            name="name"
            type="text"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{
              'is-invalid': errors['name'],
            }"
            placeholder="請輸入姓名"
            rules="required|min:2"
            :value="signupSecondForm?.name"
          />
          <VeeErrorMessage class="invalid-feedback" name="name" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="phone">
            手機號碼
          </label>
          <VeeField
            id="phone"
            name="phone"
            type="tel"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{
              'is-invalid': errors['phone'],
            }"
            placeholder="請輸入手機號碼"
            rules="required|isPhone"
            :value="signupSecondForm?.phone"
          />
          <VeeErrorMessage class="invalid-feedback" name="phone" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold"> 生日 </label>
          <div class="d-flex gap-2">
            <div class="w-50">
              <VeeField
                as="select"
                name="userYear"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                :class="{
                  'is-invalid': errors['userYear'],
                }"
                rules="required"
                :value="signupSecondForm.userYear"
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
                :value="signupSecondForm.userMonth"
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
                :value="signupSecondForm.userDay"
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
        <div class="mb-4 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="detail">
            地址
          </label>
          <div>
            <div class="city-selector-set d-flex gap-2 mb-4">
              <div class="w-50">
                <select
                  id="county"
                  class="county form-select p-4 text-neutral-80 fw-medium rounded-3"
                  v-model="selectedCounty"
                />
              </div>
              <div class="w-50">
                <select
                  id="district"
                  class="district form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                'is-invalid': errors['detail'],
              }"
              placeholder="請輸入詳細地址"
              rules="required"
              :value="signupSecondForm.detail"
            />
            <VeeErrorMessage class="invalid-feedback" name="detail" />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            value=""
          />
          <label class="form-check-label fw-bold" for="agreementCheck">
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
        >
          完成註冊
        </button>
      </VeeForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="/account/login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
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

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>

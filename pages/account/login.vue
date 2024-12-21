<script setup lang="ts">
import type { FormContext } from "vee-validate";
import { login } from "~/api/auth";
import type { Login } from "~/api/types";

definePageMeta({
  layout: "account-layout",
  middleware: (to, from) => {
    to.query.from = from.fullPath;
  },
});

const route = useRoute();
const router = useRouter();
const isDisabled = ref(false);

// 使用 composable
const { sweetAlert } = useSweetAlert();

// 記住帳號
const rememberRef = ref<HTMLInputElement | null>(null);
const rememberChecked = ref(false);
const loginForm = ref({
  email: "",
  password: "",
});

const onRemember = () => {
  rememberChecked.value = !rememberChecked.value;
};

onMounted(() => {
  if (localStorage.getItem("userEmail")) {
    loginForm.value.email = localStorage.getItem("userEmail")!;
    rememberChecked.value = true;
  } else {
    loginForm.value.email = "";
    rememberChecked.value = false;
  }
});

// 登入
const onSubmit = async (
  body: any,
  { resetForm }: Pick<FormContext<Login>, "resetForm">
) => {
  isDisabled.value = true;

  try {
    const res = await login(body);

    // 將 token 寫入 cookie
    const authCookie = useCookie("auth", {
      path: "/",
    });
    authCookie.value = res.token;

    // sweetAlert2 顯示訊息
    sweetAlert("success", "登入成功");
    // 完成後清空
    resetForm();
    // 重新導向
    route.query.from === "/account/signup" ||
    route.query.from === "/account/login"
      ? router.push("/")
      : router.go(-1);
  } catch (error: any) {
    sweetAlert("error", "登入失敗", error.response._data.message);
    console.error(error);
  } finally {
    isDisabled.value = false;

    // 記住帳號到本地
    if (rememberChecked.value) {
      localStorage.setItem("userEmail", body.email);
    } else {
      localStorage.removeItem("userEmail");
    }
  }
};

// seo
const title = useMetaTitle("會員登入");
useSeoMeta({
  title,
});
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">立即開始旅程</h1>
    </div>

    <VeeForm v-slot="{ errors }" class="mb-10" @submit="onSubmit">
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
          v-model="loginForm.email"
        />
        <VeeErrorMessage class="invalid-feedback" name="email" />
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
        <VeeField
          id="password"
          name="password"
          type="password"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          :class="{ 'is-invalid': errors['password'] }"
          placeholder="請輸入 8 碼以上英數密碼"
          rules="required|min:8"
          v-model="loginForm.password"
        />
        <VeeErrorMessage class="invalid-feedback" name="password" />
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7"
      >
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input
            id="remember"
            class="form-check-input"
            type="checkbox"
            ref="rememberRef"
            @click="onRemember"
            :checked="rememberChecked"
          />
          <label class="form-check-label fw-bold" for="remember">
            記住帳號
          </label>
        </div>
        <button
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
          type="button"
        >
          忘記密碼？
        </button>
      </div>
      <button
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="submit"
        :disabled="isDisabled"
      >
        會員登入
      </button>
    </VeeForm>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="/account/signup"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
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
</style>

<script setup lang="ts">
import type { FormContext } from "vee-validate";
import type { GetResult, Result } from "~/api/types";

export interface News {
  title: string;
  description: string;
  image: string;
  smallImage: string;
}

definePageMeta({
  layout: "backend-layout",
  middleware: ["auth"],
});

const baseURL = process.env.BASE_URL;
const token = useCookie("auth");
const newsList = ref<Result[]>([]);

// 取得全部消息
const getAllNews = async () => {
  return await $fetch<GetResult<Result[]>>(`${baseURL}/admin/news/`, {
    method: "GET",
    baseURL,
    headers: {
      Authorization: token.value || "",
    },
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });
};

onMounted(async () => {
  const res = await getAllNews();
  newsList.value = res.result;
});

// 新增最新消息
const submitRef = ref<HTMLButtonElement | null>(null);
const handleSubmit = () => {
  submitRef.value?.click();
};

const { sweetAlert } = useSweetAlert();
const isEdit = ref(false);
const newsId = ref("");
const newsForm = ref({
  title: "",
  description: "",
  image: "",
  smallImage: "",
});

const onSubmit = async (
  body: any,
  { resetForm }: Pick<FormContext<News>, "resetForm">
) => {
  try {
    if (isEdit.value === false) {
      // 新增
      await $fetch("/admin/news/", {
        method: "POST",
        baseURL,
        body,
        headers: {
          Authorization: token.value!,
        },
        onResponseError({ response }) {
          const { message } = response._data;
          console.error("Error:", message);
        },
      });
    } else {
      // 編輯
      await $fetch(`/admin/news/${newsId.value}`, {
        method: "PUT",
        baseURL,
        body,
        headers: {
          Authorization: token.value!,
        },
        onResponseError({ response }) {
          const { message } = response._data;
          console.error("Error:", message);
        },
      });
    }

    // sweetAlert2 顯示訊息
    await sweetAlert("success", `${isEdit.value ? "編輯" : "新增"}成功`);

    // 重新更新畫面
    const res = await getAllNews();
    newsList.value = res.result;

    // 完成後清空
    resetForm();
  } catch (error: any) {
    sweetAlert("error", "新增失敗", error.response._data.message);
    console.error(error);
  }
};

// 刪除最新消息
const deleteNewsById = async (id: string) => {
  try {
    await $fetch(`/admin/news/${id}`, {
      method: "DELETE",
      baseURL,
      headers: {
        Authorization: token.value!,
      },
      onResponseError({ response }) {
        const { message } = response._data;
        console.error("Error:", message);
      },
    });

    // 重新更新畫面
    const res = await getAllNews();
    newsList.value = res.result;
    sweetAlert("success", "刪除成功");
  } catch (error: any) {
    sweetAlert("error", "刪除失敗", error.response._data.message);
    console.error(error);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="fs-3 fw-bold">管理最新消息</h1>
      <button
        type="button"
        class="btn btn-outline-primary-100"
        data-bs-toggle="modal"
        data-bs-target="#modal"
        @click="
          isEdit = false;
          newsForm = {
            title: '',
            description: '',
            image: 'https://fakeimg.pl/300/',
            smallImage: 'https://fakeimg.pl/300/',
          };
        "
      >
        新增
      </button>
    </div>
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th scope="col" width="200">id</th>
          <th scope="col" width="100">圖片</th>
          <th scope="col">標題</th>
          <th scope="col" width="600">描述</th>
          <th scope="col">管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in newsList" :key="item._id">
          <td>{{ item._id }}</td>
          <td>
            <img :src="item.image" :alt="item.title" />
          </td>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline-success"
                data-bs-toggle="modal"
                data-bs-target="#modal"
                @click="
                  isEdit = true;
                  newsForm = item;
                  newsId = item._id;
                "
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="deleteNewsById(item._id)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modal"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalLabel">
              {{ isEdit ? "編輯" : "新增" }}最新消息
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <VeeForm v-slot="{ errors }" class="mb-10" @submit="onSubmit">
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 fw-bold" for="title"> 標題 </label>
                <VeeField
                  id="title"
                  name="title"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  :class="{ 'is-invalid': errors['title'] }"
                  placeholder="請輸入標題"
                  rules="required|min:2"
                  v-model="newsForm.title"
                />
                <VeeErrorMessage class="invalid-feedback" name="title" />
              </div>
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 fw-bold" for="description"> 描述 </label>
                <VeeField
                  as="textarea"
                  id="description"
                  name="description"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  :class="{ 'is-invalid': errors['description'] }"
                  placeholder="請輸入描述"
                  rules="required|min:2"
                  v-model="newsForm.description"
                />
                <VeeErrorMessage class="invalid-feedback" name="description" />
              </div>
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 fw-bold" for="image"> 圖片網址 </label>
                <VeeField
                  id="image"
                  name="image"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  :class="{ 'is-invalid': errors['image'] }"
                  placeholder="請輸入圖片網址"
                  rules="required"
                  v-model="newsForm.image"
                />
                <VeeErrorMessage class="invalid-feedback" name="image" />
              </div>
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 fw-bold" for="smallImage">
                  手機版圖片網址
                </label>
                <VeeField
                  id="smallImage"
                  name="smallImage"
                  type="text"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  :class="{ 'is-invalid': errors['smallImage'] }"
                  placeholder="請輸入手機版圖片網址"
                  rules="required"
                  v-model="newsForm.smallImage"
                />
                <VeeErrorMessage class="invalid-feedback" name="smallImage" />
              </div>

              <button
                class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold d-none"
                type="submit"
                ref="submitRef"
              />
            </VeeForm>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-primary-100 text-white"
              data-bs-dismiss="modal"
              @click="handleSubmit"
            >
              {{ isEdit ? "編輯" : "新增" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 100px;
  height: auto;
}
</style>

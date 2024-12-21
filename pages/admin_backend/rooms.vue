<script setup lang="ts">
import type { GetResult, RoomResult } from "~/api/types";

definePageMeta({
  layout: "backend-layout",
  middleware: ["auth"],
});

const baseURL = process.env.BASE_URL;
const token = useCookie("auth");
const roomsList = ref<RoomResult[]>([]);

// 取得全部美食
const { data } = await useFetch<GetResult<RoomResult[]>>(
  `${baseURL}/admin/rooms/`,
  {
    method: "GET",
    baseURL,
    headers: {
      Authorization: token.value || "",
    },
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  }
);

roomsList.value = data.value?.result!;
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="fs-3 fw-bold">管理客房旅宿</h1>
      <button type="button" class="btn btn-outline-primary-100">新增</button>
    </div>
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th scope="col" width="200">id</th>
          <th scope="col" width="100">圖片</th>
          <th scope="col">房型</th>
          <th scope="col" width="600">描述</th>
          <th scope="col">管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in roomsList" :key="item._id">
          <td>{{ item._id }}</td>
          <td>
            <img :src="item.smallImageUrl" :alt="item.name" />
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-outline-success">
                編輯
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 100px;
  height: auto;
}
</style>

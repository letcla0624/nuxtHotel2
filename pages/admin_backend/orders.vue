<script setup lang="ts">
import type { GetResult, Order } from "~/api/types";
import ZipCodeMap from "~/data/zipCodeMap";

definePageMeta({
  layout: "backend-layout",
  middleware: ["auth"],
});

const { formatterYearToDate } = useDayjs();

// 天數
const daysCount = (startDate: string, endDate: string) => {
  if (startDate === null || endDate === null) return 0;

  const differenceTime =
    new Date(endDate).getTime() - new Date(startDate).getTime();

  const differenceDay = Math.round(differenceTime / (1000 * 60 * 60 * 24));

  return differenceDay;
};

const baseURL = process.env.BASE_URL;
const token = useCookie("auth");
const ordersList = ref<Order[]>([]);

// 取得全部訂單
const { data } = await useFetch<GetResult<Order[]>>(
  `${baseURL}/admin/orders/`,
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

ordersList.value =
  data.value?.result.sort(
    (a, b) =>
      new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
  ) || [];
</script>

<template>
  <div>
    <h1 class="fs-3 fw-bold">管理訂單</h1>
    <p v-if="ordersList.length === 0">還沒有任何訂單！</p>
    <table v-else class="table table-bordered table-hover">
      <thead>
        <tr>
          <th scope="col" width="200">id</th>
          <th scope="col">預定房型</th>
          <th scope="col">預定日期</th>
          <th scope="col" width="600">訂房者資訊</th>
          <th scope="col">訂單狀態</th>
          <th scope="col">總金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ordersList" :key="item._id">
          <td>{{ item._id }}</td>
          <td>
            <p>房型：{{ item.roomId?.name }}</p>
            <p>人數：{{ item.peopleNum }}</p>
          </td>
          <td>
            <p>入住：{{ formatterYearToDate(item.checkInDate) }}</p>
            <p>退房：{{ formatterYearToDate(item.checkOutDate) }}</p>
          </td>
          <td>
            <p>姓名：{{ item.userInfo.name }}</p>
            <p>電話：{{ item.userInfo.phone }}</p>
            <p>信箱：{{ item.userInfo.email }}</p>
            <p>
              地址：
              {{
                `${item.userInfo.address.zipcode} ${
                  ZipCodeMap.find(
                    (a) => a.zipcode === Number(item.userInfo.address.zipcode)
                  )?.city
                }${
                  ZipCodeMap.find(
                    (a) => a.zipcode === Number(item.userInfo.address.zipcode)
                  )?.county
                }${item.userInfo.address.detail}`
              }}
            </p>
          </td>
          <td>
            <span v-if="item.status === -1" class="badge text-bg-danger"
              >已取消</span
            >
            <span
              v-else-if="
                new Date(item.checkInDate).getTime() < new Date().getTime()
              "
              class="badge text-bg-success"
              >已完成</span
            >
            <span
              v-else-if="
                new Date(item.checkInDate).getTime() > new Date().getTime()
              "
              class="badge text-bg-secondary"
              >未完成</span
            >
          </td>
          <td>
            NT$
            {{
              useThousands(
                Number(item.roomId?.price) *
                  daysCount(item.checkInDate, item.checkOutDate) -
                  1000
              )
            }}
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

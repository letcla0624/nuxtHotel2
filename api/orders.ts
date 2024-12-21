const baseURL = process.env.BASE_URL;
const token = useCookie("auth");

// 送出訂單
// export async function postOrder(body: Order) {
//   const res = await $fetch<GetResult<Order>>(`/orders/`, {
//     method: "POST",
//     baseURL,
//     body,
//     headers: {
//       Authorization: token.value || "",
//     },
//     onResponseError({ response }) {
//       const { message } = response._data;
//       console.error(message);
//     },
//   });

//   return res.result;
// }

// 取得單筆訂單
// export async function getOrderById(orderId: string) {
//   const res = await $fetch<GetResult<Order>>(`/orders/${orderId}`, {
//     method: "GET",
//     baseURL,
//     headers: {
//       Authorization: token.value || "",
//     },
//     onResponseError({ response }) {
//       const { message } = response._data;
//       console.error("Error:", message);
//     },
//   });

//   return res.result;
// }

// 刪除單筆訂單
export async function deleteOrderById(orderId: string) {
  const res = await $fetch(`/orders/${orderId}`, {
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

  return res;
}

import type { GetResult, Result } from "./types";

const baseURL = process.env.BASE_URL;

// 取得美味佳餚
export async function getFoods() {
  const res = await $fetch<GetResult<Result[]>>("/home/culinary/", {
    method: "GET",
    baseURL,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return res.result;
}

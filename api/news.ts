import type { GetResult, Result } from "./types";

const baseURL = process.env.BASE_URL;

// 取得最新消息
export async function getNews() {
  const res = await $fetch<GetResult<Result[]>>("/home/news/", {
    method: "GET",
    baseURL,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return res.result;
}

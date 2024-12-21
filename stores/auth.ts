import type { GetResult, UserInfo } from "~/api/types";

export const useAuthStore = defineStore("auth", () => {
  const baseURL = process.env.BASE_URL;
  const user = ref<UserInfo>();
  const username = ref("");

  // 取得用戶
  const getAuth = async (token: string | null) => {
    try {
      const res = await $fetch<GetResult<UserInfo>>(`/user/`, {
        method: "GET",
        baseURL,
        headers: {
          Authorization: token || "",
        },
        onResponseError({ response }) {
          token = null; // 清除 token
          console.error(response._data.message);
        },
      });

      if (!res.status) return;

      return res.result;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAuth,
    user,
    username,
  };
});

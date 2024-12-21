interface CheckAuth {
  status: boolean;
  token: string;
}

export default async function useGetUser() {
  const { sweetAlert } = useSweetAlert();

  const authStore = useAuthStore();
  const { getAuth } = authStore;
  const { user, username } = storeToRefs(authStore);

  const baseURL = process.env.BASE_URL;
  const token = useCookie("auth");

  if (token.value) {
    try {
      await $fetch<CheckAuth>("/user/check", {
        method: "GET",
        baseURL,
        headers: {
          Authorization: token.value,
        },
        onResponseError({ response }) {
          token.value = null; // 清除 token
          console.error(response._data.message);
        },
      });

      user.value = await getAuth(token.value);
    } catch (error: any) {
      sweetAlert("error", "驗證失敗", error.response._data.message);
      token.value = null; // 刪除 token
      navigateTo("/account/login", { redirectCode: 302 });
    }
  }

  // 取得簡易用戶名稱
  if (user.value?.name) {
    const splitName = user.value.name.split(" ");
    username.value = splitName[0];
  }

  return { user, username };
}

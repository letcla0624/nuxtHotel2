export default defineNuxtRouteMiddleware(async (to, from) => {
  // 避免使用 $fetch 重複渲染
  const { isHydrating, payload } = useNuxtApp();
  if (import.meta.client && isHydrating && payload.serverRendered) {
    return;
  }

  // 驗證 token 是否存在
  const baseURL = process.env.BASE_URL;
  const token = useCookie("auth");
  if (!token.value) return navigateTo("/account/login", { redirectCode: 302 });

  // 驗證 token 是否正確
  try {
    await $fetch("/user/check", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: token.value,
      },
    });
  } catch (error) {
    console.dir(error);
    token.value = null; // 刪除 token

    return navigateTo("/account/login", { redirectCode: 302 });
  }
});

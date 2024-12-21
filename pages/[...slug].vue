<script setup lang="ts">
definePageMeta({
  layout: "error-layout",
});

const route = useRoute();
const page = ref(route.fullPath);

const event = useRequestEvent();
setResponseStatus(event!, 404);
</script>

<template>
  <div class="not-found bg-neutral-120 text-white px-3">
    <h1 class="fw-bolder">404</h1>
    <h2>找不到頁面</h2>
    <p>抱歉，您所尋找的 {{ page }} 頁面不存在。</p>
    <!-- 返回首頁的連結 -->
    <NuxtLink
      to="/"
      class="btn btn-primary-100 px-8 py-4 text-white fw-bold border-0 rounded-3"
    >
      返回首頁
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  h1 {
    font-size: 6rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;
    opacity: 0.7;
  }
}
</style>

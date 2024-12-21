<script setup lang="ts">
// 取得用戶
const { user, username } = await useGetUser();
</script>

<template>
  <div>
    <AppHeader :user="user" :username="username" />
    <slot :user="user" :username="username" />
    <AppFooter />
  </div>
</template>

<style scoped></style>

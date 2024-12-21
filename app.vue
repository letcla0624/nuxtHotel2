<script setup lang="ts">
const nuxtApp = useNuxtApp();
const isLoading = ref(false);

nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});
nuxtApp.hook("page:finish", () => {
  isLoading.value = false;
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <ClientOnly>
        <Loading
          :active="isLoading"
          :is-full-page="true"
          loader="dots"
          color="Goldenrod"
          backgroundColor="#000"
        />
      </ClientOnly>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

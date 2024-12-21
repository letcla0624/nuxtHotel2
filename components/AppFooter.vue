<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <footer class="py-20 pb-md-30 bg-neutral-120">
    <div class="container">
      <div
        class="d-flex flex-column gap-10 gap-md-0 flex-md-row justify-content-md-between align-items-md-center mb-20"
      >
        <div>
          <img class="mb-10" src="~@/public/images/logo-white.svg" alt="logo" />
          <div class="d-flex align-items-center gap-4">
            <NuxtLink
              class="text-neutral-0 border rounded-circle footer-icon"
              to="/"
            >
              <Icon class="fs-6" icon="bi:line" />
            </NuxtLink>
            <NuxtLink
              class="text-neutral-0 border rounded-circle footer-icon"
              to="/"
            >
              <Icon class="fs-6" icon="mdi:instagram" />
            </NuxtLink>
          </div>
        </div>
        <div class="d-flex flex-column flex-md-row gap-4 gap-md-20">
          <address class="d-flex flex-column mb-0">
            <p class="mb-4 mb-md-10 fw-bold text-neutral-0">
              TEL
              <NuxtLink
                class="d-block mt-2 text-neutral-40 fs-8 fs-md-7 fw-normal text-decoration-none"
                to="tel:+886-7-1234567"
              >
                +886-7-1234567
              </NuxtLink>
            </p>

            <p class="mb-0 fw-bold text-neutral-0">
              FAX
              <NuxtLink
                class="d-block mt-2 text-neutral-40 fs-8 fs-md-7 fw-normal text-decoration-none"
                to="fax:+886-7-1234567"
              >
                +886-7-1234567
              </NuxtLink>
            </p>
          </address>
          <address class="d-flex flex-column mb-0">
            <p class="mb-4 mb-md-10 fw-bold text-neutral-0">
              MAIL
              <NuxtLink
                class="d-block mt-2 text-neutral-40 fs-8 fs-md-7 fw-normal text-decoration-none"
                to="mailto:elh@hexschool.com"
              >
                elh@hexschool.com
              </NuxtLink>
            </p>

            <p class="mb-0 fw-bold text-neutral-0">
              WEB
              <NuxtLink
                class="d-block mt-2 text-neutral-40 fs-8 fs-md-7 fw-normal text-decoration-none"
                to="https://www.elhhexschool.com.tw/"
                target="_blank"
              >
                www.elhhexschool.com.tw
              </NuxtLink>
            </p>
          </address>
        </div>
      </div>
      <div
        class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-4 gap-md-0 text-neutral-0 fs-8 fs-md-7"
      >
        <address class="mb-0">806023 台灣高雄市新興區六角路123號</address>
        <p class="mb-0">© 享樂酒店 2023 All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
}
</style>

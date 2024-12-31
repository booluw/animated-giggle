<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { ROUTES } from '@/utils/constants'

import IconsLogo from '@/components/icons/IconsLogo.vue'
import IconsLogout from '@/components/icons/IconsLogout.vue'

const route = useRoute()
</script>
<template>
  <section class="flex h-screen">
    <nav class="bg-black flex flex-col justify-between w-[296px] py-[55px] px-[41px]">
      <div class="flex flex-col gap-[75px]">
        <router-link to="/" title="Go back to Dashboard" class="flex items-center justify-center">
          <IconsLogo />
        </router-link>
        <ul class="">
          <li class="mb-[20px]" v-for="(link, key) in ROUTES" :key>
            <router-link
              :to="link.uri"
              class="rounded bg-transparent text-white opacity-50 flex gap-4 py-[10px] px-[24px] hover:opacity-85 transition-all ease-in-out"
              :class="{ 'bg-primary !opacity-100': route.fullPath === link.uri }"
            >
              <component :is="link.icon" class="w-[24px]" />
              {{ link.title }}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="">
        <a
          href="#logout"
          class="rounded bg-transparent text-white opacity-50 flex gap-4 py-[10px] px-[24px] hover:opacity-85 transition-all ease-in-out"
        >
          <IconsLogout class="w-[24px]" />
          Logout
        </a>
      </div>
    </nav>
    <section class="w-full">
      <RouterView />
    </section>
  </section>
</template>

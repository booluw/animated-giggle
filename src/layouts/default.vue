<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { ROUTES } from '@/utils/constants'

import IconsLogo from '@/components/icons/IconsLogo.vue'
import IconsLogout from '@/components/icons/IconsLogout.vue'
import IconsBell from '@/components/icons/IconsBell.vue';
import IconsProfile from '@/components/icons/IconsProfile.vue';

const route = useRoute()
</script>
<template>
  <section class="h-screen flex text-black overflow-hidden">
    <nav class="bg-black flex flex-col justify-between w-[296px] py-[55px] px-[40px]">
      <div class="flex flex-col gap-[75px]">
        <router-link to="/" title="Go back to Dashboard" class="flex items-center justify-center">
          <IconsLogo />
        </router-link>
        <ul class="">
          <li class="mb-[20px]" v-for="(link, key) in ROUTES" :key>
            <router-link
              :to="link.uri"
              class="rounded bg-transparent text-white opacity-50 flex gap-4 py-[10px] px-[24px] hover:opacity-85 transition-all ease-in-out"
              :class="{ '!bg-primary !opacity-100': route.path === link.uri }"
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
    <section class="relative w-full h-screen overflow-auto">
      <header class="sticky top-0 z-[2] border-b py-[13px] px-[30px] flex gap-[24px] items-center justify-end bg-white">
        <IconsBell class="w-[24px] opacity-60 hover:opacity-100 hover:text-primary cursor-pointer" />
        <div class="cursor-pointer flex gap-3 items-center">
          <div class="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#f5f5f5] opacity-70">
            <IconsProfile class="w-[24px]" />
          </div>
          Company name
        </div>
      </header>
      <section class="pt-[20px] px-[40px] overflow-auto">
        <RouterView />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import AppModal from './AppModal.vue'
import Btn from './Btn.vue'
import IconsPackageCircle from './icons/IconsPackageCircle.vue';
import IconsShippingCircl from './icons/IconsShippingCircl.vue'
import IconsToolsCircle from './icons/IconsToolsCircle.vue';
import { notify } from './Notification';

const emit = defineEmits(['close'])
const router = useRouter()

const selected = ref<'procurement' | 'service' | 'commodity'>()

const next = function () {
  if (selected.value === undefined) {
    notify({ title: 'Please select a transaction type', type: 'warning' })
    return
  }

  router.push({ name: 'transactions', params: { type: selected.value }})
}
</script>

<template>
  <AppModal @close="emit('close')">
    <div class="flex gap-8 flex-col items-center justify-center">
      <div class="w-2/3 my-0 mx-auto">
        <h1 class="text-center text-2xl font-[500]">
          Our products were made just for you, select an option below to get started.
        </h1>
      </div>
      <div class="grid gap-[20px] grid-cols-3 w-full text-center">
        <div
          class="border rounded px-4 py-5 flex gap-3 flex-col items-center justify-center w-full cursor-pointer hover:border-black"
          :class="{ 'border-black' : selected === 'commodity' }"
          @click="selected = 'commodity'"
        >
          <IconsShippingCircl />
          <div class="flex gap-2 flex-col items-center justify-center">
            <h3 class="font-bold text-[#140800]">Commodities</h3>
            <p class="text-[#A6A6A6]">
              Support to traders of essential commodities in the energy industry.
            </p>
          </div>
        </div>

        <div
          class="border rounded px-4 py-5 flex gap-3 flex-col items-center justify-center w-full cursor-pointer hover:border-black"
          :class="{ 'border-black' : selected === 'procurement' }"
          @click="selected = 'procurement'"
        >
          <IconsToolsCircle />
          <div class="flex gap-2 flex-col items-center justify-center">
            <h3 class="font-bold text-[#140800]">Procurement</h3>
            <p class="text-[#A6A6A6]">
              Supply of equipments with funding and execution capacity.
            </p>
          </div>
        </div>

        <div
          class="border rounded px-4 py-5 flex gap-3 flex-col items-center justify-center w-full cursor-pointer hover:border-black"
          :class="{ 'border-black' : selected === 'service' }"
          @click="selected = 'service'"
        >
          <IconsPackageCircle />
          <div class="flex gap-2 flex-col items-center justify-center">
            <h3 class="font-bold text-[#140800]">Services</h3>
            <p class="text-[#A6A6A6]">
              Support operation, installation and maintenance contracts.
            </p>
          </div>
        </div>
      </div>
      <Btn size="large" type="primary" :disabled="selected === undefined" @click="next()">Next</Btn>
    </div>
  </AppModal>
</template>

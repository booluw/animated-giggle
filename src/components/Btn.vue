<script lang="ts" setup>
import type { Btn } from '@/types/components'
import { computed } from 'vue';

const { type, size, icon } = withDefaults(defineProps<Btn>(), {
  type: 'primary',
  size: 'large',
})

const style = computed(() => {
  let style: string;

  switch (type) {
    case 'primary':
      style = 'bg-primary text-white'
      break;

    default:
      style = 'text-black/60 bg-transparent'
      break;
  }

  switch (size) {
    case 'large':
      style += ' py-[13px] px-[16px]'
      break;

    default:
      style += ' text-[12px] py-[5px] px-[8px]'
      break;
  }

  return style
})
</script>
<template>
  <button
    class="flex items-center gap-[4px] rounded"
    :class="style"
  >
    <component :is="icon" v-if="icon" class="w-[12px]" />
    <slot />
  </button>
</template>

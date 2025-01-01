<script lang="ts" setup>
import IconsClose from './icons/IconsClose.vue';

const emit = defineEmits(['close'])

</script>
<template>
  <section class="bg-black/25 backdrop-blur-md flex items-center justify-center fixed top-0 right-0 left-0 bottom-0">
    <div class="bg-white w-[840px] h-[500px] rounded-[14px] px-[36px] py-[32px]">
      <div class="flex items-center justify-end">
        <IconsClose class="cursor-pointer" @click="emit('close')" />
      </div>
      <slot />
    </div>
  </section>
</template>

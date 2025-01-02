<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import type { Notification } from '@/types/components'
import IconsClose from '../icons/IconsClose.vue'

const { title, message, type, action, actionText } = defineProps<Notification>()

const show = ref(true)
let timeout = null

const close = function () {
  show.value = false
  clearTimeout(timeout!)
}

const callAction = function () {
  if (action) action()
  close()
}

onMounted(() => {
  timeout = setTimeout(close, 10000)
})
</script>
<template>
  <Transition :duration="300" name="nested">
    <div
      v-if="show"
      class="outer w-fit -translate-x-[50%] fixed top-0 left-[50%] p-5 flex items-center justify-center z-[99]"
    >
      <div
        class="inner w-[290px] p-3 flex gap-5 items-center justify-between rounded bg-white border-b-2 shadow"
        :class="
          type === 'success'
            ? '!border-green-500'
            : type === 'error'
              ? '!border-red-500'
              : 'border-orange-400'
        "
      >
        <div class="flex flex-col text-[10px]">
          <h2
            class="font-bold text-[12px] capitalize"
            :class="
              type === 'success'
                ? 'text-green-500'
                : type === 'error'
                  ? 'text-red-600'
                  : 'text-orange-700'
            "
          >
            {{ title }}
          </h2>
          <p class="">{{ message }}</p>
        </div>
        <button v-if="action" class="text-[14px] line-clamp-1 text-primary" @click="callAction()">
          {{ actionText || 'Action' }}
        </button>
        <IconsClose v-else class="cursor-pointer opacity-50" @click="close()" />
      </div>
    </div>
  </Transition>
</template>

<style>
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* we can also transition nested elements using nested selectors */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

/* delay enter of nested element */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateY(-30px);
  opacity: 0.001;
}
</style>

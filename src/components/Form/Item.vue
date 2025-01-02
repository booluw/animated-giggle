<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { ref, inject, onMounted, onBeforeUnmount, watch } from 'vue'
import type { FormItem } from './interface'

const { prop } = defineProps<FormItem>()

const input = ref(null) as any
const model = inject('model') as any
const rules = inject('rules') as any
const required = inject('required') as boolean
const showErr = ref(false)

const show = function (inputEl: any) {
  showErr.value =
    prop !== undefined ? (rules[prop] ? !rules[prop]?.valid(model[prop]) : false) : false

  if (!showErr.value) {
    inputEl.classList.add('opacity-0')
    inputEl.classList.remove('opacity-100')
  } else {
    inputEl.classList.remove('opacity-0')
    inputEl.classList.add('opacity-100')
  }
}

const validateItem = function () {
  const inputEl = input.value!.querySelector('[data-el]')
  const inputErr = input.value!.querySelector('[data-error]')

  if (inputEl === null) return
  inputEl.querySelector('[data-input]').addEventListener('focus', () => {
    if (inputEl !== null) show(inputErr)
  })
}

onMounted(() => {
  validateItem()
})

onBeforeUnmount(() => {
  const inputEl = input.value!.querySelector('[data-el]')

  if (inputEl) {
    inputEl.querySelector('[data-input]').removeEventListener('focus', () => {})
    showErr.value =
      prop !== undefined ? (rules[prop] ? !rules[prop]?.valid(model[prop]) : false) : false
  }
})

watch(
  model,
  () => {
    const inputEl = input.value!.querySelector('[data-el]')
    const inputErr = input.value!.querySelector('[data-error]')
    if (inputEl !== null) show(inputErr)
  },
  { deep: true },
)
</script>
<template>
  <div class="flex flex-col" ref="input" :data-prop="prop">
    <slot />
    <p :class="{ 'opacity-0': !showErr }" class="text-xs text-danger text-red-500" data-error>
      {{ prop !== undefined ? (rules[prop]?.message || required ? `required` : false) : false }}
    </p>
  </div>
</template>

<style>
.error {
  border-bottom: 1px solid #f16588af !important;
}
</style>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { ref, provide, computed } from 'vue'
import type { Form } from './interface'

const { model, rules, required } = defineProps<Form>()
const emit = defineEmits(['submit'])
const form = ref(null) as any

provide('model', model)
provide('rules', rules)
provide('required', required)

const validation = computed(() => {
  const validator: string[] = []
  if (rules === undefined) return []
  if (required) {
    Object.keys(model).forEach((item) => {
      const valid = model[item] === null || model[item] === undefined || model[item] === ''

      if (valid) {
        if (form.value.querySelectorAll(`[data-prop=${item}]`).length !== 0) {
          validator.push(item)
        }
      }
    })
    return validator
  }

  Object.keys(model).forEach((item) => {
    const valid = rules[item] !== undefined ? !rules[item].valid(model[item]) : false
    if (valid) {
      if (form.value.querySelectorAll(`[data-prop=${item}]`).length !== 0) {
        validator.push(item)
      }
      return
    }
  })

  return validator
})

const showErrors = function () {
  const errorInputs = Array.from(form.value.querySelectorAll('[data-prop]')).filter((el: any) =>
    validation.value.includes(el.dataset.prop),
  )

  if (validation.value.length === 0) {
    errorInputs.forEach((element: any) => {
      element.querySelector('[data-error]').classList.remove('opacity-100')
      element.querySelector('[data-error]').classList.add('opacity-0')
    })
  } else {
    errorInputs.forEach((element: any) => {
      element.querySelector('[data-error]').classList.remove('opacity-0')
    })
  }
}

const handleFormSubmit = function () {
  showErrors()
  emit('submit', validation.value.length === 0)
}
</script>

<template>
  <form @submit.prevent="handleFormSubmit" ref="form" class="overflow-auto">
    <slot />
  </form>
</template>

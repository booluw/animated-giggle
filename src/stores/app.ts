import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Summary } from '@/types/services'

export const useAppStore = defineStore('app', () => {
  const _summary = ref<Summary>()

  const setSummary = function (payload: Summary) {
    _summary.value = payload
  }

  return { _summary, setSummary }
})

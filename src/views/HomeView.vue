<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { useAppStore } from '@/stores/app'

import { fetchSummary } from '@/services/dashboard'
import { formatMoney, formatNumber, getRandomColor } from '@/utils/functions'

import Btn from '@/components/Btn.vue'
import IconsAdd from '@/components/icons/IconsAdd.vue'
import IconsTransactionFilled from '@/components/icons/IconsTransactionFilled.vue'
import IconsMoneyBag from '@/components/icons/IconsMoneyBag.vue'
import IconsDollarBag from '@/components/icons/IconsDollarBag.vue'
import IconsGivingHand from '@/components/icons/IconsGivingHand.vue'
import IconsPiggybank from '@/components/icons/IconsPiggybank.vue'
import IconsTimer from '@/components/icons/IconsTimer.vue'
import Loader from '@/components/Loader.vue'
import NewTransactionModal from '@/components/NewTransactionModal.vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useAppStore()
const loading = ref(false)
const transactionModal = ref(false)

const summary = computed(() => store._summary)

const getSummary = async function () {
  if (store._summary === undefined) loading.value = true

  try {
    store.setSummary((await fetchSummary()).data)
  } catch (err: unknown) {
    console.log(err)
  }

  loading.value = false
}

onMounted(async () => {
  await getSummary()
})
</script>
<template>
  <div v-if="loading" class="h-screen flex items-center justify-center">
    <div class="flex gap-3 flex-col items-center justify-center">
      <Loader />
      <p class="opacity-75 animate-pulse">Loading dashboard, please wait...</p>
    </div>
  </div>
  <main v-else class="w-full flex flex-col gap-[20px]">
    <div class="flex items-center justify-between">
      <h1 class="text-[32px] font-bold">Dashboard</h1>
      <Btn size="default" :icon="IconsAdd" @click="transactionModal = !transactionModal"> New Transaction </Btn>
    </div>

    <div class="flex gap-[30px]">
      <div
        class="rounded-[18px] bg-gradient-to-b from-[#140800] to-[#7A3100] p-[20px] w-[280px] flex flex-col gap-[19px]"
      >
        <h2 class="text-white font-semibold">Top OEMs/Suppliers</h2>
        <div class="flex flex-col gap-3">
          <div
            class="bg-white text-[#665E59] rounded-full flex flex-wrap items-center justify-between py-[8px] px-[12px] text-[12px]"
            v-for="(soc, key) in summary?.soc_summary"
            :key
          >
            {{ soc.name }}
            <span class="text-primary">
              {{ formatMoney(soc.value_usd) }}
            </span>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="grid grid-cols-3 gap-[20px]">
          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsTransactionFilled />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Total Transaction</h3>
              {{ summary?.total_transaction }}
            </div>
          </div>

          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsMoneyBag />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Transactions value</h3>
              ${{ formatNumber(summary?.transaction_value) }}
            </div>
          </div>

          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsDollarBag />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Transactions costs</h3>
              ${{ formatNumber(summary?.transaction_cost) }}
            </div>
          </div>

          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsGivingHand />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Disburstments</h3>
              ${{ formatNumber(summary?.total_disbursement) }}
            </div>
          </div>

          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsPiggybank />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Gross profitability</h3>
              ${{ formatNumber(summary?.gross_profitability) }}
            </div>
          </div>

          <div
            class="rounded-[18px] border-[7px] border-light-grey p-[20px] flex gap-[20px] items-start"
          >
            <div
              class="rounded-full p-[15px] bg-light-grey flex items-center justify-center text-primary"
            >
              <IconsTimer />
            </div>
            <div class="text-2xl font-[500]">
              <h3 class="text-xs font-normal text-[#665E59]">Avg. Execution time</h3>
              {{ Number(summary?.avg_execution_time).toFixed(0) }} days
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-[30px] pb-5">
      <div class="w-[354px] rounded-[8px] border py-[20px] px-[24px]">
        <h3 class="font-[500]">Transaction by product</h3>
        <Doughnut
          :options="{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }"
          :data="{
            labels: summary?.transaction_type_summary.map((soc) => soc.transaction_type),
            datasets: [
              {
                backgroundColor: ['#CC5500', '#007ACC', '#4D3626'],
                data: summary?.transaction_type_summary.map((soc) => Number(soc.count)),
              },
            ],
          }"
        />
      </div>
      <div class="w-full">
        <h3 class="font-[500] mb-1">Transaction by awarding companies</h3>
        <div class="border rounded p-2 flex flex-wrap gap-4">
          <div
            class="w-auto text-white px-[28px] py-[20px] min-h-44"
            :class="{ '!w-[400px]': key === 0 }"
            :style="`background-color: ${getRandomColor()}!important;`"
            v-for="(company, key) in summary?.awarding_company_summary"
            :key
          >
            {{ company.awarding_company }}
          </div>
        </div>
      </div>
    </div>

    <NewTransactionModal v-if="transactionModal" @close="transactionModal = !transactionModal" />
  </main>
</template>

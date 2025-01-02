<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { addNewTransaction, fetchAwardingCompanies } from '@/services/transactions'
import {
  BASIS_OF_SELECTION,
  COUNTRIES,
  CURRENCY,
  INCOTERMS,
  PAYMENT_TERMS,
  PROCUREMENT_TYPE,
  SUPPLIER_PAYMENT_TERMS,
} from '@/utils/constants'
import { notify } from '@/components/Notification'

import IconsBack from '@/components/icons/IconsBack.vue'
import Form from '@/components/Form/Index.vue'
import FormItem from '@/components/Form/Item.vue'
import IconsUpload from '@/components/icons/IconsUpload.vue'
import IconsClose from '@/components/icons/IconsClose.vue'
import IconsInfo from '@/components/icons/IconsInfo.vue'
import Btn from '@/components/Btn.vue'
import IconsCheck from '@/components/icons/IconsCheck.vue'

const route = useRoute()
const router = useRouter()

const tab = ref<'supplier' | 'company'>('company')
const loading = ref(false)
const submitting = ref(false)
const awardingCompanies = ref()

const transaction = ref({
  transaction_type: 'procurement',
  awarding_company_id: null,
  previous_transaction: 1,
  estimated_value: '',
  estimated_value_currency: 'usd',
  awarding_payment_terms: '',
  incoterms: '',
  duration: 0,
  payment_after_invoice: 0,
  purchase_order: null as File | null,
  previous_invoice: [] as File[],
  bank_statement: [] as File[],
  supplier_oem_subcontractors: {
    soc_name: '',
    country: '',
    continent: '',
    basis_of_selection: '',
    incoterms: '',
    previous_purchase: 1,
    delivery_time: '',
    procurement_type: '',
    payment_terms: '',
    item_cost_currency: 'usd',
    item_cost: 0,
    logistics_cost_currency: 'usd',
    logistics_cost: 0,
    other_cost_currency: 'usd',
    other_cost: 0,
    funding_request_currency: 'usd',
    funding_request: 0,
  },
  soc_name: null as string | null,
  invoice: null as File | null,
})

const filteredCountries = computed(() => {
  if (transaction.value.supplier_oem_subcontractors.continent !== '') {
    return COUNTRIES.filter(
      (country) => country.continent === transaction.value.supplier_oem_subcontractors.continent,
    )
  }

  return COUNTRIES
})

const updateFile = function (attr: unknown, file: File, index?: number) {
  if (file.size / 1048576 > 2) {
    notify({
      title: 'File should be less than 2MB',
      type: 'warning',
    })
    return
  }

  if (attr === 'purchase_order' || attr === 'invoice') {
    transaction.value[attr] = file
    return
  }

  transaction.value[attr!][index] = file
}

const removeFile = function (attr: string, index: number) {
  transaction.value[attr].splice(index, 1)
}

const getAwardingCompanies = async function () {
  loading.value = true

  try {
    awardingCompanies.value = (await fetchAwardingCompanies()).data
  } catch (err: unknown) {
    notify({
      title: 'An error occurred',
      type: 'error',
    })

    console.log(err)
  }

  loading.value = false
}

const submitForm = async function (valid: boolean) {
  if (valid) {
    if (tab.value === 'company') {
      tab.value = 'supplier'
      return
    }

    submitting.value = true
    // transform to formdata and send to API
    const payload = new FormData()

    Object.keys(transaction.value).forEach((key) => {
      const value = transaction.value[key as keyof typeof transaction.value] 
      if (typeof value !== 'object') {
        // Handles normal entries
        payload.append(key, value as any)
      }

      if (Array.isArray(value)) {
        // Handles array of files; previous invoice and bank statement
        value.forEach((item) => {
          payload.append(key, item)
        })
      }
    })

    // Handles other values
    payload.append('purchase_order', transaction.value.purchase_order as any)
    payload.append('supplier_oem_subcontractors', JSON.stringify(transaction.value.supplier_oem_subcontractors) as any)
    payload.append('supplier_oem_subcontractors', JSON.stringify(transaction.value.supplier_oem_subcontractors) as any)
    payload.append(transaction.value.supplier_oem_subcontractors.soc_name, transaction.value.invoice as any)

    try {
      const response = await addNewTransaction(payload)

      if (response.statusCode !== 200) {
        throw response
      }

      notify({
        title: 'New transaction added',
        type: 'success'
      })

      router.push({ name: 'home' })
    } catch (err: unknown) {
      console.log(err)
      notify({
        title: 'An error occurred',
        type: 'error'
      })

      return
    }
    return
  }

  notify({
    title: 'Please complete the form details',
    type: 'warning',
  })
}

onMounted(() => getAwardingCompanies())
</script>
<template>
  <main class="">
    <div class="">
      <button
        class="text-primary flex gap-2 items-center text-sm cursor-pointer"
        @click="router.go(-1)"
      >
        <IconsBack />
        BACK
      </button>
    </div>
    <h1 class="capitalize font-bold text-[32px] my-[30px]">
      New {{ route.query.type }} transaction
    </h1>

    <div class="rounded-[16px] overflow-hidden shadow pb-[20px] mb-[20px]">
      <div class="bg-[#EFEFEF] w-full grid grid-cols-2">
        <div
          :class="tab === 'company' ? 'border-primary !opacity-100' : '!opacity-100'"
          class="opacity-45 px-14 py-4 border-b-2 flex gap-3 items-center"
        >
          <div
            class="bg-white border-2 border-black rounded-full p-2 text-white"
            :class="{ '!bg-primary border-primary': tab === 'supplier' }"
          >
            <IconsCheck v-if="tab === 'supplier'" />
          </div>
          Awarding Company
        </div>
        <div
          :class="{ 'border-primary !opacity-100': tab === 'supplier' }"
          class="opacity-45 px-14 py-4 border-b-2 flex gap-3 items-center"
        >
          <div
            class="bg-white border-2 border-black rounded-full p-2 text-white"
            :class="{ '!text-black': tab === 'supplier' }"
          />
          Suppliers
        </div>
      </div>
      <template v-if="tab === 'company'">
        <Form :model="transaction" :rules="{}" required class="p-[20px]" @submit="submitForm">
          <div class="grid grid-cols-2 gap-3">
            <FormItem prop="awarding_company_id">
              <div class="flex gap-1 flex-col" data-el>
                <label class="text-xs text-grey-500">Awarding Company</label>
                <select
                  v-model="transaction.awarding_company_id"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                  :disabled="loading"
                >
                  <option default selected disabled>Select awarding company</option>
                  <option :value="companies.id" v-for="(companies, key) in awardingCompanies" :key>
                    {{ companies.name }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="previous_transaction">
              <div class="flex gap-1 flex-col" data-el>
                <label for="previous_transaction" class="text-xs text-grey-500"
                  >No. of previous contracts</label
                >
                <select
                  id="previous_transaction"
                  v-model="transaction.previous_transaction"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="i in 20" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="estimated_value">
              <div class="flex gap-1 flex-col" data-el>
                <label for="estimated_value" class="text-xs text-grey-500">Value of contract</label>
                <div class="flex gap-2">
                  <select
                    class="outline-none border rounded p-1 text-[#374151]"
                    id=""
                    v-model="transaction.estimated_value_currency"
                  >
                    <option v-for="(curr, key) in CURRENCY" :key :value="curr.value">
                      {{ curr.label }}
                    </option>
                  </select>
                  <input
                    id="estimated_value"
                    v-model="transaction.estimated_value"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
            <FormItem prop="awarding_payment_terms">
              <div class="flex gap-1 flex-col" data-el>
                <label for="awarding_payment_terms" class="text-xs text-grey-500"
                  >Payment Terms</label
                >
                <select
                  id="awarding_payment_terms"
                  v-model="transaction.awarding_payment_terms"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="(payment, key) in PAYMENT_TERMS" :key :value="payment.value">
                    {{ payment.label }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="incoterms">
              <div class="flex gap-1 flex-col" data-el>
                <label for="incoterms" class="text-xs text-grey-500">Incoterms</label>
                <select
                  id="incoterms"
                  v-model="transaction.incoterms"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="(incoterm, key) in INCOTERMS" :key :value="incoterm.label">
                    {{ incoterm.label }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="duration">
              <div class="flex gap-1 flex-col" data-el>
                <label for="duration" class="text-xs text-grey-500">Execution Time (days)</label>
                <div class="flex gap-2">
                  <input
                    id="duration"
                    v-model="transaction.duration"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
            <FormItem prop="payment_after_invoice">
              <div class="flex gap-1 flex-col" data-el>
                <label for="payment_after_invoice" class="text-xs text-grey-500"
                  >Payment after Invoice (days)</label
                >
                <div class="flex gap-2">
                  <input
                    id="payment_after_invoice"
                    v-model="transaction.payment_after_invoice"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
          </div>
          <div class="flex gap-4 flex-col items-start mt-5">
            <FormItem prop="purchase_order">
              <div class="inline-flex gap-1 flex-col items-start" data-el>
                <label class="text-xs text-grey-500"
                  >Purchase Order<span class="text-primary">*</span></label
                >
                <label
                  for="po"
                  class="inline-flex gap-2 border p-3 rounded cursor-pointer"
                  data-input
                >
                  <IconsUpload />
                  Upload File
                </label>
                <div v-if="transaction.purchase_order !== null" class="inline-flex items-start">
                  <span class="text-primary text-sm">
                    {{ transaction.purchase_order.name }}
                  </span>
                  <IconsClose
                    class="text-primary w-[16px] cursor-pointer"
                    @click="transaction.purchase_order = null"
                  />
                </div>
                <span class="text-xs text-gray-400">
                  Max file size <span class="text-black">2MB</span> (pdf, docx, pptx, xlsx)
                </span>
                <input
                  type="file"
                  id="po"
                  class="hidden"
                  accept=".pdf, .docx, .xlsx"
                  v-on:change="(e) => updateFile('purchase_order', (e.target! as any).files[0])"
                />
              </div>
            </FormItem>

            <div class="">
              <div class="flex gap-1">
                <p class="text-xs text-grey-500">Previous Contracts Information</p>
                <IconsInfo />
              </div>
              <div class="flex gap-4 mt-2" v-for="i in transaction.previous_transaction" :key="i">
                <FormItem prop="previous_invoice">
                  <label :for="`pi${i}`" class="text-xs font-[500] mb-1">
                    Previous Invoice ({{ i }})
                    <span class="text-primary">*</span>
                  </label>
                  <div class="inline-flex gap-1 flex-col items-start" data-el>
                    <label
                      :for="`pi${i}`"
                      class="inline-flex gap-2 border p-3 rounded cursor-pointer"
                      data-input
                    >
                      <IconsUpload />
                      Upload File
                    </label>
                    <div v-if="transaction.previous_invoice[i - 1]" class="inline-flex items-start">
                      <span class="text-primary text-sm">
                        {{ transaction.previous_invoice[i - 1].name }}
                      </span>
                      <IconsClose
                        class="text-primary w-[16px] cursor-pointer"
                        @click="removeFile('previous_invoice', i - 1)"
                      />
                    </div>
                    <span class="text-xs text-gray-400">
                      Max file size <span class="text-black">2MB</span> (pdf, docx, pptx, xlsx)
                    </span>
                    <input
                      type="file"
                      :id="`pi${i}`"
                      class="hidden"
                      accept=".pdf, .docx, .xlsx"
                      v-on:change="
                        (e) => updateFile('previous_invoice', (e.target! as any).files[0], i - 1)
                      "
                    />
                  </div>
                </FormItem>

                <FormItem prop="bank_statement">
                  <label :for="`bs-${i}`" class="text-xs font-[500] mb-1">
                    Bank Statement ({{ i }})
                    <span class="text-primary">*</span>
                  </label>
                  <div class="inline-flex gap-1 flex-col items-start" data-el>
                    <label
                      :for="`bs-${i}`"
                      class="inline-flex gap-2 border p-3 rounded cursor-pointer"
                      data-input
                    >
                      <IconsUpload />
                      Upload File
                    </label>
                    <div v-if="transaction.bank_statement[i - 1]" class="inline-flex items-start">
                      <span class="text-primary text-sm">
                        {{ transaction.bank_statement[i - 1].name }}
                      </span>
                      <IconsClose
                        class="text-primary w-[16px] cursor-pointer"
                        @click="removeFile('bank_statement', i - 1)"
                      />
                    </div>
                    <span class="text-xs text-gray-400">
                      Max file size <span class="text-black">2MB</span> (pdf, docx, pptx, xlsx)
                    </span>
                    <input
                      type="file"
                      :id="`bs-${i}`"
                      class="hidden"
                      accept=".pdf, .docx, .xlsx"
                      v-on:change="
                        (e) => updateFile('bank_statement', (e.target! as any).files[0], i - 1)
                      "
                    />
                  </div>
                </FormItem>
              </div>
            </div>
          </div>

          <div class="w-full mt-7 flex gap-4 justify-center">
            <button type="button" class="text-black/60 bg-transparent py-[13px] px-[16px]">
              Save
            </button>
            <Btn type="primary" size="large">Next</Btn>
          </div>
        </Form>
      </template>
      <template v-else>
        <Form
          :model="transaction.supplier_oem_subcontractors"
          :rules="{}"
          required
          class="p-[20px]"
          @submit="submitForm"
        >
          <div class="grid grid-cols-2 gap-3">
            <FormItem prop="soc_name">
              <div class="flex gap-1 flex-col" data-el>
                <label class="text-xs text-grey-500">Name of Supplier [1]</label>
                <input
                  placeholder="Eg. Total Energies"
                  v-model="transaction.supplier_oem_subcontractors.soc_name"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                />
              </div>
            </FormItem>
            <FormItem prop="previous_purchase">
              <div class="flex gap-1 flex-col" data-el>
                <label for="previous_purchase" class="text-xs text-grey-500"
                  >No. of previous purchases</label
                >
                <select
                  id="previous_purchase"
                  v-model="transaction.supplier_oem_subcontractors.previous_purchase"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="i in 20" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="payment_terms">
              <div class="flex gap-1 flex-col" data-el>
                <label for="payment_terms" class="text-xs text-grey-500">Payment Terms</label>
                <select
                  id="payment_terms"
                  v-model="transaction.supplier_oem_subcontractors.payment_terms"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option
                    v-for="(payment, key) in SUPPLIER_PAYMENT_TERMS"
                    :key
                    :value="payment.value"
                  >
                    {{ payment.label }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="basis_of_selection">
              <div class="flex gap-1 flex-col" data-el>
                <label for="basis_of_selection" class="text-xs text-grey-500"
                  >Basis of selection of supplier (Choice)</label
                >
                <select
                  id="basis_of_selection"
                  v-model="transaction.supplier_oem_subcontractors.basis_of_selection"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="(basis, key) in BASIS_OF_SELECTION" :key :value="basis">
                    {{ basis }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="country">
              <div class="flex gap-1 flex-col" data-el>
                <label for="country" class="text-xs text-grey-500">Country</label>
                <select
                  id="country"
                  v-model="transaction.supplier_oem_subcontractors.country"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="(country, key) in filteredCountries" :key :value="country.country">
                    {{ country.country }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="continent">
              <div class="flex gap-1 flex-col" data-el>
                <label for="continent" class="text-xs text-grey-500">Continent</label>
                <select
                  id="continent"
                  v-model="transaction.supplier_oem_subcontractors.continent"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option
                    v-for="(continent, key) in new Set(COUNTRIES.map((item) => item.continent))"
                    :key
                    :value="continent"
                  >
                    {{ continent }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="incoterms">
              <div class="flex gap-1 flex-col" data-el>
                <label for="incoterms" class="text-xs text-grey-500">Supplier's Incoterms</label>
                <select
                  id="incoterms"
                  v-model="transaction.supplier_oem_subcontractors.incoterms"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="(incoterm, key) in INCOTERMS" :key :value="incoterm.label">
                    {{ incoterm.label }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="procurement_type">
              <div class="flex gap-1 flex-col" data-el>
                <label for="procurement_type" class="text-xs text-grey-500">Procurement Type</label>
                <select
                  id="procurement_type"
                  v-model="transaction.supplier_oem_subcontractors.procurement_type"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option
                    v-for="(procurement, key) in PROCUREMENT_TYPE"
                    :key
                    :value="procurement.value"
                  >
                    {{ procurement.label }}
                  </option>
                </select>
              </div>
            </FormItem>
            <FormItem prop="delivery_time">
              <div class="flex gap-1 flex-col" data-el>
                <label for="delivery_time" class="text-xs text-grey-500">Delivery Time</label>
                <select
                  id="delivery_time"
                  v-model="transaction.supplier_oem_subcontractors.delivery_time"
                  class="outline-none border rounded p-1 text-[#374151]"
                  data-input
                >
                  <option v-for="i in 20" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
            </FormItem>
          </div>
          <h2 class="my-4 text-grey-500/50 text-2xl">Cost</h2>
          <div class="grid grid-cols-2 gap-3">
            <FormItem prop="item_cost">
              <div class="flex gap-1 flex-col" data-el>
                <label for="item_cost" class="text-xs text-grey-500">Cost of items</label>
                <div class="flex gap-2">
                  <select
                    class="outline-none border rounded p-1 text-[#374151]"
                    id=""
                    v-model="transaction.supplier_oem_subcontractors.item_cost_currency"
                  >
                    <option v-for="(curr, key) in CURRENCY" :key :value="curr.value">
                      {{ curr.label }}
                    </option>
                  </select>
                  <input
                    id="item_cost"
                    v-model="transaction.supplier_oem_subcontractors.item_cost"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
            <FormItem prop="logistics_cost">
              <div class="flex gap-1 flex-col" data-el>
                <label for="logistics_cost" class="text-xs text-grey-500">Logistics cost</label>
                <div class="flex gap-2">
                  <select
                    class="outline-none border rounded p-1 text-[#374151]"
                    id=""
                    v-model="transaction.supplier_oem_subcontractors.logistics_cost_currency"
                  >
                    <option v-for="(curr, key) in CURRENCY" :key :value="curr.value">
                      {{ curr.label }}
                    </option>
                  </select>
                  <input
                    id="logistics_cost"
                    v-model="transaction.supplier_oem_subcontractors.logistics_cost"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
            <FormItem prop="other_cost">
              <div class="flex gap-1 flex-col" data-el>
                <label for="other_cost" class="text-xs text-grey-500">Others</label>
                <div class="flex gap-2">
                  <select
                    class="outline-none border rounded p-1 text-[#374151]"
                    id=""
                    v-model="transaction.supplier_oem_subcontractors.other_cost_currency"
                  >
                    <option v-for="(curr, key) in CURRENCY" :key :value="curr.value">
                      {{ curr.label }}
                    </option>
                  </select>
                  <input
                    id="other_cost"
                    v-model="transaction.supplier_oem_subcontractors.other_cost"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
            <FormItem prop="funding_request">
              <div class="flex gap-1 flex-col" data-el>
                <label for="funding_request" class="text-xs text-grey-500">Funding Request</label>
                <div class="flex gap-2">
                  <select
                    class="outline-none border rounded p-1 text-[#374151]"
                    id=""
                    v-model="transaction.supplier_oem_subcontractors.funding_request_currency"
                  >
                    <option v-for="(curr, key) in CURRENCY" :key :value="curr.value">
                      {{ curr.label }}
                    </option>
                  </select>
                  <input
                    id="funding_request"
                    v-model="transaction.supplier_oem_subcontractors.funding_request"
                    class="outline-none border rounded p-1 text-[#374151] w-full"
                    data-input
                  />
                </div>
              </div>
            </FormItem>
          </div>

          <div class="flex gap-4 flex-col items-start mt-5">
            <FormItem prop="invoice">
              <div class="inline-flex gap-1 flex-col items-start" data-el>
                <label class="text-xs text-grey-500">Pro-Forma Invoice</label>
                <label
                  for="po"
                  class="inline-flex gap-2 border p-3 rounded cursor-pointer"
                  data-input
                >
                  <IconsUpload />
                  Upload File
                </label>
                <div v-if="transaction.invoice !== null" class="inline-flex items-start">
                  <span class="text-primary text-sm">
                    {{ transaction.invoice.name }}
                  </span>
                  <IconsClose
                    class="text-primary w-[16px] cursor-pointer"
                    @click="transaction.invoice = null"
                  />
                </div>
                <span class="text-xs text-gray-400">
                  Max file size <span class="text-black">2MB</span> (pdf, docx, pptx, xlsx)
                </span>
                <input
                  type="file"
                  id="po"
                  class="hidden"
                  accept=".pdf, .docx, .xlsx"
                  v-on:change="(e) => updateFile('invoice', (e.target! as any).files[0])"
                />
              </div>
            </FormItem>
          </div>

          <div class="w-full mt-7 flex gap-4 justify-center">
            <button type="button" class="text-black/60 bg-transparent py-[13px] px-[16px]">
              Save
            </button>
            <Btn type="primary" size="large">Next</Btn>
          </div>
        </Form>
      </template>
    </div>
    <div />
  </main>
</template>

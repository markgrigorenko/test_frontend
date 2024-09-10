<template>
  <div class="flex justify-center m-5">
    <div
      v-if="!loading"
      class="bg-slate-700 p-4 rounded-xl w-full lg:w-7/12 flex justify-center"
    >
      <div class="mb-4">
        <CurrencyInput
          :currencies="currencies"
          :modelValue="Number(amount1)"
          :selectedCurrency="selectedCurrency1"
          @update:modelValue="onAmountChange('amount1', $event)"
          @update:selectedCurrency="
            onCurrencyChange('selectedCurrency1', $event)
          "
        />
        <CurrencyInput
          :currencies="currencies"
          :modelValue="Number(amount2)"
          :selectedCurrency="selectedCurrency2"
          @update:modelValue="onAmountChange('amount2', $event)"
          @update:selectedCurrency="
            onCurrencyChange('selectedCurrency2', $event)
          "
        />
      </div>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import CurrencyInput from '@/components/CurrencyInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { fetchCurrencyRates } from '@/api/currencyService'

export default {
  components: {
    CurrencyInput,
    LoadingSpinner,
  },
  data() {
    return {
      currencies: [
        { code: 'USD', name: 'US Dollar', rate: 0 },
        { code: 'EUR', name: 'Euro', rate: 0 },
        { code: 'RUB', name: 'Russian Ruble', rate: 0 },
      ],
      selectedCurrency1: 'USD',
      selectedCurrency2: 'EUR',
      amount1: 0,
      amount2: 0,
      loading: true,
      lastChanged: 'amount1',
    }
  },
  methods: {
    async updateCurrencies() {
      try {
        const data = await fetchCurrencyRates('USD')
        this.currencies.forEach((currency) => {
          if (data.rates[currency.code]) {
            currency.rate = data.rates[currency.code]
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    convertAmount() {
      const currency1 = this.currencies.find(
        (c) => c.code === this.selectedCurrency1
      )
      const currency2 = this.currencies.find(
        (c) => c.code === this.selectedCurrency2
      )

      if (this.lastChanged === 'amount1') {
        this.amount2 = (this.amount1 / currency1.rate) * currency2.rate
      } else if (this.lastChanged === 'amount2') {
        this.amount1 = (this.amount2 / currency2.rate) * currency1.rate
      }

      // Limit the number of decimal places to two
      if (
        this.amount1.toString().split('.')[1]?.length > 2 &&
        this.amount1.toString().split('.')[1]?.length !== 0
      ) {
        this.amount1 = Number(this.amount1.toFixed(2))
      }
      if (
        this.amount2.toString().split('.')[1]?.length > 2 &&
        this.amount2.toString().split('.')[1]?.length !== 0
      ) {
        this.amount2 = Number(this.amount2.toFixed(2))
      }
    },
    onAmountChange(amountName, value) {
      this[amountName] = Number(value)
      this.lastChanged = amountName
      this.convertAmount()
    },
    onCurrencyChange(currencyName, value) {
      this[currencyName] = value
      this.convertAmount()
    },
  },
  mounted() {
    this.updateCurrencies()
  },
}
</script>

<style scoped></style>

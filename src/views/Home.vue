<template>
  <div>
    <div v-if="!loading" class="m-5">
      <div
        class="stats stats-vertical lg:stats-horizontal shadow bg-slate-700 rounded-xl w-full lg:w-7/12 p-2"
      >
        <CurrencyStats
          v-for="(currency, index) in currencies"
          :key="index"
          :title="currency.title"
          :value="currency.value"
        />
      </div>
    </div>
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CurrencyStats from '@/components/CurrencyStats.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { fetchCurrencyData } from '@/api/currencyService'

export default {
  name: 'HomeView',
  components: { CurrencyStats, LoadingSpinner },
  computed: {
    ...mapState(['mainCurrency']),
  },
  watch: {
    mainCurrency: {
      handler() {
        this.loading = true
        void this.updateCurrencies()
      },
      immediate: true, // Trigger the handler on the first render.
    },
  },
  data() {
    return {
      mainCurrencies: ['usd', 'rub', 'eur'],
      currencies: [
        { value: 0, title: null },
        { value: 0, title: null },
      ],
      loading: true,
      data: null,
      error: null,
    }
  },
  methods: {
    findCurrencyValue(currencies, key) {
      return currencies[key] !== undefined ? currencies[key] : null
    },
    async updateCurrencies() {
      try {
        this.data = await fetchCurrencyData()

        // Filter currencies to hide the base currency
        this.mainCurrencies = this.mainCurrencies.filter(
          (currency) => currency !== this.$store.state.mainCurrency
        )

        // Generate keys for retrieving exchange rate data.
        let firstFieldToFind =
          this.$store.state.mainCurrency + '-' + this.mainCurrencies[0]
        let secondFieldToFind =
          this.$store.state.mainCurrency + '-' + this.mainCurrencies[1]

        // Set headers for currencies
        this.currencies[0].title =
          '1' + this.$store.state.mainCurrency.toUpperCase() + '≈'
        this.currencies[1].title =
          '1' + this.$store.state.mainCurrency.toUpperCase() + '≈'

        let firstCurrencyResult = this.findCurrencyValue(
          this.data,
          firstFieldToFind
        )
        let secondCurrencyResult = this.findCurrencyValue(
          this.data,
          secondFieldToFind
        )

        // Limit the number of decimal places to two
        if (firstCurrencyResult.toString().split('.')[1]?.length > 2) {
          firstCurrencyResult = firstCurrencyResult.toFixed(2)
        }

        if (secondCurrencyResult.toString().split('.')[1]?.length > 2) {
          secondCurrencyResult = secondCurrencyResult.toFixed(2)
        }

        this.currencies[0].value =
          firstCurrencyResult + this.mainCurrencies[0].toUpperCase()
        this.currencies[1].value =
          secondCurrencyResult + this.mainCurrencies[1].toUpperCase()

        // Restore the main list of currencies
        this.mainCurrencies = ['usd', 'rub', 'eur']
      } catch (err) {
        this.error = err.message
        console.log(this.error)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    void this.updateCurrencies()
  },
}
</script>

<style scoped></style>

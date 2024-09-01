<template>
  <!-- Показываем содержимое, когда данные загружены (loading === false) -->
  <div v-if="this.loading === false" class="m-5">
    <div
      class="stats stats-vertical lg:stats-horizontal shadow bg-slate-700 rounded-xl w-full lg:w-7/12 p-2"
    >
      <!-- Блок для отображения первой валюты -->
      <div class="stat">
        <div class="stat-title">{{ this.currencyFirst.title }}</div>
        <div class="stat-value">{{ this.currencyFirst.value }}</div>
      </div>

      <!-- Блок для отображения второй валюты -->
      <div class="stat">
        <div class="stat-title">{{ this.currencySecond.title }}</div>
        <div class="stat-value">{{ this.currencySecond.value }}</div>
      </div>
    </div>
  </div>

  <!-- Показываем лоадер, пока данные загружаются -->
  <div v-else>
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeView',
  components: {},
  computed: {
    // Подключаем состояние mainCurrency из Vuex
    ...mapState(['mainCurrency']),
  },
  watch: {
    // Наблюдаем за изменениями mainCurrency и вызываем updateCurrencies при изменении
    mainCurrency: {
      handler() {
        this.loading = true
        void this.updateCurrencies()
      },
      immediate: true, // Запускаем обработчик при первом рендере
    },
  },
  data() {
    return {
      // Список валют для отображения
      mainCurrencies: ['usd', 'rub', 'eur'],
      // Информация о первой и второй валюте для отображения
      currencyFirst: { value: 0, title: null },
      currencySecond: { value: 0, title: null },
      // Состояние загрузки данных
      loading: true,
      // Данные и ошибки
      data: null,
      error: null,
    }
  },
  methods: {
    // Находит значение валюты по ключу
    findCurrencyValue(currencies, key) {
      return currencies[key] !== undefined ? currencies[key] : null
    },

    // Асинхронно обновляет курсы валют
    async updateCurrencies() {
      try {
        const response = await fetch(
          'https://status.neuralgeneration.com/api/currency'
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        this.data = await response.json()

        // Фильтруем валюты, чтобы не показывать основную валюту
        this.mainCurrencies = this.mainCurrencies.filter(
          (currency) => currency !== this.$store.state.mainCurrency
        )

        // Формируем ключи для поиска данных о курсах
        let firstFieldToFind =
          this.$store.state.mainCurrency + '-' + this.mainCurrencies[0]
        let secondFieldToFind =
          this.$store.state.mainCurrency + '-' + this.mainCurrencies[1]

        // Устанавливаем заголовки для валют
        this.currencyFirst.title =
          '1' + this.$store.state.mainCurrency.toUpperCase() + '≈'
        this.currencySecond.title =
          '1' + this.$store.state.mainCurrency.toUpperCase() + '≈'

        // Получаем результаты для первой и второй валют
        let firstCurrencyResult = this.findCurrencyValue(
          this.data,
          firstFieldToFind
        )
        let secondCurrencyResult = this.findCurrencyValue(
          this.data,
          secondFieldToFind
        )

        // Округляем значения до двух знаков после запятой (если нужно)
        if (firstCurrencyResult.toString().split('.')[1]?.length > 2) {
          firstCurrencyResult = firstCurrencyResult.toFixed(2)
        }

        if (secondCurrencyResult.toString().split('.')[1]?.length > 2) {
          secondCurrencyResult = secondCurrencyResult.toFixed(2)
        }

        // Обновляем значения валют
        this.currencyFirst.value =
          firstCurrencyResult + this.mainCurrencies[0].toUpperCase()
        this.currencySecond.value =
          secondCurrencyResult + this.mainCurrencies[1].toUpperCase()

        // Восстанавливаем основной список валют
        this.mainCurrencies = ['usd', 'rub', 'eur']
      } catch (err) {
        // Обработка ошибок
        this.error = err.message
      } finally {
        // Завершение загрузки данных
        this.loading = false
      }
    },
  },
  mounted() {
    // Вызываем метод обновления валют при монтировании компонента
    void this.updateCurrencies()
  },
}
</script>

<style scoped></style>

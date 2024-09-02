<template>
  <div class="flex justify-center m-5">
    <!-- Отображается, если данные загружены (loading === false) -->
    <div
      v-if="this.loading === false"
      class="bg-slate-700 p-4 rounded-xl w-full lg:w-7/12 flex justify-center"
    >
      <div class="mb-4">
        <!-- Первая группа элементов для ввода суммы и выбора валюты -->
        <div class="flex items-center mb-3 join">
          <!-- Поле ввода суммы для первой валюты -->
          <input
            v-model.number="amount1"
            @input="onAmount1Change"
            type="number"
            class="input input-bordered bg-neutral input-primary w-full md:max-w-xs join-item text-white"
          />
          <!-- Выпадающий список для выбора первой валюты -->
          <select
            v-model="selectedCurrency1"
            @change="convertAmount"
            class="select text-white bg-neutral select-bordered select-primary w-full md:max-w-xs mr-2 join-item"
          >
            <!-- Опции валют, отображаемые в выпадающем списке -->
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.name }}
            </option>
          </select>
        </div>

        <!-- Вторая группа элементов для ввода суммы и выбора валюты -->
        <div class="flex items-center join">
          <!-- Поле ввода суммы для второй валюты -->
          <input
            v-model.number="amount2"
            @input="onAmount2Change"
            type="number"
            class="input bg-neutral input-bordered input-primary w-full md:max-w-xs join-item text-white"
          />
          <!-- Выпадающий список для выбора второй валюты -->
          <select
            v-model="selectedCurrency2"
            @change="convertAmount"
            class="select text-white bg-neutral select-bordered select-primary w-full md:max-w-xs mr-2 join-item"
          >
            <!-- Опции валют, отображаемые в выпадающем списке -->
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Отображается, если данные еще загружаются (loading === true). Лоадер -->
    <div v-else>
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Список валют с начальным курсом
      currencies: [
        { code: 'USD', name: 'US Dollar', rate: 0 },
        { code: 'EUR', name: 'Euro', rate: 0 },
        { code: 'RUB', name: 'Russian Ruble', rate: 0 },
      ],

      // Выбранные валюты и суммы
      selectedCurrency1: 'USD',
      selectedCurrency2: 'EUR',
      amount1: 0,
      amount2: 0,

      // Состояние загрузки данных (для лоадера)
      loading: true,

      // Определяет, какой из инпутов был изменен последним
      lastChanged: 'amount1', // Изначально предполагается, что изменяется amount1
    }
  },
  watch: {
    // Следим за изменениями в валютах и суммах, чтобы выполнить конвертацию
    selectedCurrency1: 'convertAmount',
    selectedCurrency2: 'convertAmount',
    amount1: 'convertAmount',
    amount2: 'convertAmount',
  },
  methods: {
    // Обновляет курсы валют из внешнего API. Решил использовать другие данные, не из ТЗ, чтобы
    // эффективно выполнять конвертацию используя курсы валют к доллару
    async updateCurrencies() {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()

        let rates = data.rates

        // Обновляет курсы валют в списке currencies
        for (let i = 0; i < this.currencies.length; i++) {
          const currency = this.currencies[i]
          if (rates[currency.code]) {
            currency.rate = rates[currency.code]
          }
        }
      } catch (err) {
        console.error(err.message)
      } finally {
        // Завершение загрузки данных (для лоадера)
        this.loading = false
      }
    },

    // Конвертирует суммы между двумя валютами
    convertAmount() {
      const currency1 = this.currencies.find(
        (c) => c.code === this.selectedCurrency1
      )

      const currency2 = this.currencies.find(
        (c) => c.code === this.selectedCurrency2
      )

      if (currency1 && currency2) {
        if (this.lastChanged === 'amount1') {
          // Если изменена amount1, пересчитываем amount2
          this.amount2 = (this.amount1 / currency1.rate) * currency2.rate
        } else if (this.lastChanged === 'amount2') {
          // Если изменена amount2, пересчитываем amount1
          this.amount1 = (this.amount2 / currency2.rate) * currency1.rate
        }

        // Ограничиваем количество знаков после запятой до двух
        if (
          this.amount1.toString().split('.')[1]?.length > 2 &&
          this.amount1.toString().split('.')[1]?.length !== 0
        ) {
          this.amount1 = this.amount1.toFixed(2)
        }
        if (
          this.amount2.toString().split('.')[1]?.length > 2 &&
          this.amount2.toString().split('.')[1]?.length !== 0
        ) {
          this.amount2 = this.amount2.toFixed(2)
        }
      }
    },

    // Обработчик изменения значения поля amount1
    onAmount1Change() {
      this.lastChanged = 'amount1'
      this.convertAmount()
    },

    // Обработчик изменения значения поля amount2
    onAmount2Change() {
      this.lastChanged = 'amount2'
      this.convertAmount()
    },
  },
  mounted() {
    // Вызываем метод обновления валют при монтировании компонента
    this.updateCurrencies()
  },
}
</script>

<style scoped></style>

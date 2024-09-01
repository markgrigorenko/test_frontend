<template>
  <nav class="m-5 flex justify-center">
    <div class="w-full md:w-7/12">
      <div class="navbar bg-slate-700 rounded-xl p-4 flex justify-between">
        <!-- Кнопка для ссылки на GitHub автора 👋 -->
        <div>
          <a
            class="btn btn-neutral hidden md:flex md:text-xl"
            href="https://github.com/markgrigorenko"
            target="_blank"
            rel="noopener noreferrer"
            >Конвертация</a
          >
        </div>

        <!-- Кнопки для переключения между Main и Convert страницами -->
        <div class="">
          <div class="join">
            <button
              :class="[
                'btn join-item',
                isActiveMain ? 'btn-primary' : 'btn-neutral',
              ]"
              @click="toggleActiveMain"
            >
              Главная
            </button>

            <button
              :class="[
                'btn join-item',
                isActiveConvert ? 'btn-primary' : 'btn-neutral',
              ]"
              @click="toggleActiveConvert"
            >
              Конвертация
            </button>
          </div>
        </div>

        <!-- Выпадающий список для выбора основной валюты -->
        <div>
          <div class="relative inline-block text-left">
            <!-- Кнопка, показывающая текущую выбранную валюту и раскрывающая селект с валютами -->
            <button @click="toggleDropdown" class="btn btn-neutral">
              {{ selectedCurrency }}
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <!-- Выпадающее меню -->
            <div
              v-if="isOpen"
              class="absolute right-0 mt-2 w-48 bg-neutral border-gray-300 rounded-md shadow-lg"
            >
              <ul class="py-1">
                <!-- Список валют -->
                <li
                  v-for="currency in currencies"
                  :key="currency"
                  class="cursor-pointer text-white px-4 py-2 hover:bg-primary"
                  @click="selectCurrency(currency)"
                >
                  {{ currency }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <!-- Компонент роутера -->
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      isActiveMain: true,
      isActiveConvert: false,
      // Определяет, открыт ли выпадающий список валют
      isOpen: false,

      // Выбранная валюта и список доступных валют
      selectedCurrency: 'USD',
      currencies: ['USD', 'EUR', 'RUB'],
    }
  },
  methods: {
    // Метод для перехода на Main
    toggleActiveMain() {
      this.$router.push('/')
      this.isActiveMain = true
      this.isActiveConvert = false
    },

    // Метод для перехода на Convert
    toggleActiveConvert() {
      this.$router.push('/convert')
      this.isActiveConvert = true
      this.isActiveMain = false
    },

    toggleDropdown() {
      this.isOpen = !this.isOpen
    },

    // Метод для выбора валюты и обновления состояния стора
    selectCurrency(currency) {
      this.selectedCurrency = currency
      this.$store.state.mainCurrency = currency.toLowerCase()
      this.isOpen = false
    },
  },
  mounted() {
    // Проверяет текущий URL и устанавливает активное состояние кнопок в зависимости от открытого View
    const currentUrl = window.location.href
    if (currentUrl === 'http://localhost:8080') {
      this.isActiveMain = true
      this.isActiveConvert = false
    } else if (currentUrl === 'http://localhost:8080/convert') {
      this.isActiveConvert = true
      this.isActiveMain = false
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script setup></script>

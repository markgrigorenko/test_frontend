<template>
  <nav class="m-5 flex justify-center">
    <div class="w-full md:w-7/12">
      <div class="navbar bg-slate-700 rounded-xl p-4 flex justify-between">
        <!-- Developer's GitHub 👋 -->
        <div>
          <a
            class="btn btn-neutral hidden md:flex md:text-lg"
            href="https://github.com/markgrigorenko"
            target="_blank"
            rel="noopener noreferrer"
            >Конвертация</a
          >
        </div>

        <div class="">
          <div class="join">
            <router-link
              to="/"
              class="btn join-item"
              :class="{
                'btn-primary': $route.path === '/',
                'btn-neutral': $route.path !== '/',
              }"
            >
              Главная
            </router-link>

            <router-link
              to="/convert"
              class="btn join-item"
              :class="{
                'btn-primary': $route.path === '/convert',
                'btn-neutral': $route.path !== '/convert',
              }"
            >
              Конвертация
            </router-link>
          </div>
        </div>

        <DropdownMenu
          :selectedCurrency="selectedCurrency"
          :currencies="currencies"
          :isOpen="isOpen"
          @selectCurrency="selectCurrency"
          @toggleDropdown="toggleDropdown"
        />
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu.vue'
export default {
  components: {
    DropdownMenu,
  },
  data() {
    return {
      isOpen: false,
      selectedCurrency: 'USD',
      currencies: ['USD', 'EUR', 'RUB'],
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectCurrency(currency) {
      this.selectedCurrency = currency
      this.$store.state.mainCurrency = currency.toLowerCase()
      this.isOpen = false
    },
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

<template>
  <div>
    <div class="relative inline-block text-left">
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
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-neutral border-gray-300 rounded-md shadow-lg"
      >
        <ul class="py-1">
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
</template>

<script>
export default {
  props: {
    selectedCurrency: String,
    currencies: Array,
    isOpen: Boolean,
  },
  methods: {
    toggleDropdown() {
      this.$emit('toggleDropdown')
    },
    selectCurrency(currency) {
      this.$emit('selectCurrency', currency)
    },
  },
}
</script>

<style scoped></style>

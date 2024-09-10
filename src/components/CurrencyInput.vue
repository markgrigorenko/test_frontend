<template>
  <div class="flex items-center mb-3 join">
    <input
      :value="modelValue"
      @input="onAmountChange($event.target.value)"
      type="number"
      class="input input-bordered bg-neutral input-primary w-full md:max-w-xs join-item text-white"
    />
    <select
      :value="selectedCurrency"
      @change="onCurrencyChange($event.target.value)"
      class="select text-white bg-neutral select-bordered select-primary w-full md:max-w-xs mr-2 join-item"
    >
      <option
        v-for="currency in currencies"
        :key="currency.code"
        :value="currency.code"
      >
        {{ currency.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    currencies: Array,
    modelValue: {
      type: Number,
      default: 0,
    },
    selectedCurrency: String,
  },
  methods: {
    onAmountChange(value) {
      this.$emit('update:modelValue', Number(value))
    },
    onCurrencyChange(value) {
      this.$emit('update:selectedCurrency', value)
    },
  },
}
</script>

<style scoped></style>

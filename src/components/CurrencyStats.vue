<template>
  <div class="stat">
    <div class="stat-title text-gray-400">{{ title }}</div>
    <div class="stat-value text-gray-400">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'CurrencyStat',
  props: {
    title: String,
    value: String,
  },
}
</script>

<style scoped></style>

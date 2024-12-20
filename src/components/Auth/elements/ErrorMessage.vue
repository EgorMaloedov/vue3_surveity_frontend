<template>
  <span class="error-message">{{ message }}</span>
</template>

<script setup>
defineProps({
  message: String
});
</script>

<style scoped>
.error-message {
  font-size: 12px;
  color: #e63946;
  text-align: left;
  width: 100%;
}
</style>

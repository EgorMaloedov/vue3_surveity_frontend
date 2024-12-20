<template>
  <div class="error">{{ message }}</div>
</template>

<script setup>
defineProps({ message: String });
</script>

<style scoped>
.error {
  background-color: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
</style>

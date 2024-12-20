<template>
  <button type="submit" class="submit-button" :disabled="loading">
    <Loader v-if="loading" />
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup>
import Loader from "./Loader.vue";

defineProps({
  loading: Boolean,
  label: String
});
</script>

<style scoped>
.submit-button {
  width: 100%;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  background: #1db954;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 2rem;
}

.submit-button:disabled {
  background: #2c2c34;
  cursor: not-allowed;
}
</style>

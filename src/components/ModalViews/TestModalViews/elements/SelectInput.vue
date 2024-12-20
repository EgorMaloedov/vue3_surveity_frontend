<template>
  <div class="select-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  options: Array
});
</script>

<style scoped>
.select-input {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
}

.select-input select {
  width: 100%;
  padding: 0.5rem;
  border: none;
  outline: none;
  background-color: #21212B;
  color: white;
  font-size: 0.9rem;
  border-radius: 4px;
}
</style>

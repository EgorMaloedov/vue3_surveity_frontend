<template>
  <div class="radio-group">
    <label v-if="label" class="group-label">{{ label }}</label>
    <div class="radio-options">
      <div v-for="(option, index) in options" :key="index" class="radio-item">
        <input
            type="radio"
            :id="`radio-${index}`"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="$emit('update:modelValue', option.value)"
        />
        <label :for="`radio-${index}`">{{ option.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  options: Array,
});
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-label {
  color: grey;
  font-size: 0.9rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

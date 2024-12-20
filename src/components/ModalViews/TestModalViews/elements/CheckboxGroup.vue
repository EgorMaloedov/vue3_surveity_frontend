<template>
  <div class="checkbox-group">
    <label v-if="label" class="group-label">{{ label }}</label>
    <div class="checkbox-options">
      <div v-for="(option, index) in options" :key="index" class="checkbox-item">
        <input
            type="checkbox"
            :id="`checkbox-${index}`"
            :value="option.value"
            :checked="modelValue[option.value]"
            @change="handleCheckboxChange(option.value, $event)"
        />
        <label :for="`checkbox-${index}`">{{ option.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Object,
  label: String,
  options: Array,
});

const emit = defineEmits(["update:modelValue"]);

const handleCheckboxChange = (value, event) => {
  const updatedValue = {...props.modelValue, [value]: event.target.checked};
  emit("update:modelValue", updatedValue);
};

// Watch for changes in modelValue to update options
watch(() => props.modelValue, (newVal) => {
  props.options.forEach(option => {
    option.checkbox = newVal[option.value];
  });
}, {immediate: true});
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-label {
  color: grey;
  font-size: 0.9rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.checkbox-item input {
  width: 1rem;
  height: 1rem;
}
</style>

<template>
  <div class="auth-field">
    <input
        :id="id"
        :name="name"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="input-field"
        :class="{ 'input-error': error }"
    />
    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup>
import ErrorMessage from "./ErrorMessage.vue";

defineProps({
  modelValue: String,
  id: String,
  name: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  autocomplete: String,
  error: String
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.auth-field{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: none;
  box-sizing: border-box;
  outline: none;
  background: #272732;
  color: white;
}

.input-error {
  border-color: #e63946;
}
</style>

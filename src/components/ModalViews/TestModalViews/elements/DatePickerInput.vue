<template>
  <div class="date-picker-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <VueDatePicker
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :min-date="minDate"
        :id="id"
        :placeholder="placeholder"
        :class="'dark-theme'"
        locale="ru"
    />
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

defineProps({
  modelValue: Date,
  label: String,
  id: String,
  minDate: Date,
  placeholder: String,
});
</script>

<style scoped>
/* Стили для внешнего контейнера */
.date-picker-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Стили для лейбла */
.input-label {
  color: #b3b3b3;
  font-size: 0.9rem;
}

/* Стили для самого input поля */
:deep(.dp__input) {
  background-color: #2c2f3f; /* Тёмно-серый фон */
  color: #c9d1d9; /* Светлый текст */
  border: 1px solid #44475a; /* Серый бордер */
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

:deep(.dp__input::placeholder) {
  color: #888888;
}

:deep(.dp__input:hover),
:deep(.dp__input:focus) {
  border-color: #00c78d; /* Зелёный бордер при фокусе */
  outline: none;
}

/* Глобальные стили для VueDatePicker (тёмная тема) */
:deep(.dark-theme) {
  --vdp-background: #1e1e2e;
  --vdp-text-color: #c9d1d9;
  --vdp-primary: #00c78d;
  --vdp-secondary: #44475a;
  --vdp-border: #44475a;
  --vdp-hover-color: #00c78d;
  --vdp-disabled-color: #5a5a5a;
  --vdp-button-bg: #333644;
  --vdp-button-hover-bg: #00c78d;
  --vdp-button-text: #c9d1d9;
}

:deep(.dp__cell_disabled) {
  color: #5a5a5a; /* Серый цвет для отключённых ячеек */
  background-color: #2c2f3f; /* Фон для disabled */
  cursor: not-allowed;
  opacity: 0.6;
}
:deep(.dp__cell_disabled:hover) {
  color: #5a5a5a; /* Серый цвет для отключённых ячеек */
  background-color: #2c2f3f; /* Фон для disabled */
  cursor: not-allowed;
  opacity: 0.6;
}


/* Календарь и кнопки */
:deep(.dark-theme .dp__menu) {
  background-color: var(--vdp-background);
  color: var(--vdp-text-color);
  border: 1px solid var(--vdp-border);
}

:deep(.dark-theme .dp__action_select) {
  background-color: var(--vdp-button-bg);
  color: var(--vdp-button-text);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
}

:deep(.dark-theme .dp__action_select:hover) {
  background-color: var(--vdp-button-hover-bg);
  color: #1e1e2e;
}

:deep(.dark-theme .dp__action_cancel) {
  background-color: transparent;
  color: var(--vdp-button-text);
  border: 1px solid var(--vdp-border);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

:deep(.dark-theme .dp__action_cancel:hover) {
  background-color: var(--vdp-hover-color);
  color: #1e1e2e;
}

/* Убираем иконку из input */
:deep(.dp__input_icon) {
  display: none; /* Полностью скрыть иконку */
}

:deep(.dp--clear-btn) {
  display: none; /* Скрыть иконку очистки */
}

:deep(.dark-theme .dp__calendar_item) {
  color: var(--vdp-text-color);
}

:deep(.dark-theme .dp__calendar_item:hover) {
  background-color: var(--vdp-hover-color);
  color: #1e1e2e;
}

:deep(.dark-theme .dp__calendar_item_active) {
  background-color: var(--vdp-primary);
  color: #1e1e2e;
  border-radius: 50%;
}
</style>

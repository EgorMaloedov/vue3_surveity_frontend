<template>
  <div class="time-picker-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="time-picker">
      <select v-model="hours" class="time-picker-select" :id="id">
        <option disabled value="">Часы</option>
        <option v-for="hour in 24" :key="hour" :value="hour - 1">
          {{ hour - 1 }}
        </option>
      </select>

      <span class="time-picker-divider">:</span>

      <select v-model="minutes" class="time-picker-select">
        <option disabled value="">Минуты</option>
        <option v-for="minute in 60" :key="minute" :value="minute - 1">
          {{ minute - 1 }}
        </option>
      </select>

      <span class="time-picker-divider">:</span>

      <select v-model="seconds" class="time-picker-select">
        <option disabled value="">Секунды</option>
        <option v-for="second in 60" :key="second" :value="second - 1">
          {{ second - 1 }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Пропсы компонента
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    validator: (value) =>
        value &&
        typeof value.hours === "number" &&
        typeof value.minutes === "number" &&
        typeof value.seconds === "number",
  },
  label: String,
  id: String,
});

const emit = defineEmits(["update:modelValue"]);

// Локальные переменные для управления состоянием
const hours = ref(props.modelValue.hours);
const minutes = ref(props.modelValue.minutes);
const seconds = ref(props.modelValue.seconds);

// Отслеживание изменений времени
watch([hours, minutes, seconds], ([newHours, newMinutes, newSeconds]) => {
  const updatedValue = { hours: newHours, minutes: newMinutes, seconds: newSeconds };
  // Эмитим событие в родительский компонент
  emit("update:modelValue", updatedValue);
});
</script>

<style scoped>
/* Основной контейнер */
.time-picker-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Стили для лейбла */
.input-label {
  color: #b3b3b3;
  font-size: 0.9rem;
}

/* Контейнер для выбора времени */
.time-picker {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Стили для селекторов */
.time-picker-select {
  background-color: #2c2f3f; /* Тёмно-серый фон */
  color: #c9d1d9; /* Светлый текст */
  border: 1px solid #44475a; /* Серый бордер */
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.9rem;
  outline: none;
}

.time-picker-select:hover,
.time-picker-select:focus {
  border-color: #00c78d; /* Зелёный бордер при фокусе */
}

/* Стили для разделителя между часами, минутами и секундами */
.time-picker-divider {
  font-size: 1rem;
  color: #c9d1d9;
}
</style>

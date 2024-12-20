<template>
  <form class="text-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <!-- Условие для отображения input или textarea в зависимости от type -->
      <input
          v-if="type !== 'textarea'"
          :id="id"
          :autocomplete="autocomplete"
          :type="showPassword ? 'text' : type || 'password'"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
      />
      <textarea
          v-else
          :id="id"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- Кнопка для показа/скрытия пароля (для input типа 'password') -->
      <button
          v-if="type === 'password'"
          @click="togglePasswordVisibility"
          type="button"
          class="toggle-password-btn"
      >
        {{ showPassword ? 'Скрыть' : 'Показать' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  autocomplete: String,
  modelValue: String,
  label: String,
  id: String,
  placeholder: String,
  type: String, // Включает 'password', 'textarea' или другие типы
});

const showPassword = ref(false); // Состояние для видимости пароля

// Функция для переключения видимости пароля
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.text-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.text-input input,
.text-input textarea {
  width: 100%;
  padding: 0.5rem;
  border: none;
  outline: none;
  background: none;
  color: white;
  font-size: 0.9rem;
  border-radius: 4px;
}

.text-input input::placeholder,
.text-input textarea::placeholder {
  color: #828288;
}

.input-label {
  color: grey;
  font-size: 0.9rem;
}

.toggle-password-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-input textarea {
  min-height: 100px; /* Задаем минимальную высоту для textarea */
  resize: vertical; /* Разрешаем изменять размер по вертикали */
}
</style>

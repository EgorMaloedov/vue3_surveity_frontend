<template>
  <div class="fieldListWrapper">
    <h3 class="fieldListTitle">Настройка полей перед тестом</h3>

    <div v-for="(field, index) in fields" :key="index" class="fieldItem">
      <input
          type="text"
          v-model="field.title"
          class="fieldInput"
          placeholder="Введите название поля"
          required
      />

      <select v-model="field.type" class="fieldSelect" required>
        <option disabled value="">Выберите тип</option>
        <option value="text">Текст</option>
        <option value="email">Email</option>
        <option value="password">Пароль</option>
        <option value="textarea">Текстовая область</option>
      </select>

      <label class="fieldCheckboxWrapper">
        <input
            type="checkbox"
            v-model="field.isRequired"
            class="fieldCheckbox"
        />
        Обязательное поле
      </label>

      <input
          type="text"
          v-model="field.default"
          class="fieldInput"
          placeholder="Значение по умолчанию (опционально)"
      />

      <button class="deleteBtn" @click="removeField(index)">Удалить</button>
    </div>

    <span class="addFieldBtn" @click="addField">+ Добавить поле</span>
    <button class="saveFieldsBtn" @click="emitFields">Сохранить список</button>
  </div>
</template>

<script setup>
import {ref} from "vue";
const props = defineProps({
  inputFields: Array,
})
// Инициализация массива полей
const fields = ref(props.inputFields ? props.inputFields : []);

// Добавление нового поля
const addField = () => {
  fields.value.push({
    type: "text",
    isRequired: false,
    default: "",
    title: "",
  });
};

// Удаление поля
const removeField = (index) => {
  fields.value.splice(index, 1);
};

// Отправка списка полей в родительский компонент
const emit = defineEmits(["updateFields"]);
const emitFields = () => {
  emit("updateFields", fields.value);
};
</script>

<style scoped>
.fieldListWrapper {
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 1rem;
  position: relative;
  align-items: flex-start;
}

.fieldListTitle {
  font-size: 1rem;
  color: white;
}

.fieldItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #828288;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
}

.fieldInput,
.fieldSelect {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: white;
  background: none;
  border: none;
  border-bottom: 1px solid #828288;
  outline: none;
}

.fieldInput::placeholder,
.fieldSelect::placeholder {
  color: #828288;
}

.fieldSelect {
  background: none;
}

.fieldCheckboxWrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fieldCheckbox {
  width: 1rem;
  height: 1rem;
}

.deleteBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  color: #ff4d4f;
  transition: color 0.2s ease;
}

.deleteBtn:hover {
  color: #ff7875;
}

.addFieldBtn,
.saveFieldsBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #828288;
  transition: color 0.2s ease;
}

.addFieldBtn:hover,
.saveFieldsBtn:hover {
  color: white;
}

.saveFieldsBtn {
  font-weight: bold;
  align-self: flex-end;
}
</style>

<template>
  <ListItem :title="`Вопрос ${props.count}:`">
    <div class="questionWrapper">

      <input
          type="text"
          class="questionInput"
          autocomplete="question-name"
          v-model="currentQuestion.title"
          placeholder="Введите название вопроса"
          required
      />

      <select
          class="questionSelect"
          v-model="currentQuestion.type"
          @change="resetAnswers"
          required
      >
        <option value="empty">Пожалуйста, выберите тип ответов вопроса</option>
        <option value="single">Один ответ</option>
        <option value="multiple">Множественный выбор</option>
        <option value="text">Свободный формат</option>
      </select>

      <div v-if="currentQuestion.type === 'text'">
        <textarea
            class="textArea"
            placeholder="Ответ пользователя будет здесь..."
            disabled
        ></textarea>
      </div>

      <div v-else-if="currentQuestion.type !== 'empty'" class="answersWrapper">
        <div
            v-for="(answer, index) in currentQuestion.answers"
            v-bind:key="index"
            :key="index"
            class="answerItem"
        >
          <input
              v-if="currentQuestion.type === 'single'"
              type="radio"
              class="inputRadio"
              :title="`correctAnswer_${props.count}`"
              :checked="answer.is_correct"
              @change="setCorrectAnswer(index)"
          />
          <input
              v-if="currentQuestion.type === 'multiple'"
              type="checkbox"
              class="inputCheckbox"
              v-model="answer.is_correct"
          />
          <input
              type="text"
              class="answerInput"
              v-model="answer.text"
              placeholder="Введите ответ"
          />
          <button class="deleteBtn" @click.prevent="deleteAnswer(index)">
            Удалить
          </button>
        </div>
        <span
            class="addAnswer"
            @click="addAnswer"
        >
          + Добавить ответ
        </span>
      </div>

      <button class="deleteQuestionBtn" @click="deleteQuestion">x</button>
    </div>
  </ListItem>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import ListItem from "./ListItem.vue";

// Определяем свойства
const props = defineProps({
  question: { type: Object, required: true },
  count: { type: Number, required: true },
});

// Определяем события
const emit = defineEmits(["updateQuestion", "deleteQuestion"]);

const { question } = toRefs(props);
const currentQuestion = ref({ ...question.value });

// Синхронизация входных данных
watch(
    () => props.question,
    (newQuestion) => {
      if (JSON.stringify(newQuestion) !== JSON.stringify(currentQuestion.value)) {
        currentQuestion.value = { ...newQuestion };
      }
    },
    { deep: true, immediate: true }
);

// Отправка изменений в родительский компонент
watch(
    currentQuestion,
    (newQuestion) => {
      emit("updateQuestion", { question: { ...newQuestion } });
    },
    { deep: true }
);

// Добавление ответа
const addAnswer = () => {
  if (currentQuestion.value.type !== "empty" && currentQuestion.value.type !== "text") {
    currentQuestion.value.answers.push({ text: "", is_correct: false });
  }
};

// Удаление ответа
const deleteAnswer = (index) => {
  currentQuestion.value.answers.splice(index, 1);
};

// Сброс ответов при изменении типа вопроса
const resetAnswers = () => {
  currentQuestion.value.answers = [];
};

// Установка правильного ответа для типа "single"
const setCorrectAnswer = (index) => {
  currentQuestion.value.answers.forEach((answer, i) => {
    answer.is_correct = i === index;
  });
};

// Удаление вопроса
const deleteQuestion = () => {
  emit("deleteQuestion");
};
</script>

<style scoped>
.questionWrapper {
  display: flex;
  flex-direction: column;
  width: 90%;
  align-items: flex-start; /* Выравнивание по левому краю */
  gap: 1rem;
  position: relative;
}

.questionInput,
.questionSelect,
.answerInput {
  width: 100%;
  padding: 0.2rem;
  font-size: 0.7rem;
  color: white;
  background: none;
  border: none;
  border-bottom: 1px solid #828288;
  outline: none;
}

.questionInput::placeholder,
.questionSelect,
.answerInput::placeholder {
  color: #828288;
}

.answersWrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Выравнивание по левому краю */
  gap: 0.5rem;
}

.answerItem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.inputRadio,
.inputCheckbox {
  width: 1rem;
}

.answerItem input {
  margin-left: 0; /* Убираем отступы для элементов */
}

.deleteBtn,
.addAnswer,
.deleteQuestionBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  transition: color 0.2s ease;
}

.addAnswer {
  margin-top: 0.5rem;
}

.deleteBtn {
  color: #ff4d4f;
}

.deleteBtn:hover {
  color: #ff7875;
}

.addAnswer {
  color: #828288;
}

.addAnswer:hover {
  color: white;
}

.textArea {
  width: 100%;
  height: 4rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: white;
  background: none;
  border: 1px solid #828288;
  border-radius: 0.3rem;
  resize: none;
  outline: none;
}

.deleteQuestionBtn {
  position: absolute;
  top: -0.8rem;
  right: -2rem;
  color: #828288;
}

.deleteQuestionBtn:hover {
  color: #ff7875;
}
</style>

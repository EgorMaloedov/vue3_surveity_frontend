<template>
  <div class="question-card">
    <ErrorMessage v-if="sessionStore.error" :message="sessionStore.error" />
    {{sessionStore.session ? sessionStore.session.pass_time : ''}}
    <QuestionContent
        v-if="sessionStore.currentQuestion"
        :question="sessionStore.currentQuestion"
        v-model="selectedAnswer"
        @submit="submitAnswer"
    />

    <div v-else class="no-question">Нет доступных вопросов.</div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useSessionStore} from "../../../stores/sessionStore.js";
import { useRoute } from "vue-router";
import ErrorMessage from "./elements/ErrorMessage.vue";
import QuestionContent from "./elements/QuestionContent.vue";

const sessionStore = useSessionStore();
const selectedAnswer = ref(null);
const route = useRoute();

const submitAnswer = async () => {
  await sessionStore.submitAnswer(sessionStore.currentQuestion.question_id, selectedAnswer.value, route.query.token);
  selectedAnswer.value = null;
};

watch(() => sessionStore.currentQuestion, (newQuestion) => {
  if (newQuestion) {
    selectedAnswer.value = null;
  }
});
</script>

<style scoped>
/* Основные стили */
.question-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  box-sizing: border-box;
}

.no-question {
  font-size: 1.2em;
  line-height: 1.6;
  text-align: center;
}
</style>

<template>
  <div>
    <h2>Сессии и ответы</h2>
    <div v-for="session in transformedSessions" :key="session.id" class="session">
      <div class="session-header">
        <h3>Статус: {{ session.status }}</h3>
        <p>Дата: {{ new Date(session.created_at).toLocaleString() }}</p>
        <p>Время выполнения: {{ session.time_spent }}</p>
      </div>
      <div class="session-body">
        <div class="user-inputs">
          <h4>Ввод пользователя:</h4>
          <ul>
            <li v-if="test.user_inputs" v-for="(user_input, index) in test.user_inputs" :key="index">
              {{ user_input.title }}: {{ JSON.parse(session.user_inputs)[index] }}
            </li>
          </ul>
        </div>
        <div class="answers">
          <h4>Ответы:</h4>
          <ul>
            <li v-for="(answer, index) in session.answers" :key="index">
              <strong>{{ answer.question }}</strong>:
              <span :style="{ color: answer.answer.isCorrect ? 'green' : 'red' }">
                <span v-if="Array.isArray(answer.answer.answersText)">
                  <span v-for="(ans, idx) in answer.answer.answersText" :key="idx" :style="{ color: ans.isCorrect ? 'green' : 'red' }">
                    {{ ans.text + " " }}
                  </span>
                </span>
                <span v-if="answer.answer.rawAnswer">
                  {{ answer.answer.rawAnswer }}
                </span>
                <span v-if="answer.answer.answerText">
                  {{ answer.answer.answerText }}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTestsStore } from "../stores/testsStore.js";

const props = defineProps({
  test: Object,
});

const transformSessions = (sessions, questions) => {
  return sessions.map((session) => {
    const transformedAnswers = session.answers
        .split(";")
        .filter(Boolean)
        .map((pair) => {
          const [questionId, rawAnswer] = pair.split(":");
          const question = questions.find((q) => q.id === questionId);
          if (!question) return null;

          if (question.type === "multiple") {
            const answerIds = JSON.parse(rawAnswer.replace(/'/g, '"'));
            const answersText = answerIds
                .map((id) => {
                  const answer = question.answers.find((a) => a.id === id);
                  return {
                    text: answer.text,
                    isCorrect: answer.is_correct,
                  };
                })
                .filter(Boolean);
            return { question: question.title, answer: { answersText } };
          } else if (question.type === "text") {
            return { question: question.title, answer: { rawAnswer, isCorrect: true } };
          } else {
            const answerObj = question.answers.find((a) => a.id === rawAnswer);
            return { question: question.title, answer: { answerText: answerObj.text, isCorrect: answerObj?.is_correct } };
          }
        })
        .filter(Boolean);

    return {
      ...session,
      answers: transformedAnswers,
    };
  });
};

const currentTest = computed(() => {
  return {
    sessions: props.test.sessions,
    questions: props.test.questions,
  };
});

const transformedSessions = computed(() => {
  return transformSessions(currentTest.value.sessions, currentTest.value.questions);
});
</script>

<style scoped>
.session {
  overflow: hidden;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #21212B;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.session-header h3 {
  margin: 0;
}

.session-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-inputs,
.answers {
  background-color: #272732;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h4 {
  margin: 0 0 8px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 4px;
}
</style>

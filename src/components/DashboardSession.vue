<template>
  <div>
    <h2>Сессии и ответы</h2>
    <div v-for="session in transformedSessions" :key="session.id" class="session">
      <h3>Сессия: {{ session.id }}</h3>
      <p>Статус: {{ session.status }}</p>
      <p>Дата: {{ new Date(session.created_at).toLocaleString() }}</p>
      <p>Время выполнения: {{ session.time_spent }}</p>
      <p>Ответы:</p>
      <ul>
        <li v-for="(answer, index) in session.answers" :key="index">
          <strong>{{ answer.question }}</strong>:
          <span :style="{ color: answer.answer.isCorrect ? 'green' : 'red' }" >
            <span v-if="Array.isArray(answer.answer.answersText)">
                <span v-for="answer in answer.answer.answersText" :style="{ color: answer.isCorrect ? 'green' : 'red' }">
                  {{answer.text + ' '}}
                </span>
            </span>
            <span v-if="answer.answer.rawAnswer">
                {{answer.answer.rawAnswer}}
            </span>
            <span v-if="answer.answer.answerText">
              {{ answer.answer.answerText }}
            </span>

          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  test: Object,
})

const transformSessions = (sessions, questions) => {
  return sessions.map((session) => {
    const transformedAnswers = session.answers
        .split(";")
        .filter(Boolean) // Убираем пустые элементы
        .map((pair) => {
          const [questionId, rawAnswer] = pair.split(":");

          console.log(questions);
          const question = questions.find((q) => q.id === questionId);
          if (!question) return null;
          // Определим, правильный ли ответ
          const answer = question.answers.find(a => a.id === rawAnswer)

          // Обрабатываем разные типы вопросов
          if (question.type === "multiple") {
            const answerIds = JSON.parse(rawAnswer.replace(/'/g, '"'));
            const answersText = answerIds
                .map((id) => {
                  const answer = question.answers.find((a) => a.id === id)
                  return {
                    text: answer.text,
                    isCorrect: answer.is_correct,
                  }
                })
                .filter(Boolean);
            return {question: question.title, answer: {answersText}};
          } else if (question.type === "text") {
            return {question: question.title, answer: {rawAnswer, isCorrect: true}};
          } else {
            const answerObj = question.answers.find((a) => a.id === rawAnswer);
            return {question: question.title, answer: {answerText: answerObj.text , isCorrect: answerObj?.is_correct}};
          }
        })
        .filter(Boolean); // Убираем ошибки и пустые элементы

    return {
      ...session,
      answers: transformedAnswers,
    };
  });
};

const currentTest = computed(() => {
  // Пример использования в составе store
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
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  background-color: #000000;
  border-radius: 8px;
}

h3 {
  margin: 0 0 8px;
}

ul {
  margin: 0;
  padding: 0 0 0 16px;
}
</style>

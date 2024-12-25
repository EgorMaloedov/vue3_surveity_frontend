<template>
  <div>
    <div v-for="session in filteredSessions" :key="session.id" class="session">
      <div class="session-header">
        <div class="user-info">
          <h3>
            <span style="display: flex; flex-direction: column; align-items: flex-start;"
                  v-if="test.user_inputs" v-for="(user_input, index) in test.user_inputs" :key="index">
              {{ user_input.title }}: {{ JSON.parse(session.user_inputs)[index] }}{{ index < test.user_inputs.length - 1 ? ',' : '' }}
            </span>
          </h3>
        </div>
        <div class="session-meta">
          <p class="time-spent">Время выполнения: {{ session.time_spent }}</p>
          <p class="date">Дата: {{ new Date(session.created_at).toLocaleString() }}</p>
        </div>
      </div>
      <details class="answers-details">
        <summary class="correct-answers">
          Количество правильных ответов:
          <strong>{{ session.correctAnswersCount }}</strong> из
          <strong>{{ session.answers.length }}</strong>
        </summary>
        <div class="answers">
          <h4>Ответы:</h4>
          <ul style="list-style-type: none; display: flex; flex-direction: column; align-items: flex-start;" >
            <li v-for="(answer, index) in session.answers" :key="index">
              <strong>{{ answer.question }}</strong>:
              <span :style="{ color: answer.answer.isCorrect ? 'green' : 'red' }">
                <template v-if="Array.isArray(answer.answer.answersText)">
                  <span v-for="(ans, idx) in answer.answer.answersText" :key="idx" :style="{ color: ans.isCorrect ? 'green' : 'red' }">
                    {{ ans.text + " " }}
                  </span>
                </template>
                <template v-else-if="answer.answer.rawAnswer">
                  {{ answer.answer.rawAnswer }}
                </template>
                <template v-else-if="answer.answer.answerText">
                  {{ answer.answer.answerText }}
                </template>
              </span>
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

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

    const correctAnswersCount = transformedAnswers.filter((answer) =>
        Array.isArray(answer.answer.answersText)
            ? answer.answer.answersText.every((ans) => ans.isCorrect)
            : answer.answer.isCorrect
    ).length;

    return {
      ...session,
      answers: transformedAnswers,
      correctAnswersCount,
    };
  }).filter(session => session.answers.length > 0);
};

const transformedSessions = computed(() => transformSessions(props.test.sessions, props.test.questions));
const filteredSessions = computed(() => transformedSessions.value.filter(session => session.answers.length > 0));
</script>

<style scoped>
.session {
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

.user-info h3 {
  margin: 0;
}

.session-meta {
  text-align: right;
}

.time-spent,
.date {
  margin: 0;
}

.correct-answers {
  margin-top: 16px;
  cursor: pointer;
  padding: 8px;
  background-color: #272732;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-block;
  font-weight: bold;
  text-align: center;
}

.correct-answers:hover {
  background-color: #343446;
}

.answers {
  margin-top: 8px;
  background-color: #272732;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.answers ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.answers li {
  margin-bottom: 8px;
}
</style>

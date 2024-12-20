<template>
  <div class="welcome-card">
    <div v-if="sessionStore.loading" class="loader">Loading...</div>
    <div v-else-if="sessionStore.error" class="error">{{ sessionStore.error }}</div>
    <div v-else-if="test" class="test-summary">
      <header class="card-header">
        <h1>{{ test.title }}</h1>
      </header>

      <section class="card-content">
        <div v-if="sessionStatus === 'completed'" class="completed-card">
          <h1>Тест завершён</h1>
          <p>Спасибо за прохождение теста!</p>
        </div>
        <ul v-else class="test-details">
          <li v-if="test.options.description"> {{test.description}} </li>
          <li v-if="test.options.complete_time"> Время на прохождение (ч:м:с) {{test.complete_time}} </li>
          <li v-if="sessionStore.session && test.options.complete_time"> Ваш таймер: {{ formattedTimer }} </li>
          <li><strong>Количество вопросов:</strong> {{ test.question_count }}</li>
        </ul>

        <form v-if="sessionStatus !== 'completed'" @submit.prevent="startTest">
          <div v-if="!sessionStore.session" v-for="(input, index) in test.user_inputs" :key="index" class="input-field">
            <label :for="'input-' + index">{{ input.title }}</label>
            <textarea v-if="input.type === 'textarea'" v-model="userInputs[index]" :required="input.isRequired"></textarea>
            <input v-else v-model="userInputs[index]" :type="input.type" :required="input.isRequired" />
          </div>
          <button type="submit" class="start-button" :disabled="!sessionStore.session && !isFormValid">{{ buttonText }}</button>
        </form>
      </section>
    </div>

    <div v-else class="no-data">No test data available.</div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import {useTestsStore} from "../../../stores/testsStore.js";
import {useSessionStore} from "../../../stores/sessionStore.js";

const testsStore = useTestsStore();
const sessionStore = useSessionStore();
const route = useRoute();
const test = computed(() => testsStore.testPayload);
const token = computed(() => route.query.token);
const buttonText = computed(() => sessionStore.session ? "Продолжить тест" : "Начать тест");
const sessionStatus = computed(() => sessionStore.session?.status);
const userInputs = ref(Array(test.value.user_inputs.length).fill(''));

const isFormValid = computed(() => {
  return test.value.user_inputs.every((input, index) => {
    if (input.isRequired) {
      return userInputs.value[index].trim() !== '';
    }
    return true;
  });
});

const startTest = async () => {
  if (sessionStore.session) {
    await sessionStore.continueTest(token.value);
  } else {
    await sessionStore.startTest(token.value, userInputs.value);
  }
};

// Таймер
const timerInterval = ref(null);
const formattedTimer = ref('00:00:00');

const updateTimer = () => {
  if (sessionStore.session && sessionStore.session.pass_time) {
    const [hours, minutes, seconds] = sessionStore.session.pass_time.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;
    formattedTimer.value = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
    sessionStore.session.pass_time = formattedTimer.value;
  }
};

onMounted(async () => {
  // Fetch session status or any other necessary data
  if (sessionStore.session && test.value.options.complete_time) {
    updateTimer();
    timerInterval.value = setInterval(updateTimer, 1000);
  }
});

watch(() => sessionStore.session, (newSession, oldSession) => {
  if (newSession && test.value.options.complete_time) {
    updateTimer();
    if (!timerInterval.value) {
      timerInterval.value = setInterval(updateTimer, 1000);
    }
  } else {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
});
</script>

<style scoped>
.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5rem;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
}

.card-header h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.card-header p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.card-content {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.test-details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.test-details li {
  margin: 10px 0;
  font-size: 1em;
  text-align: left;
}

.input-field {
  margin-bottom: 15px;
}

.input-field label {
  display: block;
  margin-bottom: 5px;
  font-size: 1em;
  text-align: left;
}

.input-field input,
.input-field textarea {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.start-button {
  padding: 12px 16px;
  font-size: 1em;
  color: #fff;
  background-color: #00c78d;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

footer {
  width: 100%;
}

.start-button:hover {
  background-color: #00b07c;
}

.start-button:disabled {
  background-color: #808080;
  cursor: not-allowed;
}

.loader, .error, .no-data {
  font-size: 1.2em;
  line-height: 1.6;
  text-align: center;
  width: 100%;
}

.test-summary {
  width: 70%;
  height: 100%;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  justify-content: center;
}

.error {
  background-color: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  padding: 10px;
  border-radius: 8px;
}

.completed-card {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
  width: 100%;
}

.completed-card h1 {
  font-size: 1.8em;
}

.completed-card p {
  font-size: 1em;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 15px;
  }

  .card-header h1 {
    font-size: 1.6em;
  }

  .card-header p {
    font-size: 1em;
  }

  .start-button {
    font-size: 0.9em;
  }
}
</style>

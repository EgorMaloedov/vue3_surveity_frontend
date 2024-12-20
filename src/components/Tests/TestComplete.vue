<template>
  <div class="main-page">
    <WelcomeCard v-if="!current_question && test" />
    <QuestionCard v-else-if="test" />
  </div>
</template>

<script setup>
import {useSessionStore} from "../../stores/sessionStore.js";
import WelcomeCard from "./TestComplete/WelcomeCard.vue";
import QuestionCard from "./TestComplete/QuestionCard.vue";
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {useTestsStore} from "../../stores/testsStore.js";

const completeStatus = ref('start');

const route = useRoute();
const token = route.query.token;

const sessionStore = useSessionStore();
const testStore = useTestsStore();

const test = computed(()=> testStore.testPayload)
const current_question = computed(() => sessionStore.currentQuestion);

onMounted(async () => {
  await sessionStore.initSession(token);
  await testStore.getTestSummaryByToken(token);
});
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #21212b;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: center;
  width: 100%;
  height: 80vh;
  max-width: 1000px;
  margin: 20px auto;
}

@media (max-width: 768px) {
  .main-page {
    padding: 15px;
    margin: 15px auto;
  }
}
</style>



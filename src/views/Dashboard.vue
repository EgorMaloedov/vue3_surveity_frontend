<template>
  <PageLayout>
    <div class="test-list">
      <div v-for="test in Array.from(testStore.tests.values())" :key="test.id" class="test-item">
        <div class="test-content">
          <h2>{{ test.title }}</h2>
        </div>
        <button class="analyze-button" @click="analyzeTest(test.id)">Проанализировать</button>
      </div>
    </div>
    <DashboardSession :test="testStore.currentTest" v-if="testStore.currentTest?.sessions" />
  </PageLayout>
</template>

<script setup>
import PageLayout from "../layouts/PageLayout.vue";
import { useTestsStore } from "../stores/testsStore.js";
import { onMounted } from "vue";
import DashboardSession from "../components/DashboardSession.vue";

const testStore = useTestsStore();

onMounted(async () => {
  await testStore.fetchUserTests();
});

const analyzeTest = async (testId) => {
  await testStore.setCurrentTest(testStore.tests.get(testId));
  await testStore.getTestAnswers(testId);
};
</script>

<style scoped>
.test-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #1e1e1e;
  color: #ffffff;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px;
  background-color: #2c2c2c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.test-content {
  flex: 1;
}

.test-content h2 {
  margin-top: 0;
  margin-bottom: 4px;
  color: #ffffff;
  font-size: 1.2em;
}

.analyze-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.analyze-button:hover {
  background-color: #45a049;
}
</style>

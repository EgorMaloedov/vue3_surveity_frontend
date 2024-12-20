<template>
  <div class="createTestWrapper">
    <div class="createTestSteps">
      <TestBasicParameters :test="test" />
      <TestOptions :test="test" />
      <TestQuestions :test="test" />
    </div>
    <button @click="handleCreateTest" class="createTestBtn">Сохранить опрос</button>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useTestsStore} from "../../../../stores/testsStore.js";
import TestBasicParameters from "./TestBasicParameters.vue";
import TestOptions from "./TestOptions.vue";
import TestQuestions from "./TestQuestions.vue";
import {emptyTest, emptySurvey, calculateMinEndDate} from "../constants.js";
import {validateTest} from "../validators.js";
import {v6} from "uuid";
import {useModalStore} from "../../../../stores/modalViewStore.js";

const testsStore = useTestsStore();
const test = ref({...emptyTest});
const modalStore = useModalStore();

const handleCreateTest = async () => {
  await testsStore.createTestWithQuestions(test.value);
  modalStore.closeModal();
};

watch(
    () => test.value.start_date,
    (newStartDate) => {
      if (test.value.end_date <= newStartDate) {
        test.value.end_date = calculateMinEndDate(newStartDate);
        alert("Дата окончания была обновлена.");
      }
    }
);

watch(
    () => test.value.type,
    (newType) => {
      if (newType === 'test') {
        Object.assign(test.value, {...emptyTest, type: 'test'});
      }
      if (newType === 'survey') {
        Object.assign(test.value, {...emptySurvey, type: 'survey'});
      }
    }
);
</script>

<style scoped>
.createTestWrapper {
  width: 45vw;
  max-height: 60vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.createTestWrapper::-webkit-scrollbar {
  display: none;
}

.createTestWrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

.createTestSteps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.createTestSteps > * {
  width: 100%;
}

.createTestBtn {
  background-color: #44475a;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: center;
}

.createTestBtn:hover {
  background-color: #363848;
}
</style>

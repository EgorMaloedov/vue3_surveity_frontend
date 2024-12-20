<template>
  <div class="updateTestWrapper">
    <div class="updateTestSteps">
      <TestBasicParameters :test="test" />
      <TestOptions :test="test" />
      <TestQuestions :test="test" />
    </div>
    <button @click="handleUpdateTest" class="updateTestBtn">Сохранить опрос</button>
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
const test = ref(testsStore.currentTest);
const modalStore = useModalStore();

const handleUpdateTest = async () => {
  await testsStore.updateTestWithQuestions(test.value);
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
.updateTestWrapper {
  width: 45vw;
  max-height: 60vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.updateTestWrapper::-webkit-scrollbar {
  display: none;
}

.updateTestWrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

.updateTestSteps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.updateTestSteps > * {
  width: 100%;
}

.updateTestBtn {
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

.updateTestBtn:hover {
  background-color: #363848;
}
</style>

<template>
  <div class="step-group">
    <draggable
        v-model="test.questions"
        :itemKey="test.id"
        class="draggable-list"
        @start="onStart"
        @end="onEnd"
    >
      <template #item="{ element, index }">
        <div class="draggable-item" :class="{ 'dragging': isDragging }">
          <Question
              v-show="!element?.deleted"
              @updateQuestion="updateQuestion(index, $event)"
              @deleteQuestion="deleteQuestion(index)"
              :key="element.id"
              :count="index + 1"
              :question="element"
          />
        </div>
      </template>
    </draggable>

    <button class="addQuestionBtn" @click="handleAddQuestion">+ Добавить вопрос</button>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import draggable from "vuedraggable";
import Question from "../elements/Question.vue";
import { emptyTestQuestion } from "../constants.js";
import { v6 } from "uuid";

const props = defineProps({
  test: Object
});

const isDragging = ref(false);

const handleAddQuestion = () => {
  props.test.questions.push({ ...emptyTestQuestion, id: v6() });
  updateQuestionsOrder();
};

const updateQuestionsOrder = () => {
  let currentOrder = 1;

  props.test.questions.forEach((question) => {
    if (question?.deleted) {
      question.order = -1;
    } else {
      question.order = currentOrder;
      currentOrder++;
    }
  });
};

const updateQuestion = (index, { question }) => {
  props.test.questions[index] = { ...question, order: index + 1};
};

const deleteQuestion = (index) => {
  props.test.questions[index].deleted = true;
  updateQuestionsOrder();
};

const onStart = () => {
  isDragging.value = true;
};

const onEnd = () => {
  isDragging.value = false;
  updateQuestionsOrder();
};
</script>

<style scoped>
.draggable-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.draggable-item {
  width: 100%;
  box-sizing: border-box;
  background-color: #2c2f3f;
  padding: 1rem;
  cursor: grab;
  border-radius: 4px;
  color: #c9d1d9;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.draggable-item.dragging {
  background-color: #3c404a;
  transform: scale(1.05);
}

.addQuestionBtn {
  background-color: #00c78d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: center;
}

.addQuestionBtn:hover {
  background-color: #00a472;
}
</style>

<template>
  <div class="question-content">
    <div class="question-header">
      <h2>{{ question.text }}</h2>
    </div>
    <div class="question-options">
      <div v-if="question.type === 'single'">
        <div
            v-for="answer in question.answers"
            :key="answer.id"
            class="answer-option"
        >
          <input
              type="radio"
              :id="answer.id"
              :value="answer.id"
              :checked="localModelValue === answer.id"
              @change="updateModelValue(answer.id)"
          />
          <label :for="answer.id">{{ answer.text }}</label>
        </div>
      </div>
      <div v-else-if="question.type === 'multiple'">
        <div
            v-for="answer in question.answers"
            :key="answer.id"
            class="answer-option"
        >
          <input
              type="checkbox"
              :id="answer.id"
              :value="answer.id"
              :checked="localModelValue.includes(answer.id)"
              @change="updateMultipleModelValue(answer.id)"
          />
          <label :for="answer.id">{{ answer.text }}</label>
        </div>
      </div>
      <div v-else-if="question.type === 'text'">
        <textarea
            v-model="localModelValue"
            @input="updateModelValue(localModelValue)"
            class="text-area"
        ></textarea>
      </div>
    </div>
    <button
        class="next-button"
        @click="$emit('submit')"
        :disabled="!localModelValue || (question.type === 'multiple' && localModelValue.length === 0)"
    >
      {{ question.isLast ? "Завершить" : "Next" }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  question: Object,
  modelValue: {
    type: [String, Number, Array, null],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const localModelValue = ref([]);

onMounted(() => {
  initializeLocalModelValue();
});

watch(() => props.modelValue, (newVal) => {
  localModelValue.value = newVal;
  initializeLocalModelValue();
});

const initializeLocalModelValue = () => {
  if (props.question.type === 'multiple' && !Array.isArray(localModelValue.value)) {
    localModelValue.value = [];
  } else if (props.question.type === 'single' && localModelValue.value === null) {
    localModelValue.value = '';
  } else if (props.question.type === 'text' && localModelValue.value === null) {
    localModelValue.value = '';
  }
};

const updateModelValue = (value) => {
  localModelValue.value = value;
  emit('update:modelValue', value);
};

const updateMultipleModelValue = (answerId) => {
  const newValue = [...localModelValue.value];
  if (newValue.includes(answerId)) {
    newValue.splice(newValue.indexOf(answerId), 1);
  } else {
    newValue.push(answerId);
  }
  updateModelValue(newValue);
};
</script>

<style scoped>
.question-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.question-header h2 {
  font-size: 1.6em;
  text-align: center;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-option input {
  accent-color: #00c78d;
}

.text-area {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
}

.next-button {
  padding: 12px 16px;
  font-size: 1em;
  font-weight: bold;
  color: #fff;
  background: #00c78d;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  transition: all 0.3s ease;
}

.next-button:hover {
  background-color: #00b07c;
}

.next-button:disabled {
  background-color: #808080;
  cursor: not-allowed;
}
</style>

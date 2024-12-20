<template>
  <div class="removeTestModal">
    <h1>Вы уверены?</h1>
    <span class="agreeButtons">
      <button @click="handleRemoveTest" class="agreementBtn access">Да</button>
      <button @click="handleCloseModal" class="agreementBtn deny">Нет</button>
    </span>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useTestsStore} from "../../../stores/testsStore.js";
import {useModalStore} from "../../../stores/modalViewStore.js";
const modalStore = useModalStore();

const testsStore = useTestsStore();
const emit = defineEmits(['update:modalValue']);

const tests = computed(() => testsStore.currentTest);

const handleRemoveTest = async () => {
  if (tests.value) {
    await testsStore.removeTest(tests.value.id);
  }
  modalStore.closeModal()
};


const handleCloseModal = async () => {
    modalStore.closeModal()
};

</script>

<style scoped>
.removeTestModal {
  width: 20vw;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #21212B;
}

.agreeButtons {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.agreementBtn {
  margin-top: 2rem;
  cursor: pointer;
  width: 30%;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #828288;
  text-align: right;
  transition: color 0.2s ease;
}

.access:hover {
  font-weight: bold;
  color: #51ff66;
}

.deny:hover {
  font-weight: bold;
  color: #ff5151;
}
</style>

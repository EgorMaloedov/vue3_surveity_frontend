<template>
  <div class="emptySurveysWrapper">
    Давайте <span @click="openModal" id="createSurvey">добавим</span> <br> новый опрос!
  </div>
</template>

<script setup>
import {markRaw} from "vue";
import CreateTestsModal from "../../ModalViews/TestModalViews/CreateTestModal/CreateTestsModal.vue";
import {useModalStore} from "../../../stores/modalViewStore.js";
const modalStore = useModalStore()

const openModal = () => {
  modalStore.openModal(markRaw(CreateTestsModal), 'default', 'Создать опрос', '', true);
};
</script>

<style scoped>
#createSurvey{
  color: #01AB80;
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

#createSurvey:hover{
  opacity: 1;
}

.emptySurveysWrapper{
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
}

</style>
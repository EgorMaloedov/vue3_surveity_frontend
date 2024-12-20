<template>
  <div
      class="tests-item"
      :class="{ active: openStatus }"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
  >
    <div class="item-content">
      <div id="testsTitle">
        <img src="../../../assets/media/testsListItem/testTitle.svg" alt="Test Icon" v-if="test.type === 'test'" />
        <img src="../../../assets/media/testsListItem/surveyTitle.svg" alt="Survey Icon" v-else />

        <span>{{test.title}}</span>
      </div>
      <img
          class="menuArrow"
          @click="toggleMenu"
          :class="{ rotated: openStatus }"
          src="../../../assets/media/testsListItem/testItemArrow.svg"
          alt="Survey arrow"
      />
    </div>
    <transition
        name="smooth-height"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
    >
      <div v-if="openStatus" class="item-menu">
        <div class="menu-content">
          <div class="left">
            <span @click="shareTest">
              <img src="../../../assets/media/testsListItem/linnk.svg" alt="Survey Icon" />
              <span>Поделиться опросом</span>
            </span>
            <span @click="updateTest">
              <img src="../../../assets/media/testsListItem/changeSurveyIcon.svg" alt="Survey Icon" />
              <span>Редактировать {{test.type === 'test' ? ' тест' : ' опрос'}}</span>
            </span>
            <span @click="removeTest">
              <img src="../../../assets/media/testsListItem/removeSurveyIcon.svg" alt="Survey Icon" />
              <span>Удалить {{test.type === 'test' ? ' тест' : ' опрос'}}</span>
            </span>
          </div>
          <div class="right">
            <span @click="analizeTest">
              <span>Перейти к анализу</span>
              <img src="../../../assets/media/testsListItem/testDashboardIcon.svg" alt="Survey Icon" />
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, markRaw } from 'vue';
import {useTestsStore} from "../../../stores/testsStore.js";
import {useModalStore} from "../../../stores/modalViewStore.js";
import RemoveTestsModal from "../../ModalViews/TestModalViews/RemoveTestsModal.vue";
import UpdateTestModal from "../../ModalViews/TestModalViews/UpdateTestModal/UpdateTestModal.vue";
import LinkSurveyModal from "../../ModalViews/TestModalViews/LinkSurveyModal.vue";
import router from "../../../router.js";

// Define props
const props = defineProps({
  test: Object,
});

// Access store
const testsStore = useTestsStore();
const modalStore = useModalStore();

// Reactive properties
const openStatus = ref(false);
const hovered = ref(false);

// Toggle the menu
const toggleMenu = () => {
  openStatus.value = !openStatus.value;
};

// Open the change tests modal
const updateTest = async () => {
  await testsStore.setCurrentTest(props.test);
  modalStore.openModal(markRaw(UpdateTestModal), 'default', `Редактировать ${props.test.type === 'test' ? ' тест' : ' опрос'}`)
};

// Open the remove tests modal
const removeTest = async () => {
  await testsStore.setCurrentTest(props.test);
  modalStore.openModal(markRaw(RemoveTestsModal), 'warning',  `Удалить ${props.test.type === 'test' ? ' тест' : ' опрос'}`, ' ')
};

// Open the remove tests modal
const analizeTest = async () => {
  await testsStore.setCurrentTest(props.test);
  router.push('/dashboard')
};

const shareTest = async () => {
  await testsStore.setCurrentTest(props.test);
  modalStore.openModal(markRaw(LinkSurveyModal), 'default', `Ссылки на тест`)
};

// Before enter transition
const beforeEnter = (el) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

// Enter transition
const enter = (el) => {
  el.style.height = el.scrollHeight + 'px';
  el.style.opacity = '1';
  el.style.transition = 'height 0.4s ease, opacity 0.4s ease';
};

// Leave transition
const leave = (el) => {
  el.style.height = '0';
  el.style.opacity = '0';
  el.style.transition = 'height 0.4s ease, opacity 0.4s ease';
};

</script>

<style scoped>
.tests-item {
  width: 100%;
  background: #272732;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 0.3rem;
  transition: opacity 0.3s ease;
  opacity: 0.5; /* By default, semi-transparent */
}

.tests-item:hover,
.tests-item.active {
  opacity: 1; /* Fully visible when open or hovered */
}

.item-content {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

#testsTitle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

#testsTitle img {
  height: 2.8rem;
}

/* Arrow icon */
.menuArrow {
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: rotate(180deg);
  opacity: 0.8; /* Slightly transparent by default */
}

.menuArrow:hover {
  opacity: 1; /* Fully visible when hovered */
}

.menuArrow.rotated {
  transform: rotate(0); /* Arrow rotated when open */
}

.item-menu {
  background-color: #21212b;
  overflow: hidden; /* Important for height animation */
}

.left,
.right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.menu-content {
  color: #828288;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  box-sizing: border-box;
  font-size: 0.6rem;
}

.menu-content span {
  cursor: pointer;
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 0.2s ease;
}

.menu-content span:hover {
  color: #fff;
}

.menu-content img {
  height: 0.8rem;
}
</style>

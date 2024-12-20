<template>
  <transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="!modalStore.disableCloseOnOverlay ? closeModal : () => {}">
      <div :class="['modal-content', modalType]" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button class="modal-close" @click="closeModal" aria-label="Close">×</button>

        <div class="modalInfo" v-if="modalType === 'warning'">
          <span id="modalTitle" class="modal-title">{{ title || 'Предупреждение' }}</span>
          <span class="modal-description">{{ description || 'Вы уверены, что хотите продолжить?' }}</span>
        </div>
        <div class="modalInfo" v-if="modalType === 'confirmation'">
          <span id="modalTitle" class="modal-title">{{ title || 'Подтверждение' }}</span>
          <span class="modal-description">{{ description || 'Пожалуйста, подтвердите ваше действие.' }}</span>
        </div>
        <div class="modalInfo" v-if="modalType === 'notification'">
          <span id="modalTitle" class="modal-title">{{ title || 'Уведомление' }}</span>
          <span class="modal-description">{{ description || 'Это уведомление о важном событии.' }}</span>
        </div>

        <div class="modalInfo" v-if="modalType === 'default' && (title || description)">
          <span v-if="title" id="modalTitle" class="modal-title">{{ title || 'Уведомление' }}</span>
          <span v-if="description" class="modal-description">{{ description || 'Это уведомление о важном событии.' }}</span>
        </div>

        <!-- Слот для пользовательского контента -->
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useModalStore } from "../../stores/modalViewStore.js";
import {useTestsStore} from "../../stores/testsStore.js"; // Путь к вашему стору

// Локальное состояние модального окна
const modalStore = useModalStore();
const isOpen = ref(false);
const modalType = ref(''); // Добавляем состояние для типа модального окна
const title = ref(''); // Пропс для заголовка
const description = ref(''); // Пропс для описания

// Следим за изменением состояния модального окна в хранилище
watch(
    () => modalStore.isModalOpened,
    (newValue) => {
      isOpen.value = newValue; // Обновляем локальное состояние
    },
    { immediate: true } // Убедимся, что локальное состояние синхронизируется при загрузке
);

watch(
    () => modalStore.modalType,
    (newValue) => {
      modalType.value = newValue; // Обновляем локальное состояние типа
    },
    { immediate: true } // Убедимся, что локальное состояние синхронизируется при загрузке
);

// Следим за изменением типа модального окна в хранилище
watch(
    () => modalStore.modalTitle,
    (newValue) => {
      title.value = newValue; // Обновляем локальное состояние типа
    },
    { immediate: true } // Убедимся, что локальное состояние синхронизируется при загрузке
);

watch(
    () => modalStore.modalDescription,
    (newValue) => {
      description.value = newValue; // Обновляем локальное состояние типа
    },
    { immediate: true } // Убедимся, что локальное состояние синхронизируется при загрузке
);

// Закрытие модального окна
const closeModal = () => {
  const testStore = useTestsStore()
  modalStore.closeModal(testStore.setCurrentTest, null);
};
</script>

<style scoped>
/* Плавное затемнение фона */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalInfo{
  width: 100%;
  text-align: left;
  margin-bottom: 2rem;
}

/* Модальное содержимое */
.modal-content {
  background: #21212B; /* Темный фон */
  border-radius: 12px;
  padding: 1rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: #ffffff; /* Белый текст */

}

/* Кнопка закрытия */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1rem;
  background: none;
  border: none;
  color: #828288; /* Темный серый цвет */
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #ffffff; /* Белый при наведении */
}

/* Анимация появления и исчезновения фона */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Анимация масштаба содержимого */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
  opacity: 1;
}

/* Стили для различных типов модальных окон */
.modal-content.warning {
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.5); /* Оранжевый цвет для предупреждения */
}

.modal-content.confirmation {
  box-shadow: 0 10px 30px rgba(0, 128, 0, 0.5); /* Зеленый цвет для подтверждения */
}

.modal-content.notification {
  box-shadow: 0 10px 30px rgba(0, 0, 255, 0.5); /* Синий цвет для уведомления */
}

/* Заголовок и описание */
.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  color: #ffffff;
}

.modal-description {
  font-size: 0.8rem;
  color: #d1d1d1; /* Светло-серый цвет для описания */
  line-height: 1.5;
  text-align: left;
}
</style>

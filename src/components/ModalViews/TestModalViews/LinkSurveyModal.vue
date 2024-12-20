<template>
  <div class="createSurveyWrapper">
    <span id="title">Поделиться опросом</span>

    <div class="createSurveySteps">
      <!-- Ссылки на Telegram и Web -->
      <div class="testsLinkSection">
        <span class="sectionTitle" :class="telegramLinkColorClass">Telegram: {{currentTest.tgLink ? ` действителен до ${tgExpiredAt}` : ''}}</span>
        <div class="linkContainer">
          <input
              type="text"
              :value="testsLinks.telegramLink || ''"
              :placeholder="currentTest.tgLink ? 'Ссылка на Telegram' : 'Сгенерировать ссылку'"
              readonly
              class="linkText"
          />
          <button @click="copyToClipboard(testsLinks.telegramLink)" class="copyButton">
            <img src="../../../assets/media/copy.svg" alt="Copy" class="copyIcon" />
          </button>
        </div>
        <div class="expirationContainer">
          <label for="telegramExpiration">Срок жизни ссылки (в часах):</label>
          <input type="number" v-model="telegramExpiration" id="telegramExpiration" class="expirationInput" />
        </div>
        <div class="linkBtns">
          <button @click="generateTelegramLink" class="generateButton">Сгенерировать ссылку</button>
          <button @click="closeTelegramLink" class="closeButton">Закрыть ссылку</button>
        </div>
      </div>

      <div class="testsLinkSection">
        <span class="sectionTitle" :class="webLinkColorClass">Web: {{currentTest.webLink ? ` действителен до ${webExpiredAt}` : ''}}</span>
        <div class="linkContainer">
          <input
              type="text"
              :value="testsLinks.webLink || ''"
              :placeholder="currentTest.webLink ? 'Ссылка на Web' : 'Сгенерировать ссылку'"
              readonly
              class="linkText"
          />
          <button @click="copyToClipboard(testsLinks.webLink)" class="copyButton">
            <img src="../../../assets/media/copy.svg" alt="Copy" class="copyIcon" />
          </button>
        </div>
        <div class="expirationContainer">
          <label for="webExpiration">Срок жизни ссылки (в часах):</label>
          <input type="number" v-model="webExpiration" id="webExpiration" class="expirationInput" />
        </div>
        <div class="linkBtns">
          <button @click="generateWebLink" class="generateButton">Сгенерировать ссылку</button>
          <button @click="closeWebLink" class="closeButton">Закрыть ссылку</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useTestsStore } from "../../../stores/testsStore.js";
import {jwtDecode} from "jwt-decode";

const testsStore = useTestsStore();
const currentTest = computed(() => testsStore.currentTest);

const tgExpiredAt = computed(()=>{
  if (testsLinks.value.telegramLink){
    const t = testsLinks.value.telegramLink.split('start=')[1]
    return new Date(jwtDecode(t).exp * 1000).toISOString();
  }
})

const webExpiredAt = computed(()=>{
  if (testsLinks.value.webLink){
    const t = testsLinks.value.webLink.split('token=')[1]
    return new Date(jwtDecode(t).exp * 1000).toISOString();
  }
})

const testsLinks = computed(() => {
  return {
    telegramLink: currentTest.value?.tgLink,
    webLink: currentTest.value?.webLink
  };
});

const telegramExpiration = ref(null);
const webExpiration = ref(null);

const generateTelegramLink = async () => {
  await testsStore.generateTestLink('telegram', telegramExpiration.value);
};

const generateWebLink = async () => {
  await testsStore.generateTestLink('web', webExpiration.value);
};

const closeWebLink = async () => {
  await testsStore.closeTestLink('web');
};

const closeTelegramLink = async () => {
  await testsStore.closeTestLink('telegram');
};

// Метод для копирования в буфер обмена
const copyToClipboard = (link) => {
  if (link) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Ссылка скопирована в буфер обмена!');
    }).catch(err => {
      console.error('Ошибка при копировании:', err);
    });
  }
};

// Computed properties for determining the color class
const telegramLinkColorClass = computed(() => {
  if (!tgExpiredAt.value) return '';
  const now = new Date();
  const expirationDate = new Date(tgExpiredAt.value);
  const timeDiff = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60); // in hours
  console.log(expirationDate)
  if (timeDiff < 0) return 'expired';
  if (timeDiff < 2) return 'warning';
  return '';
});

const webLinkColorClass = computed(() => {
  if (!webExpiredAt.value) return '';
  const now = new Date();
  const expirationDate = new Date(webExpiredAt.value);
  const timeDiff = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60); // in hours
  if (timeDiff < 0) return 'expired';
  if (timeDiff < 2) return 'warning';
  return '';
});
</script>

<style scoped>
.createSurveyWrapper {
  width: 40vw;
  max-height: 70vh;
  overflow-y: auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  border-radius: 0.5rem;
  background-color: #21212B;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.createSurveyWrapper::-webkit-scrollbar {
  display: none;
}

.createSurveyWrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-align: center;
}

.createSurveySteps {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  width: 100%;
}

.linkBtns{
  display: flex;
  flex-direction: row;
  gap: 1.8rem;
}

.testsLinkSection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.sectionTitle {
  text-align: left;
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffffff;
}

.sectionTitle.warning {
  color: yellow;
}

.sectionTitle.expired {
  color: red;
}

.linkContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.linkText {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copyButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.copyIcon {
  width: 1.5rem;
  height: 1.5rem;
  filter: invert(1); /* Иконка белого цвета */
}

.copyButton:hover {
  transform: scale(1.2);
}

.closeButton {
  cursor: pointer;
  background: #d81212;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.closeButton:hover {
  transform: scale(1.05);
  background: #f31414;
}

.generateButton {
  cursor: pointer;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.generateButton:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #45a049, #4CAF50);
}

.expirationContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.expirationInput {
  padding: 0.5rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #333333;
}
</style>

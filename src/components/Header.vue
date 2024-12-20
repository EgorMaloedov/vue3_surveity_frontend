<template>
  <header>
    <div class="left">
      <img id="logo-left" src="../assets/media/testsListItem/logo.svg" alt="Surveity logo">
      <nav class="headerNavigation">
        <RouterLink v-for="link in routerLinks" :key="link.path" :to="link.path">
          {{ link.name }}
        </RouterLink>
      </nav>
    </div>
    <div class="right" @click="toggleMenu">
      <img id="logo-right" src="../assets/media/header/account.svg" alt="Surveity logo">
      <div v-if="isMenuVisible" class="dropdown-menu">
        <div class="dropdown-item" @click="logout">Выйти</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {RouterLink} from 'vue-router';
import {useAuthStore} from "../stores/authStore.js";
import router from "../router.js";

const routerLinks = ref([
  {name: "Мои опросы", path: "/"},
  {name: "Дашборд", path: "/dashboard"},
]);

const isMenuVisible = ref(false);
const authStore = useAuthStore();

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const logout = () => {
  authStore.logout();
  isMenuVisible.value = false;
  router.push("/preview");
};

const handleClickOutside = (event) => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const accountIcon = document.querySelector('.right');
  if (dropdownMenu && !dropdownMenu.contains(event.target) && !accountIcon.contains(event.target)) {
    isMenuVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
header {
  height: 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

a {
  font-size: 0.7rem;
}

.headerNavigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 3rem;
}

.left, .right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3rem;
  height: 100%;
  justify-content: center;
}

.right {
  height: 50%;
  position: relative;
}

#logo-left, #logo-right {
  height: 100%;
}

.dropdown-menu {
  position: absolute;
  top: 150%;
  right: 0;
  background-color: #21212b;
  border: none;
  opacity: 0.7;
  transition: opacity 0.3s;
}

#logo-right{
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

#logo-right:hover{
  opacity: 1;
}

.dropdown-menu:hover {
  opacity: 1;
}

.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  opacity: 1;
}
</style>

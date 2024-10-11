<template>
    <div class="min-h-screen flex flex-col items-center justify-start overflow-hidden relative gap-48 select-none">
        <img class="w-[146px] sm:w-[180px] lg:w-[246px] mt-16" src="../assets/media/logo.svg" alt="Logotype">
        <div class="flex flex-col gap-10 justify-center content-center">
            <div class="text-5xl lg:text-8xl sm:text-6xl">Проведи <b>Опрос</b> <br> за пару кликов <br></div>
            <div class="text-sm sm:text-base lg:text-3xl ">
                <router-link class="text-primary hover:text-primaryHover" :to="{ path: '/auth', query: { type: 'login' } }">войти</router-link>
                <span> / </span>
                <router-link class="text-primary hover:text-primaryHover" :to="{ path: '/auth', query: { type: 'register' } }">зарегестрироваться</router-link>
            </div>
        </div>
        <img class="animate-spin-slow" src="../assets/media/previewCircle.svg" alt="Circle">
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>


<style scoped>
@keyframes spin {
    from {
        transform: translateY(50%) rotate(0deg);
    }

    to {
        transform: translateY(50%) rotate(360deg);
    }
}

.animate-spin-slow {
    opacity: 0.3;
    position: absolute;
    bottom: 0;
    transform: translateY(50%) rotate(0deg);
    animation: spin 90s linear infinite;
    transition: opacity 3s;
    cursor: pointer;
}

.animate-spin-slow:hover {
    opacity: 1;
}

</style>

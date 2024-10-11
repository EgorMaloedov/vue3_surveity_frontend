<template>
    <div class="min-h-screen w-1/4 flex flex-col items-center justify-start overflow-hidden relative gap-48">
        <img class="w-[146px] sm:w-[180px] lg:w-[246px] mt-16" src="../assets/media/logo.svg" alt="Logotype">
        <AuthForm/>
    </div>
</template>

<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue';

</script>

<style scoped></style>

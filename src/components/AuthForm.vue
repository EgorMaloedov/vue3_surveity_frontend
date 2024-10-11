<template>
    <div class="w-full flex flex-col items-start gap-12 text-lg">

        <input placeholder="Почта:" v-model="email"
            class="h-10 w-full bg-transparent focus:outline-none focus:ring-0 focus:border-b-2 focus:border-white border-b-2 border-b-gray-400 opacity-80"
            type="email">
        <input placeholder="Пароль:" v-model="password"
            class="h-10 w-full bg-transparent focus:outline-none focus:ring-0 focus:border-b-2 focus:border-white border-b-2 border-b-gray-400 opacity-80"
            type="password">

        <div class="w-full flex flex-row items-start">
            <button @click="login(email, password)"
                class="bg-gradient-to-r from-emerald-300 to-emerald-900 opacity-80 rounded hover:opacity-100 h-12 w-3/4 font-bold"
                :class="{'opacity-50 cursor-not-allowed': !isBtnAllowed}"
                v-if="isLogin" :disabled="!isBtnAllowed">
                Войти
            </button>

            <button @click="register(email, password)"
                class="bg-gradient-to-r from-emerald-300 to-emerald-900 opacity-80 rounded hover:opacity-100 h-12 w-3/4 font-bold"
                :class="{'opacity-50 cursor-not-allowed': !isBtnAllowed}"
                v-else-if="isRegistration" :disabled="!isBtnAllowed">
                Зарегестрироваться
            </button>
        </div>

        <span v-if="isLogin" class="text-base">
            нет аккаунта? <router-link class="text-primary hover:text-primaryHover"
                :to="{ path: '/auth', query: { type: 'register' } }">Зарегестрироваться</router-link>
        </span>
        <span v-else-if="isRegistration" class="text-base">
            уже есть аккаунт? <router-link class="text-primary hover:text-primaryHover"
                :to="{ path: '/auth', query: { type: 'login' } }">Войти</router-link>
        </span>
    </div>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { router } from '../routes';

const emits = defineEmits(['login', 'register'])

const route = useRoute()
const actionType = computed(() => route.query.type)

const email = ref('')
const password = ref('')

const register = async (email: string, password: string) => {
    router.replace('/')
}

const login = async (email: string, password: string) => {
    router.replace('/')
}

const isBtnAllowed = computed(()=> email.value && password.value)

const isRegistration = computed(() => actionType.value == 'register' ? true : false)
const isLogin = computed(() => actionType.value == 'login' ? true : false)

</script>

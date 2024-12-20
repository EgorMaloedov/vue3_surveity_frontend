<template>
  <form class="form-container" @submit.prevent="handleSubmit">
    <InputField
        v-model="email"
        id="email"
        name="email"
        placeholder="Почта"
        autocomplete="email"
        :error="errors.email"
    />
    <InputField
        v-model="password"
        id="password"
        name="password"
        type="password"
        placeholder="Пароль"
        autocomplete="new-password"
        :error="errors.password"
    />
    <SubmitButton :loading="loading" label="Зарегистрироваться" />
    <ErrorMessage v-if="authStore.authError" :message="authStore.authError" class="server-error" />
  </form>
</template>

<script setup>
import {computed, ref} from 'vue';
import { useAuthStore} from "../../stores/authStore.js";
import router from "../../router.js";
import InputField from "./elements/InputField.vue";
import ErrorMessage from "./elements/ErrorMessage.vue";
import SubmitButton from "./elements/SubmitButton.vue";

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errors = ref({});
const serverError = computed(()=> authStore.authError);
const loading = computed(()=> authStore.isLoading);

const validate = () => {
  errors.value = {};

  if (!email.value) {
    errors.value.email = 'Введите почту.';
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
    errors.value.email = 'Некорректный формат почты.';
  }

  if (!password.value) {
    errors.value.password = 'Введите пароль.';
  } else if (password.value.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов.';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  authStore.clearError();
  if (!validate()) return;
  await authStore.register(email.value, password.value);
  if (!serverError.value) {
    await router.push('/preview');
  }
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  padding: 2rem;
  margin: 0 auto;
  border-radius: 0.5rem;
}

.server-error {
  margin-top: 10px;
}
</style>

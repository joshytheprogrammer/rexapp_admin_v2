<template>
  <div class="block w-full mx-auto bg-gray-100 px-4 sm:px-8 md:px-8 lg:px-18 py-4">
    <va-form
      class="flex flex-col justify-center gap-6 mx-auto w-11/12 md:w-1/2 lg:w-1/3 bg-white p-8 rounded-xl lg:shadow-lg" 
      tag="form"
      ref="myForm"
      @submit.prevent="login"
    >
    <va-progress-bar v-show="isLoading" indeterminate />
      <h2 class="my-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Welcome back 👋</h2>

      <va-input
        v-model="email"
        label="Email"
      />

      <va-input
        v-model="password"
        class="mt-3"
        type="password"
        label="Password"
      />

      <va-button
        type="submit"
        :loading="isLoading" 
        :disabled="isLoading"
        class="mt-3"
      >
        Login
      </va-button>
    </va-form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "guest",
});

import { useToast } from 'vuestic-ui';
import { useAuthStore } from "@/store/auth";

const { init } = useToast();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

let isLoading = ref(false)
let errorMessage = ref('');

async function login() {
  isLoading.value = true;

  const { data, error } = await useFetch('/auth/login', {
    baseURL: useRuntimeConfig().public.baseURL,
    method: "POST",
    body: {"email": email.value, "password": password.value},
    credentials: 'include'
  });

  if (error.value) {
    errorMessage.value = error.value.data?.message || "Login attempt failed.";

    init({message: errorMessage.value, color: "danger"})
    isLoading.value = false;
  }

  if(!data.value) {
    isLoading.value = false;
    return;
  }

  authStore.setToken(data.value.token)
  
  isLoading.value = false;
}
</script>
<template>
  <va-inner-loading :loading="isLoading">
    <va-progress-circle class="text-center mx-auto" v-if="pending" indeterminate />
    <form @submit.prevent="submit" class="flex flex-col justify-center space-y-4 mx-4">
      <va-input
        v-model="category.name"
        placeholder="Enter the name of the product"
        label="Name"
        required-mark
      />
      <va-textarea
        v-model="category.description"
        :max-length="125"
        label="Description"
        placeholder="String keywords into a sentence. Helps in search..."
        counter
        required-mark
        :rules="[
          (v) => v && v.length > 0 || 'Required',
          (v) => v && v.length < 125,
        ]"
      />
      <va-button type="submit" >Update</va-button>
    </form>
  </va-inner-loading>
</template>

<script setup>
import { useToast } from 'vuestic-ui';
const props = defineProps(['id', 'token']);

const { init } = useToast();

let isLoading = ref(false);

const { data, pending } = await useFetch(() => `/view/categories/byId/${props.id}`, {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+props.token,
  },
});

const category = ref(data.value.category);

async function submit() {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/edit/category/byId', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: {category},
      headers: {
        Authorization: 'Bearer '+props.token,
      },
      credentials: 'include'
    });
    
    if (error.value) {
      throw new Error(error.value)
    }

    if(!data.value) {
      return;
    }

    init({message: data.value.message, color: "success"});
  } catch (error) {
    init({message: "An error occurred", color: "danger"});
  } finally {
    reloadNuxtApp();
    isLoading.value = false;
  }
  
}

</script>

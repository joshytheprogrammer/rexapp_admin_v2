<template>
  <va-inner-loading :loading="isLoading">
    <va-progress-circle class="text-center mx-auto" v-if="pending" indeterminate />
    <form @submit.prevent="submit" class="flex flex-col justify-center space-y-4 ">
      <va-input
        v-model="product.name"
        placeholder="Enter the name of the product"
        label="Name"
        required-mark
      />
      <va-input
        v-model="product.partNumber"
        placeholder="Provide the products unique part number"
        label="Part Number"
      />
      <va-input
        v-model="product.specification"
        placeholder="Provide the products specification"
        label="Specification"
      />
      <va-input
        required-mark
        v-model="product.min_price"
        label="Min Price"
      />
      <va-input
        required-mark
        v-model="product.max_price"
        label="Max Price"
      />
      <va-textarea
        v-model="product.description"
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
const emits = defineEmits(['close'])

const { init } = useToast();

let isLoading = ref(false);

const { data, pending } = await useFetch(() => `/view/products/byId/${props.id}`, {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+props.token,
  },
});

const product = ref(data.value.product);

async function submit() {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/edit/product/byId', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: {product},
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
    init({message: 'Reload page to see changes', color: "success"});
    emits('close');
  } catch (error) {
    init({message: "An error occurred", color: "danger"});
  } finally {
    // reloadNuxtApp();
    isLoading.value = false;
  }
  
}

</script>

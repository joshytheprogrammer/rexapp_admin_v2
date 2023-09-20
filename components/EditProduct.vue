<template>
  <va-inner-loading :loading="isLoading">
    <form @submit.prevent="submit" class="flex flex-col justify-center space-y-4 mx-4">
      <va-input
        v-model="product.name"
        placeholder="Enter the name of the product"
        label="Name"
        @blur="generateSlug"
        required-mark
      />
      <!-- <va-select
        v-model="product.manufacturer"
        label="Manufacturer"
        :options="manufacturer"
        placeholder="Select an option"
        searchable
        required-mark
      /> -->
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
        v-model="product.price.min"
        label="Min Price"
      />
      <va-input
        required-mark
        v-model="product.price.max"
        label="Max Price"
      />
      <va-textarea
        v-model="product.description"
        max-length="125"
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

const manufacturer = [
  "Toyota",
  "Honda",
  "Ford",
  "Nissan",
  "Hyundai",
  "Kia",
  "Volkswagen",
  "Mercedes Benz",
  "BMW",
  "Audi",
  "Land Rover",
  "Chevrolet",
  "Peugeot",
  "Subaru",
  "Mitsubishi",
  "Lexus",
  "Infiniti",
  "Jaguar",
  "Renault",
  "Suzuki",
  "Jeep",
  "Dodge",
  "Acura",
  "GMC",
  "Chrysler",
  "RAM",
  "Fiat",
  "Alfa Romeo",
  "Mini",
  "Volvo",
  "Skoda",
  "Porsche",
  "Maserati",
  "Rolls-Royce",
  "Bentley",
  "Aston Martin",
  "Lamborghini",
  "Bugatti",
  "Tesla",
  "McLaren",
  "Citroën",
  "DAF",
  "Daewoo",
  "Foton",
  "Geely",
  "Higer",
  "JAC",
  "Mahindra",
  "Tata",
  "Zotye",
  "Innoson"
];

const { data } = await useFetch(() => `/view/products/byId/${props.id}`, {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    authorization: props.token,
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
        authorization: props.token,
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

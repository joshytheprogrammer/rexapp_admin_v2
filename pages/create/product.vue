<template>
  <va-inner-loading :loading="isLoading">
    <va-stepper
      v-model="step"
      :steps="steps"
      @finish="submit"
    >
      <template #step-content-0>
        <div class="space-y-6 py-4 px-6 mx-auto shadow-lg rounded-md w-fit">
          <div class="">
            <va-select
              v-model="uploadMode"
              label="Image Mode"
              :options="uploadTypes"
              :text-by="(option) => option.text"
              :value-by="(option) => option.value"
              required-mark
            />
          </div>
          <div class="">
            <va-input
              v-model="product.imageURL"
              :rules="
              [(v) => (v && v.length > 0) || 'Image URL is required']
              "
              type="url"
              label="Image Link"
              placeholder="https://images.joshytheprogrammer.com"
              v-if="uploadMode === 'link'"
              required-mark
            />
            <va-file-upload
              v-model="file"
              class="w-28"
              type="gallery"
              file-types="image/*"
              v-if="uploadMode === 'file'"
              required-mark
            />
          </div>
        </div>
      </template>
      <template #step-content-1>
        <div class="space-y-6 py-4 px-6 mx-auto shadow-lg rounded-md w-fit">
          <div class="">
            <va-input
              v-model="product.slug"
              label="URL (Auto Generated)"
              placeholder="Your product will be located here"
              readonly
            />
          </div>
          <div class="">
            <va-input
              v-model="product.name"
              placeholder="Enter the name of the product"
              label="Name"
              @blur="generateSlug"
              required-mark
            />
          </div>
          <div class="">
            <va-select
              v-model="product.manufacturer"
              label="Manufacturer"
              :options="manufacturer"
              placeholder="Select an option"
              searchable
              required-mark
            />
            
          </div>
        </div>
      </template>
      <template #step-content-2>
        <div class="space-y-6 py-4 px-6 mx-auto shadow-lg rounded-md w-fit">
          <div class="">
            <va-select
              v-model="product.categories"
              label="Categories"
              placeholder="Select categories"
              :options="categories"
              :text-by="(option) => option.name"
              :value-by="(option) => option._id"
              multiple
              :max-visible-options="2"
              searchable
              highlight-matched-text
              :loading="pending"
              required-mark
            />
          </div>
          <div class="">
            <va-input
              v-model="product.partNumber"
              placeholder="Provide the products unique part number"
              label="Part Number"
            />
          </div>
          <div class="">
            <va-input
              v-model="product.specification"
              placeholder="Provide the products specification"
              label="Specification"
            />
          </div>
          <div class="">
            <va-rating
              v-model="product.rating"
              size="large"
              hover
            />
          </div>
        </div>
      </template>
      <template #step-content-3>
        <div class="space-y-6 py-4 px-6 mx-auto shadow-lg rounded-md w-fit">
          <div class="">
            <va-input
              required-mark
              v-model="product.price.min"
              label="Min Price"
            />
          </div>
          <div class="">
            <va-input
              required-mark
              v-model="product.price.max"
              label="Max Price"
            />
          </div>
          <div class="">
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
          </div>
        </div>
      </template>
    </va-stepper>
  </va-inner-loading>
</template>

<script setup>
import { uuid } from 'vue-uuid';
import { useToast } from 'vuestic-ui';
import { useAuthStore } from "@/store/auth";

const { uploadToCloudinary } = useCreateUtilities();

const { init } = useToast();
const authStore = useAuthStore();

const step = ref(0);

const uploadTypes = [
  {
    text: 'Link to the image',
    value: 'link',
  },
  {
    text: 'Upload the image',
    value: 'file',
  }
];

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

const steps = [
  { label: 'Upload the thumbnail' },
  { label: 'Help customers find it' },
  { label: 'Add some specs' },
  { label: 'Final description' },
];

const uploadMode = ref('link');
const file = ref([]);

const productID = ref(uuid.v4().slice(0, 8));
let isLoading = ref(false);

let product = reactive({
  imageURL: '',
  slug: '',
  name: '',
  categories: [],
  manufacturer: '',
  partNumber: '',
  specification: '',
  rating: 0,
  price: {min: 0, max: 0},
  description: ''
});

const { data: categories, pending } = await useFetch('view/categories/all/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    authorization: authStore.getAuth.token,
  },
});

function generateSlug() {
  const slug = product.name.toLowerCase().replace(/\s/g, "-") + "-" + productID.value;

  product.slug = slug;
}

async function submit() {
  isLoading.value = true

  try {
    if (uploadMode.value === 'file') {
      const cloudinaryLink = await uploadToCloudinary(file.value[0]);
      product.imageURL = cloudinaryLink;
    }

    const { data, error } = await useFetch('/create/product', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: product,
      headers: {
        authorization: authStore.getAuth.token,
      },
      credentials: 'include'
    });
    
    if (error.value) {
      init({message: error.value.data.message, color: "danger"})
    }

    if(!data.value) {
      isLoading.value = false;
      return;
    }

    init({message: data.value.message, color: "success"})

    reloadNuxtApp();
  } catch (error) {
    init({message: "An error occurred", color: "danger"});
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  
}
</script>

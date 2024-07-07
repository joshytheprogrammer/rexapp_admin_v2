<template>
  <va-inner-loading :loading="isLoading">
    <div class="py-4 px-6 mx-auto shadow-lg rounded-md w-fit">
      <form class="space-y-6" @submit.prevent="submit">
        <h2 class="font-medium text-xl">Create Category</h2>
        <div>
          <div class="mb-6">
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
            <va-file-upload
              v-model="file"
              class="w-28"
              type="gallery"
              file-types="image/*"
              v-if="uploadMode === 'file'"
              required-mark
            />
            <va-input
              v-model="category.imageURL"
              :rules="
              [(v) => (v && v.length > 0) || 'Image URL is required']
              "
              type="url"
              label="Image Link"
              placeholder="https://images.joshytheprogrammer.com"
              v-if="uploadMode === 'link'"
              required-mark
            />
          </div>
        </div>
        <div class="">
          <va-input
            v-model="category.name"
            placeholder="Enter the name of the product"
            label="Name"
            :rules="
            [(v) => (v && v.length > 0) || 'A category name is required']
            "
            @blur="generateSlug"
          />
        </div>
        <div class="">
          <va-textarea
            v-model="category.description"
            :max-length="700"
            label="Description"
            counter
            required-mark
            :rules="[
              (v) => v && v.length > 0 || 'Required',
              (v) => v && v.length < 700,
            ]"
          />
        </div>
        <div class="">
          <va-button 
          type="submit"
          :loading="isLoading" 
          :disabled="isLoading"
          >
            Create Category 
          </va-button>
        </div>
      </form>
    </div>
  </va-inner-loading>
</template>

<script setup>
import { uuid } from 'vue-uuid';
import { useToast } from 'vuestic-ui';
import { useAuthStore } from "@/store/auth";

const { uploadToCloudinary } = useCreateUtilities();

const { init } = useToast();
const authStore = useAuthStore();

const categoryID = ref(uuid.v4().slice(0, 8));
let isLoading = ref(false);

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

const uploadMode = ref('link');
const file = ref([]);

let category = reactive({
  name: '',
  imageURL: '',
  description: '',
  slug: ''
});

// Move this to backend
function generateSlug() {
  const slug = category.name.toLowerCase().replace(/\s/g, "-") + "-" + categoryID.value;

  category.slug = slug;
}

async function submit() {
  isLoading.value = true

  try {
    if (uploadMode.value === 'file') {
      const cloudinaryLink = await uploadToCloudinary(file.value[0]);
      category.imageURL = cloudinaryLink;
    }

    const { data, error } = await useFetch('/create/category', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: category,
      headers: {
        Authorization: 'Bearer '+authStore.getAuth.token,
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

<style lang="scss" scoped>

</style>
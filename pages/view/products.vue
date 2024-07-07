<template>
  <section>
    <div class="grid sm:grid-cols-3 gap-6 mb-6">
      <div></div>
      <va-input
        v-model="filter"
        label="Search"
        placeholder="Filter..."
        class="w-full"
      />
      <div></div>
    </div>
    <va-data-table
      v-model:sort-by="sortBy"
      v-model:sorting-order="sortingOrder"
      :items="products"
      :filter="filter"
      @filtered="filtered = $event.items"
      :columns="columns"
      :wrapper-size="700"
      :per-page="perPage"
      :current-page="currentPage"
      sticky-header
      hoverable
    >
      <template #cell(imageURL)="{ rowData }">
        <img class="h-20" :src="rowData.imageURL" :alt="rowData.name">
      </template>
      <template #cell(cart)="{ rowData }">
        {{ rowData.cart.length }}
      </template>
      <template class="" #cell(actions)="{ rowData }">
        <div class="space-x-4">
          <NuxtLink target="_blank" :to="`https://app.rexapp.ng/shop/${rowData.slug}`">
            <va-button>View</va-button>
          </NuxtLink>
          <NuxtLink @click.prevent="editModal(rowData.id)">
            <va-button color="warning">Edit</va-button>
          </NuxtLink>
          <NuxtLink :disabled="isLoading" @click.prevent="deleteItem(rowData.id)">
            <va-button color="danger">Delete</va-button>
          </NuxtLink>
        </div>
      </template>
      <template #bodyAppend>
        <tr>
          <td colspan="6">
            <div class="flex justify-center mt-4">
              <va-pagination
                v-model="currentPage"
                :pages="pages"
                :visible-pages="10"
                gapped
              />
            </div>
          </td>
        </tr>

      </template>
      
    </va-data-table>
    
    <va-modal
      v-model="showEditModal"
      fullscreen
      close-button
      blur
      hide-default-actions
      ok-text="Ok"
    >
      <EditProduct @close="editModal()" :id="editProductID" :token="authStore.getAuth.token" />
    </va-modal>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useToast, useModal } from 'vuestic-ui';

const authStore = useAuthStore();

const { init } = useToast();
const { confirm } = useModal();

const columns = ref([
  { key: "name", sortable: true },
  { key: "imageURL"},
  { key: "manufacturer", sortable: true },
  { key: "min_price", label: "Min Price", sortable: true },
  { key: "max_price", label: "Max Price", sortable: true },
  { key: "rating", sortable: true},
  { key: "actions", width: 80},
]);

const { data, refresh } = await useFetch('view/products/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+authStore.getAuth.token,
  },
});

const products = data.value.products

const sortingOrder = ref("asc");
const sortBy = ref("username");
const filter = ref("");
const currentPage = ref(1);
const perPage = ref(5);
const filtered = ref(products);

let isLoading = ref(false);
const showEditModal = ref(false)
let editProductID = ref(null)

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

const pages = computed(() => {
  return perPage.value && perPage.value !== 0
    ? Math.ceil(filtered.value.length / perPage.value)
    : filtered.value.length;
});

async function editModal(id) {
  showEditModal.value = !showEditModal.value
  if(id) {
    editProductID.value = id
  }else {
    editProductID.value = null
    await refresh()
  }
} 

async function deleteItem(id, imagePublicId) {
  isLoading.value = true;

  const approve = await confirm({
    message: 'Are you sure you want to delete this product?',
    title: 'Are you sure?',
    okText: "Yes",
    cancelText: "No"
  });

  if (!approve) { isLoading.value = false; return; }

  try {
    // Step 1: Delete image from Cloudinary
    // const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/image/destroy`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     public_id: imagePublicId,
    //     api_key: 'YOUR_CLOUDINARY_API_KEY',
    //     api_secret: 'YOUR_CLOUDINARY_API_SECRET'
    //   }),
    // });

    // const cloudinaryData = await cloudinaryResponse.json();

    // if (cloudinaryData.result !== 'ok') {
    //   throw new Error('Failed to delete image from Cloudinary');
    // }

    // Step 2: Delete product from database
    const { data, error } = await useFetch('delete/product/byId/', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + authStore.getAuth.token,
      },
      body: { productId: id }
    });

    if (error.value) {
      throw new Error(error.value);
    }

    if (!data.value) {
      return;
    }

    init({ message: data.value.message, color: "success" });
  } catch (error) {
    init({ message: "An error occurred", color: "danger" });
  } finally {
    reloadNuxtApp();
    isLoading.value = false;
  }
}

</script>

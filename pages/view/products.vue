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
      :columns="columns"
      :wrapper-size="600"
      virtual-scroller
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
          <NuxtLink @click.prevent="editModal(rowData._id)">
            <va-button color="warning">Edit</va-button>
          </NuxtLink>
          <NuxtLink :disabled="isLoading" @click.prevent="deleteItem(rowData._id)">
            <va-button color="danger">Delete</va-button>
          </NuxtLink>
        </div>
      </template>
    </va-data-table>
    <va-modal
      v-model="showEditModal"
      size="large"
      close-button
      blur
      hide-default-actions
      ok-text="Ok"
    >
      <EditProduct :id="editProductID" :token="authStore.getAuth.token" />
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
  { key: "price.min", label: "Min Price", sortable: true },
  { key: "price.max", label: "Max Price", sortable: true },
  { key: "rating", sortable: true},
  { key: "actions", width: 80},
]);

const sortingOrder = ref("asc");
const sortBy = ref("username");
const filter = ref("")

let isLoading = ref(false);
const showEditModal = ref(false)
let editProductID = ref(null)

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

const { data } = await useFetch('view/products/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    authorization: authStore.getAuth.token,
  },
});

const products = data.value.products

function editModal(id) {
  showEditModal.value = true
  editProductID.value = id
}

async function deleteItem(id) {
  isLoading.value = true

  const approve = await confirm({
    message: 'Are you sure you want to delete this product?',
    title: 'Are you sure?',
    okText: "Yes",
    cancelText: "No"
  });

  if(!approve) {isLoading.value = false; return;}

  try {
    const { data, error } = await useFetch('delete/product/byId/', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      headers: {
        authorization: authStore.getAuth.token,
      },
      body: {productId: id}
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
  }finally {
    reloadNuxtApp();
    isLoading.value = false;
  }
}

</script>

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
      :items="categories"
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
        <!-- {{ rowData.cart.length }} -->
      </template>
      <template class="" #cell(actions)="{ rowData }">
        <div class="space-x-4">
          <NuxtLink target="_blank" :to="`https://app.rexapp.ng/categories/${rowData.slug}`">
            <va-button>View</va-button>
          </NuxtLink>
          <NuxtLink @click.prevent="editModal(rowData._id)">
            <va-button color="warning">Edit</va-button>
          </NuxtLink>
          <NuxtLink disabled>
            <va-button color="danger" disabled>Delete</va-button>
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
      <EditCategory :id="editProductID" :token="authStore.getAuth.token" />
    </va-modal>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const columns = ref([
  { key: "name", sortable: true },
  { key: "imageURL"},
  { key: "actions", width: 80},
]);

const sortingOrder = ref("asc");
const sortBy = ref("username");
const filter = ref("")

const showEditModal = ref(false)
let editProductID = ref(null)

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

const { data } = await useFetch('view/categories/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    authorization: authStore.getAuth.token,
  },
});

const categories = data.value.categories

function editModal(id) {
  showEditModal.value = true
  editProductID.value = id
}


</script>

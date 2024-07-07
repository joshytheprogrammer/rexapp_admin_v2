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
      :items="users"
      :filter="filter"
      :columns="columns"
      :wrapper-size="600"
      virtual-scroller
      sticky-header
      hoverable
    >
      <template #cell(full_name)="{ rowData }">
        <span>{{ rowData.last_name + " " + rowData.first_name }}</span>
      </template>
      <template #cell(actions)="{ rowData }">
        <va-button @click="viewOrder(rowData)">View</va-button>
      </template>
    </va-data-table>
    <va-modal
      v-model="showModal"
      size="large"
      ok-text="Ok"
      @before-close="beforeModalClose"
    >
      <ViewUser :user="userData" :token="authStore.getAuth.token" />
    </va-modal>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const columns = ref([
  { key: "username", sortable: true },
  { key: "email", sortable: true },
  { key: "full_name", label: 'Full Name', sortable: true },
  { key: "street", label: "street" },
  { key: "state", label: "State", sortable: true },
  { key: "ordersLength", label: 'Orders placed', sortable: true},
  { key: "cartLength", label: 'Items in Cart', sortable: true},
  { key: "actions", width: 80 },
]);

const sortingOrder = ref("asc");
const sortBy = ref("username");
const filter = ref("")

const showModal = ref(false)
let userData = ref(null)

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

const { data } = await useFetch(() => 'view/users/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+authStore.getAuth.token,
  },
});

const users = data.value.users

function viewOrder(data) {
  showModal.value = true
  userData.value = data
}


</script>

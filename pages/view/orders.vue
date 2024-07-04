<template>
  <section >
    <div class="grid sm:grid-cols-3 gap-6 mb-6">
      <div></div>
      <va-input
        v-model="filter"
        label="Search"
        placeholder="Search by id..."
        class="w-full"
      />
      <div></div>
    </div>
    <va-data-table
      v-model:sort-by="sortBy"
      v-model:sorting-order="sortingOrder"
      :filter="filter"
      :items="orders"
      :columns="columns"
      :wrapper-size="600"
      virtual-scroller
      sticky-header
      hoverable
    >
      <template #cell(_id)="{ rowData }">
        {{ rowData.id.substring(rowData.id.length - 8) }}
      </template>
      <template #cell(orderDate)="{ rowData }">
        {{ new Date(rowData.orderDate).toLocaleString() }} 
      </template>
      <template #cell(actions)="{ rowData }">
        <va-button
          preset="plain"
          icon="visibility"
          @click="viewOrder(rowData.id)"
        />
      </template>
    </va-data-table>
    <va-modal
      v-model="showModal"
      size="large"
      ok-text="Ok"
      @before-close="beforeModalClose"
    >
      <ViewOrder :id="viewID" :token="authStore.getAuth.token" />
    </va-modal>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const columns = ref([
  { key: "id", sortable: false },
  { key: "created_at", sortable: true, sortingOptions: ["desc", "asc"] },
  { key: "status", sortable: true, sortingOptions: ["desc", "asc"] },
  { key: "actions", width: 80 },
]);

const sortingOrder = ref("desc");
const sortBy = ref("status")
const filter = ref("")

const showModal = ref(false)
let viewID = ref(null)

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

function viewOrder(id) {
  showModal.value = true
  viewID.value = id
}

const { data, refresh } = await useFetch('view/orders/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+authStore.getAuth.token,
  },
});

function beforeModalClose() {
  refresh()
}

const orders = Object.values(data.value)[0]
</script>

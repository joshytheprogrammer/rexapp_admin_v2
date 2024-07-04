<template>
  <div class="block">
    <va-data-table
      v-model:sort-by="sortBy"
      v-model:sorting-order="sortingOrder"
      :items="orders"
      :columns="columns"
      :wrapper-size="400"
      virtual-scroller
      sticky-header
      hoverable
    >
      <template #cell(id)="{ rowData }">
        {{ rowData.id}}
      </template>
      <template #cell(created_at)="{ rowData }">
        {{ new Date(rowData.created_at).toLocaleString() }} 
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
    >
      <ViewOrder :id="viewID" :token="token" />
    </va-modal>
  </div>
</template>

<script setup>
const props = defineProps(['orders', 'token']);

const columns = ref([
  { key: "id", sortable: true },
  { key: "created_at", sortable: true, sortingOptions: ["desc", "asc"] },
  { key: "status", sortable: true, sortingOptions: ["desc", "asc"] },
  { key: "actions", width: 80 },
]);

const sortingOrder = ref("desc");
const sortBy = ref("status");

const showModal = ref(false)
let viewID = ref(null)

function viewOrder(id) {
  showModal.value = true
  viewID.value = id
}
</script>
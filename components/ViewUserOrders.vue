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
      <template #cell(_id)="{ rowData }">
        {{ rowData._id.substring(rowData._id.length - 8) }}
      </template>
      <template #cell(orderDate)="{ rowData }">
        {{ new Date(rowData.orderDate).toLocaleString() }} 
      </template>
      <template #cell(actions)="{ rowData }">
        <va-button
          preset="plain"
          icon="visibility"
          @click="viewOrder(rowData._id)"
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
  { key: "_id", sortable: false },
  { key: "orderDate", sortable: true, sortingOptions: ["desc", "asc"] },
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
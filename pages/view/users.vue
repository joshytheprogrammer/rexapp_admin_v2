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
      :items="items"
      :filter="filter"
      :columns="columns"
      :wrapper-size="400"
      virtual-scroller
      sticky-header
      hoverable
    >
      <template #cell(actions)="{ rowData }">
        <va-button
          preset="plain"
          icon="visibility"
          @click="viewOrder(rowData)"
        />
      </template>
    </va-data-table>
  </section>
</template>

<script setup>

const users = ref([
{
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496",
    },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
},
{
  id: 2,
  name: "Ervin Howell",
  username: "Antonette",
  email: "Shanna@melissa.tv",
  address: {
    street: "Victor Plains",
    suite: "Suite 879",
    city: "Wisokyburgh",
    zipcode: "90566-7771",
    geo: {
      lat: "-43.9509",
      lng: "-34.4618",
    },
  },
  phone: "010-692-6593 x09125",
  website: "anastasia.net",
  company: {
    name: "Deckow-Crist",
    catchPhrase: "Proactive didactic contingency",
    bs: "synergize scalable supply-chains",
  },
},
]);

const columns = ref([
  { key: "id", sortable: true, sortingOptions: ["desc", "asc"] },
  { key: "username", sortable: true },
  { key: "name", sortable: true },
  { key: "phone" },
  { key: "actions", width: 80 },
]);

const sortingOrder = ref("asc");
const sortBy = ref("username")
const items = ref(shuffle(users.value)); 
const filter = ref("")

watch(filter, (newFilter) => {
  updateFilter(newFilter);
});

function updateFilter(newFilter) {
  filter.value = newFilter;
}

function shuffle(array) {
  const shuffled = [...array];
  let currentIndex = shuffled.length, randomIndex, temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled;
}

function viewOrder(id) {
  alert(JSON.stringify(id))
}

</script>

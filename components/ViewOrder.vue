<template>
  <div class="block space-y-4">
    <va-progress-circle class="text-center mx-auto" v-if="pending" indeterminate />
    <va-scroll-container
      class="max-h-48 my-8"
      vertical
    >
      <va-list>
        <va-list-label> Products Ordered </va-list-label>

        <va-list-item
          v-for="(item, index) in data.order.items"
          :key="index"
          class="py-4"
        >
          <ProductList :item="item" :token="token" />
        </va-list-item>
      </va-list>
    </va-scroll-container>

    <va-collapse
      v-model="addressCollapseIsOpen"
      class="min-w-96"
      header="Personal Info"
      solid
    >
      <template #header="{ value, attrs, iconAttrs, text }">
        <div v-bind="attrs" class="w-full flex border-[var(--va-background-border)] border-2 p-2 bg-[var(--va-background-element)]">
          <va-icon
            name="va-arrow-down"
            :class="value ? '' : 'rotate-[-90deg]'"
            v-bind="iconAttrs"
          />

          <div class="ml-2">
            {{ text }}
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-2 border-[var(--va-background-border)] border-2 border-t-0">
          <p class="flex justify-between border-b space-x-8">
            <span>Username:</span>
            <span>{{ data.order.user.username }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Email:</span>
            <span>{{ data.order.user.email }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Full Name:</span>
            <span>{{ data.order.user.first_name + " " + data.order.user.last_name }}</span>
          </p>
        </div>
      </template>
    </va-collapse>

    <va-collapse
      v-model="addressCollapseIsOpen"
      class="min-w-96"
      header="Address"
      solid
    >
      <template #header="{ value, attrs, iconAttrs, text }">
        <div v-bind="attrs" class="w-full flex border-[var(--va-background-border)] border-2 p-2 bg-[var(--va-background-element)]">
          <va-icon
            name="va-arrow-down"
            :class="value ? '' : 'rotate-[-90deg]'"
            v-bind="iconAttrs"
          />

          <div class="ml-2">
            {{ text }}
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-2 border-[var(--va-background-border)] border-2 border-t-0">
          <p class="flex justify-between border-b space-x-8">
            <span>Street:</span>
            <span>{{ data.order.user.street  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>City:</span>
            <span>{{ data.order.user.city  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>State:</span>
            <span>{{ data.order.user.state  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Landmark:</span>
            <span>{{ data.order.user.landmark  }}</span>
          </p>
        </div>
      </template>
    </va-collapse>

    <va-collapse
      v-model="collapseIsOpen"
      class="min-w-96"
      header="Order Details"
      solid
    >
      <template #header="{ value, attrs, iconAttrs, text }">
        <div v-bind="attrs" class="w-full flex border-[var(--va-background-border)] border-2 p-2 bg-[var(--va-background-element)]">
          <va-icon
            name="va-arrow-down"
            :class="value ? '' : 'rotate-[-90deg]'"
            v-bind="iconAttrs"
          />

          <div class="ml-2">
            {{ text }}
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-2 border-[var(--va-background-border)] border-2 border-t-0">
          <p class="flex justify-between border-b space-x-8">
            <span>Status:</span>
            <span>{{ data.order.status }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Order ID:</span>
            <span>{{ data.order.id }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Ordered on:</span>
            <span>{{ new Date(data.order.created_at).toLocaleString() }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>No of items ordered:</span>
            <span>{{ data.order.itemsLength }}</span>
          </p>
        </div>
      </template>
    </va-collapse>
    <!-- {{ data }} -->
    <form class="mt-4" @submit.prevent="submit" v-if="data.order.status === 'pending'">
      <va-button :disabled="isLoading" type="submit"> Mark as Completed </va-button>
    </form>
  </div>
</template>

<script setup>
import { useToast } from 'vuestic-ui';

const props = defineProps(['id', 'token']);

const { init } = useToast();

let isLoading = ref(false);

const { data, pending, refresh } = await useFetch(() => `/view/orders/${props.id}`, {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer ' + props.token,
  },
});

console.log(data.value)

async function submit() {
  isLoading.value = true

  try {
    const { data: res } = await useFetch('/view/order/complete', {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: {
        orderId: data.value.order.id,
        userId: data.value.order.user_id,
      },
      headers: {
        Authorization: 'Bearer ' + props.token,
      },
    });

    init({message: res.value.message, color: "success"})

  } catch (error) {
    console.error(error)
  }finally{
    isLoading.value = false;
    refresh();
  }

}
</script>

<style lang="scss" scoped>

</style>
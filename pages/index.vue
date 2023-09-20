<template>
  <div class="w-full text-center">
    <va-progress-circle class="text-center mx-auto" v-if="pending" indeterminate />
    <div class="block m-4 md:flex flex-wrap gap-4 justify-center items-center">
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Pending Orders</va-card-title>
        <va-card-content>
          {{ data.pendingOrders }}
        </va-card-content>
      </va-card>
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Completed Orders</va-card-title>
        <va-card-content>
          {{ data.completedOrders }}
        </va-card-content>
      </va-card>
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Cancelled Orders</va-card-title>
        <va-card-content>
          {{ data.cancelledOrders }}
        </va-card-content>
      </va-card>
    </div>
    <div class="block md:flex flex-wrap gap-4 justify-center items-center">
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Registered Users</va-card-title>
        <va-card-content>
          {{ data.registeredUsers }}
        </va-card-content>
      </va-card>
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Uploaded Products</va-card-title>
        <va-card-content>
          {{ data.totalProducts }}
        </va-card-content>
      </va-card>
      <va-card color="primary" gradient :bordered="false">
        <va-card-title>Uploaded Categories</va-card-title>
        <va-card-content>
          {{ data.totalCategories }}
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const { data, pending } = await useFetch('view/analytics/', {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    authorization: authStore.getAuth.token,
  },
});

</script>

<style lang="scss" scoped>

</style>
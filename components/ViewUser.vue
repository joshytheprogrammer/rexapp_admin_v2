<template>
  <div class="block space-y-4">
    <va-collapse
      v-model="personalInfoCollapseIsOpen"
      class="min-w-96"
      header="Personal"
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
            <span>{{ user.username }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Email:</span>
            <span>{{ user.email }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Full Name:</span>
            <span>{{ user.first_name + " " + user.last_name }}</span>
          </p>
          <!-- {{ user }} -->
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
            <span>{{ user.street  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>City:</span>
            <span>{{ user.city  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>State:</span>
            <span>{{ user.state  }}</span>
          </p>
          <p class="flex justify-between border-b space-x-8">
            <span>Landmark:</span>
            <span>{{ user.landmark  }}</span>
          </p>
          <!-- {{ user }} -->
        </div>
      </template>
    </va-collapse>

    <va-collapse
      v-model="cartCollapseIsOpen"
      class="min-w-96"
      header="Cart"
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
        <va-list class="py-4">
          <va-list-label> Users Cart </va-list-label>

          <va-list-item v-if="user.cart.length <= 0">
            <p class="w-full text-center">No items in cart yet</p>
          </va-list-item>

          <va-list-item
            v-for="(item, index) in user.cart"
            :key="index"
            v-else
            class="py-4"
          >
            <ProductList :item="item" :token="token" />
          </va-list-item>
        </va-list>
      </template>
    </va-collapse>

    <va-collapse
      v-model="orderCollapseIsOpen"
      class="min-w-96"
      header="Orders"
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
        <LazyViewUserOrders :orders="user.orders" :token="token" />
      </template>
    </va-collapse>
  </div>
</template>

<script setup>
const props = defineProps(['user', 'token']);

const addressCollapseIsOpen = ref(false);
const personalInfoCollapseIsOpen = ref(false);
const cartCollapseIsOpen = ref(false);
const orderCollapseIsOpen = ref(false);

const orderItemsCollapseIsOpen = ref(false);
</script>

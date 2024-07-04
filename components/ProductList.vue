<template>
  <va-list-item-section avatar>
    <va-avatar>
      <img
        :src="product.imageURL"
        :alt="product.name"
      >
    </va-avatar>
  </va-list-item-section>

  <va-list-item-section>
    <va-list-item-label>
      {{ product.name }} @  [{{ formatPrice(product.min_price) }} - {{ formatPrice(product.max_price) }}] * <b>{{ item.quantity }}</b>
    </va-list-item-label>

    <va-list-item-label caption>
      {{ product.partNumber }} | {{ product.specification }} | {{ product.manufacturer }}
    </va-list-item-label>
  </va-list-item-section>

  <va-list-item-section icon>
    <!--  -->
    <NuxtLink :to="`https://app.rexapp.ng/shop/${product.slug}`">
      <va-icon
        name="remove_red_eye"
        color="background-tertiary"
      />
    </NuxtLink>
    
  </va-list-item-section>
</template>

<script setup>
const props = defineProps(['item', 'token']);

const { data } = await useFetch(() => `/view/products/byId/${props.item.product_id}`, {
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: 'Bearer '+props.token,
  },
});

const product = data.value.product

function formatPrice(price) {
  // const NGN_SYMBOL = "₦";
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  return formatter.format(price);
}
</script>

<style lang="scss" scoped>

</style>
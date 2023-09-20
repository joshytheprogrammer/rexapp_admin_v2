<script setup>
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const authStore = useAuthStore();

const showSidebar = ref(false)

watch(() => route.fullPath, () => {
  showSidebar.value = false;
});
</script>

<template>
  <VaLayout style="height: 100vh" :left="{ absolute: true}">
    <template #top>
      <NuxtLoadingIndicator />
      <VaNavbar
        color="primary"
        class="py-2"
      >
        <template #left>
          <VaButton
            :icon="showSidebar ? 'menu_open' : 'menu'"
            @click="showSidebar = !showSidebar"
          />
        </template>
        <template #center>
          <va-navbar-item class="font-bold text-lg">
            RexApp Admin Portal
          </va-navbar-item>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaSidebar v-model="showSidebar" class="py-4">
        <VaSidebarItem >
          <NuxtLink to="/">
            <VaSidebarItemContent>
              <VaIcon name="home" /> 
                <VaSidebarItemTitle>
                  <NuxtLink to="/">Home</NuxtLink>
                </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </NuxtLink>
        </VaSidebarItem>
        
        <va-accordion>
          <va-collapse body-color="#00000022">
            <template #header="{ value: isCollapsed }">
              <va-sidebar-item>
                <va-sidebar-item-content>
                  <va-icon name="add_circle" />
                  <va-sidebar-item-title>Create</va-sidebar-item-title>
                  <va-spacer />
                  <va-icon :name="isCollapsed ? 'va-arrow-up' : 'va-arrow-down'" />
                </va-sidebar-item-content>
              </va-sidebar-item>
            </template>

            <template #body>
              <va-sidebar-item>
                <NuxtLink to="/create/product">
                  <va-sidebar-item-content>
                    <va-icon name="inventory_2" />
                      <va-sidebar-item-title>
                        Product
                      </va-sidebar-item-title>
                  </va-sidebar-item-content>
                </NuxtLink>
              </va-sidebar-item>

              <va-sidebar-item>
                <NuxtLink to="/create/category">  
                  <va-sidebar-item-content>
                    <va-icon name="category" />
                      <va-sidebar-item-title>
                        Category
                      </va-sidebar-item-title>         
                  </va-sidebar-item-content>
                </NuxtLink>     
              </va-sidebar-item>
            </template>
          </va-collapse>
        </va-accordion>

        <va-accordion>
          <va-collapse body-color="#00000022">
            <template #header="{ value: isCollapsed }">
              <va-sidebar-item>
                <va-sidebar-item-content>
                  <va-icon name="visibility" />
                  <va-sidebar-item-title>View</va-sidebar-item-title>
                  <va-spacer />
                  <va-icon :name="isCollapsed ? 'va-arrow-up' : 'va-arrow-down'" />
                </va-sidebar-item-content>
              </va-sidebar-item>
            </template>

            <template #body>
              <va-sidebar-item>
                <NuxtLink to="/view/users">
                  <va-sidebar-item-content>
                    <va-icon name="group" />
                      <va-sidebar-item-title>
                        Users
                      </va-sidebar-item-title>
                  </va-sidebar-item-content>
                </NuxtLink>
              </va-sidebar-item>

              <va-sidebar-item>
                <NuxtLink to="/view/orders">
                  <va-sidebar-item-content>
                    <va-icon name="point_of_sale" />
                      <va-sidebar-item-title>
                        Orders
                      </va-sidebar-item-title>
                  </va-sidebar-item-content>
                </NuxtLink>
              </va-sidebar-item>
            </template>
          </va-collapse>
        </va-accordion>

        <va-spacer />

        <va-sidebar-item>
          <va-sidebar-item-content>
            <va-button color="danger" @click="authStore.logout()"> Logout </va-button>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </VaSidebar>
    </template>

    <template #content>
      <main class="p-4">
        <slot />
      </main>
    </template>
  </VaLayout>
</template>
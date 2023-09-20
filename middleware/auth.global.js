import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {

  const authStore = useAuthStore();

  const token = authStore.getAuth.token;
  
  if(to.path !== '/login') {
    if (!token) {
      return navigateTo('/login');
    }
  }else if(to.path === '/login'){
    if (token) {
      return navigateTo('/');
    }
  }
  
});
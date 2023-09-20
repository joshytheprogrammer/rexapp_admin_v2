import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: {
      loading: false,
      token: useCookie('accessToken').value,
    }
  }),
  actions: {
    setToken(accessToken) {
      const cookie = useCookie('accessToken');
      cookie.value = accessToken;

      this.auth.token = cookie.value
      
      navigateTo('/')
    },
    async logout() {
      useCookie('accessToken').value = null;

      this.auth.token = null;

      navigateTo('/login');
    }
  },
  getters: {
    getAuth(state) {
      return state.auth;
    }
  }
})
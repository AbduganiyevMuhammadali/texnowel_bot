<script setup>
import { watch, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { RouterLink, RouterView } from 'vue-router';
import { useErrorStore } from './stores/error';
import { storeToRefs } from 'pinia';
import { useMessage } from 'naive-ui';
import { useCartStore } from './stores/cart';
const errorStore = useErrorStore();
const cartStore = useCartStore();
const { errorText } = storeToRefs(errorStore);
const route = useRoute()
const router = useRouter()
const message = useMessage();

watch(errorText, (val) => {
  if(val != '' && val) {
    message.error(val)
  }
  setTimeout(() => {
    errorStore.errorText = '';
  }, 5000)
})

onMounted(() => {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.isClosingConfirmationEnabled = true;
  window.Telegram.WebApp.BackButton.isVisible = true;
  cartStore.cart.telegram_id = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  window.Telegram.WebApp.onEvent("backButtonClicked", () => {
    if (route.path != "/") router.go(-1);
  });
})

</script>
<template>
  <RouterView name="LeftSidebar"></RouterView>
  <RouterView />
</template>

<style scoped>

</style>

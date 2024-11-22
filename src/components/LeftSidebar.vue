<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart'
import { DehazeOutlined, ChevronLeftRound, AddShoppingCartFilled, AccessAlarmOutlined, HomeOutlined } from '@vicons/material';
const cartStore = useCartStore();
const showSidebar = ref(false)
const router = useRouter();
const left = () => {
    router.push({ name: 'login' });
    localStorage.removeItem('token');
}

</script>

<template>
    <div class="main">
        <img src="../../public/logo.jpg" style="width: 140px; margin-top: -20px;" alt="">

        <n-button @click="showSidebar = true" type="info">
            <template #icon>
                <n-icon size="25">
                    <DehazeOutlined></DehazeOutlined>
                </n-icon>
            </template>
        </n-button>
    </div>
    <n-drawer v-model:show="showSidebar" :width="200" placement="left">
        <n-drawer-content title="Sellerpeak 24">
            <div class="drawer_content">
                <n-button type="info" @click="router.push(('/')), showSidebar = false">
                    Home
                    <template #icon>
                        <n-icon size="25">
                            <HomeOutlined></HomeOutlined>
                        </n-icon>
                    </template>
                </n-button>
                <n-button type="info" @click="router.push({ name: 'bronlist' }), showSidebar = false" style="margin-top: 10px;">
                    Буюртмалар
                    <template #icon>
                        <n-icon size="25">
                            <AccessAlarmOutlined></AccessAlarmOutlined>
                        </n-icon>
                    </template>
                </n-button>
                
                <n-button type="error" style="width: 100%;margin-top: 10px;" @click="left">Чиқиш
                    <template #icon>
                        <n-icon size="25">
                            <ChevronLeftRound></ChevronLeftRound>
                        </n-icon>
                    </template>
                </n-button>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<style scoped>
.main {
    padding: 20px 20px 0 20px;
    display: flex;
    justify-content: space-between;
}
.drawer_content {
    border: 2px solid white;
    border-radius: 10px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
</style>
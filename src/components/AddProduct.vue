<script setup>
import { PlusOutlined, MinusOutlined, AddCircleOutlineOutlined } from '@vicons/material';
import { ref, onMounted, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { useCartStore } from '../stores/cart';
import axios from 'axios';
const message = useMessage()
const cartStore = useCartStore()
const emits = defineEmits(['add']);
const props = defineProps(['product', 'pay_type_id', 'isCart']);
const product = ref({
    product_id: 0,
    name: '',
    count: 0,
    price: 0,
    summa: 0,
    shtrix_kod: '',
    current_balance: 0,
    pack_count: 0,
    pack_price: 0,
    pack_norma: 0,
    chakana_price: 0,
    chakana_dollar_price: 0,
})

const loadData = () => {
    product.value.product_id = props.product.id;
    product.value.name = props.product.name;
    if(props.pay_type_id == 3) {
        product.value.price = props.product.price_register.chakana_dollar_price;
    } else {
        product.value.price = props.product.price_register.chakana_price;
    }
    product.value.chakana_price = props.product.price_register.chakana_price;
    product.value.chakana_dollar_price = props.product.price_register.chakana_dollar_price;
    if(props.isCart) {
        product.value.current_balance = props.product.current_balance;
    } else {
        product.value.current_balance = props.product.balance;
    }
    // const body = {
    //     url: 'product/id/' + props.product.id,
    //     params: {},
    //     requestType: 'GET',
    //     body: {}
    // }
    axios.get('product/id/' + props.product.id).then((res) => {
        product.value.pack_norma = res.pack_count;
        if(props.pay_type_id == 3) {
            product.value.pack_price = props.product.price_register.chakana_dollar_price * res.pack_count;
        } else {
            product.value.pack_price = props.product.price_register.chakana_price * res.pack_count;
        }
    });
}

onMounted(() => {
    if(props.isCart) {
        product.value = { ...props.product };
    } else {
        loadData()
    }
})
const incrementPachka = () => {
    product.value.pack_count++;
    product.value.count = product.value.pack_norma * product.value.pack_count;
    product.value.count = (product.value.pack_norma * product.value.pack_count).toFixed(3);
}
const decrementPachka = () => {
    if(product.value.pack_count > 1) {
        product.value.pack_count--;
        product.value.pack_count = product.value.pack_count.toFixed(3)
        product.value.count = (product.value.pack_norma * product.value.pack_count).toFixed(3);
    }
}
const incrementCount = () => {
    product.value.count++;
    // product.value.count = product.value.count.toFixed(3);
    product.value.pack_count = (product.value.count / product.value.pack_norma).toFixed(3)
}
const decrementCount = () => {
    if(product.value.count > 0) {
        product.value.count--;
        // product.value.count = product.value.count.toFixed(3);
        product.value.pack_count = (product.value.count / product.value.pack_norma).toFixed(3)
    }
}

watch(() => product.value.count, (val) => {
    product.value.summa = val * product.value.price;
})

const add = () => {
    product.value.count = Number(product.value.count);
    product.value.price = Number(product.value.price);
    product.value.pack_count = Number(product.value.pack_count);
    product.value.pack_norma = Number(product.value.pack_norma);
    product.value.summa = Number(product.value.summa);
    cartStore.addProduct(product.value, props.isCart);
    emits('add')
}
 
const changePackCount = (val) => {
    const result = parseFloat(val.target.value);
    if(result > 0) {
        product.value.pack_count = result;
        // product.value.pack_count = product.value.pack_count.toFixed(3)
        product.value.count = (product.value.pack_norma * product.value.pack_count).toFixed(3);
    }
}
const changeCount = (val) => {
    let result = parseFloat(val.target.value);
    // if(product.value.count == 0) {
    //     result = Number(val.target.value.slice(0, val.target.value.length - 2))
    // }
    if(result > 0) {
        product.value.count = result;
        // product.value.count = product.value.count
        product.value.pack_count = (product.value.count / product.value.pack_norma).toFixed(3);
    }
}




</script>
<template>
    <div class="product">
        <!-- <div class="pachka">
            <div style="font-weight: bold; font-size: 18px;">
                Пачка
            </div>
            <div class="pachka_in">
                    <n-button type="error" @click="decrementPachka">
                    <template #icon>
                        <n-icon size="25">
                            <MinusOutlined></MinusOutlined>
                        </n-icon>
                    </template>
                </n-button>
                <input type="number" :value="product.pack_count" class="number" @keyup="changePackCount">
                <n-button type="info" @click="incrementPachka" style="margin-left: 10px;">
                    <template #icon>
                        <n-icon size="25">
                            <PlusOutlined></PlusOutlined>
                        </n-icon>
                    </template>
                </n-button>
            </div>
        </div> -->
        <div class="shtuk">
            <!-- <div style="font-weight: bold; font-size: 18px;">
                Штук
            </div> -->
            <div class="shtuk_in">
                <n-button type="error" @click="decrementCount">
                    <template #icon>
                        <n-icon size="25">
                            <MinusOutlined></MinusOutlined>
                        </n-icon>
                    </template>
                    </n-button>
                    <input style="font-size: 20px; font-weight: bold; text-align: center;" type="number" :value="product.count" class="number" @keyup="changeCount">
                    <n-button type="info" @click="incrementCount" style="margin-left: 10px;">
                        <template #icon>
                            <n-icon size="25">
                                <PlusOutlined></PlusOutlined>
                            </n-icon>
                        </template>
                    </n-button>
            </div>
            </div>
            <div class="calc">
             <span>
                {{ new Intl.NumberFormat('ru-RU').format(product.price) }}
             </span>
             <span style="margin-left: 10px;">*</span>
             <span style="margin-left: 10px;">
                {{ new Intl.NumberFormat('ru-RU').format(product.count) }}
             </span>
             <span style="margin-left: 10px;">=</span>
             <span style="margin-left: 10px;">
                {{ new Intl.NumberFormat('ru-RU').format(product.summa) }}
            </span>
             
            </div>
            <n-button @click="add" type="info" style="width: 100%; margin-top: 20px;">
                <span v-if="!props.isCart">
                    Қўшиш
                </span>
                <span v-else>
                    Сақлаш
                </span>
                <template #icon>
                    <n-icon>
                        <AddCircleOutlineOutlined></AddCircleOutlineOutlined>
                    </n-icon>
                </template>
            </n-button>
    </div>
</template>

<style scoped>
.product {
    width: 100%;
}
.pachka {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.pachka_in {
    display: flex;
    width: 75%;
    justify-content: space-between;
    align-items: center;
}
.shtuk {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
.shtuk_in {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.number {
    outline: none;
    border: 1px solid #2080f0;
    box-sizing: border-box;
    padding: 7px;
    border-radius: 6px;
    width: 70%;
    text-align: right;
    margin-left: 10px;
}
.calc {
    font-size: 18px;
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
}
</style>
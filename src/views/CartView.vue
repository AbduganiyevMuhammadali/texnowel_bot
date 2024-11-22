<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import AddProduct from '../components/AddProduct.vue';
import { ShoppingCartOutlined, RestoreFromTrashFilled, EditLocationOutlined } from '@vicons/material';
import { useMessage } from 'naive-ui';
const cartStore = useCartStore()
const showProduct = ref(false)
const showSend = ref(false)
const sProduct = ref({});
const router = useRouter()
const message = useMessage()
const clickItem = (item) => {
    sProduct.value = item;
    showProduct.value = true;
}

const sending = ref(false);
const sendToServer = () => {
    let data = { ...cartStore.cart }
    let phoneNumber = cartStore.cart.phone_number.replace(/[^\d]/g,"")
    data['phone_number'] = '+'+phoneNumber;
    if(cartStore.cart.rasxod_table.length == 0) {
        message.error("Kamida bitta mahsulot biriktiring!")
        return
    }

    // const body = {
    //     url: 'bron/',
    //     params: {},
    //     requestType: 'POST',
    //     body: {
    //         ...data
    //     }
    // }
    sending.value = true;
    console.log("IIID",data)
    axios.post('bron/', data).then((res) => {
        message.success("Буюртмангиз қабул қилинди!");
        cartStore.clearCart();
        router.push({ name: 'category', params: { id: 0 } })
    }).finally(() => {
        sending.value = false;
    })
}

const deleteItem = (e, item) => {
    e.stopPropagation();
    cartStore.deleteItem(item);
}
//map start
import Map from '../components/Map.vue';
const showMap = ref(false);
//map end

const length = ref(0)
const formatTelNumber = () => {
  if (length.value < cartStore.cart.phone_number.length) {
    let numbers = formatNumber(cartStore.cart.phone_number)
    cartStore.cart.phone_number = numbers
  }
  length.value = cartStore.cart.phone_number.length
}

const formatNumber =(value)=>{
  if(!value) return value
  const phoneNumber = value.replace(/[^\d]/g,"")
  const phoneNumberLength = phoneNumber.length
  if(phoneNumberLength < 4) return `+998${phoneNumber}`
  if(phoneNumberLength < 6){
    return  `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}`
  }
  if(phoneNumberLength < 8){
    return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5)}`
  }
  if(phoneNumberLength < 10){
    return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5,8)} ${phoneNumber.slice(8)}`
  }
  return `+${phoneNumber.slice(0,3)} (${phoneNumber.slice(3,5)}) ${phoneNumber.slice(5,8)} ${phoneNumber.slice(8,10)} ${phoneNumber.slice(10)}`
}

</script>
<template>
    <div class="main">
        <table id="cats">
                <thead>
                    <tr>
                        <th>
                            Номи
                        </th>
                        <th>
                            Нархи
                        </th>
                        <th>
                            Пачка
                        </th>
                        <th>
                            Штук
                        </th>
                        <th>
                            Сумма
                        </th>
                        <th>
                            Ўчириш
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartStore.cart.rasxod_table" @click="clickItem(item)">
                        <td>
                            {{ item.name }}
                        </td>
                        <td>
                            {{ new Intl.NumberFormat('ru-RU').format(item.price) }}
                        </td>
                        <td>
                            {{ new Intl.NumberFormat('ru-RU').format(item.pack_count) }}
                        </td>
                        <td>
                            {{ new Intl.NumberFormat('ru-RU').format(item.count) }}
                        </td>
                        <td>
                            {{ new Intl.NumberFormat('ru-RU').format(item.summa) }}
                        </td>
                        <td>
                            <n-button type="error" @click="deleteItem($event, item)">
                                <template #icon>
                                    <n-icon size="25">
                                        <RestoreFromTrashFilled></RestoreFromTrashFilled>
                                    </n-icon>
                                </template>
                            </n-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <n-button @click="showSend = true" type="info" style="width: calc(100% - 20px); position: absolute; bottom: 10px;">
                Жўнатиш
                <template #icon>
                    <n-icon>
                        <ShoppingCartOutlined></ShoppingCartOutlined>
                    </n-icon>
                </template>
            </n-button>
            <n-drawer v-model:show="showProduct" :height="240" placement="top">
                <n-drawer-content :title="sProduct.name" closable>
                    <AddProduct :product="sProduct" :pay_type_id="cartStore.pay_type" @add="showProduct = false" :is-cart="true"></AddProduct>
                </n-drawer-content>
            </n-drawer>
            <n-drawer v-model:show="showSend" placement="top" :height="410">
                <n-drawer-content closable>
                    <n-form-item label="Telefon">
                        <input class="phone_number" type="text" required v-model="cartStore.cart.phone_number" @keyup="formatTelNumber()" maxlength="19" placeholder="Телефон">
                        <!-- <n-input placeholder="Tel" v-model:value="cartStore.cart.phone_number"></n-input> -->
                    </n-form-item>
                    <n-form-item label="Address">
                        <n-input placeholder="Address" v-model:value="cartStore.cart.location_text"></n-input>
                        <n-button @click="showMap = true" type="primary" style="margin-left: 10px;">
                            <template #icon>
                                <n-icon>
                                    <EditLocationOutlined></EditLocationOutlined>
                                </n-icon>
                            </template>
                        </n-button>
                    </n-form-item>
                    <n-form-item label="Comment">
                        <n-input type="textarea" v-model:value="cartStore.cart.comment"></n-input>
                    </n-form-item>
                    <n-button :disabled="sending" @click="sendToServer" type="info" style="width: calc(100% - 45px); position: absolute; bottom: 10px;">
                        Жўнатиш
                    <template #icon>
                        <n-icon>
                            <ShoppingCartOutlined></ShoppingCartOutlined>
                        </n-icon>
                    </template>
                </n-button>
                </n-drawer-content>
            </n-drawer>
            <n-modal v-model:show="showMap" preset="card">
                <Map></Map>
            </n-modal>
    </div>
</template>

<style scoped>
.main {
    padding: 10px;
}
.folders {
    padding: 0 20px;
}
#cats {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
}
#cats tr th {
    background-color: #809BCE;
    color: white;
}
#cats tr th, td {
    border: 1px solid #eee;
    text-align: left;
    padding: 5px;
}
.folderItem {
    display: flex;
    align-items: center;
}
/* #cats td {
    display: flex;
    justify-content: space-around;
} */
.phone_number{
    width: 100%;
    padding: 6px 12px;
    border: 1px solid #E0E0E6;
    border-radius: 7px;
    outline: none;
}
.phone_number::placeholder{
    color: #C2C2C2;
}
.phone_number:hover{
    border: 1px solid #007BFF;
}
.phone_number:focus{
    /* border: 1px solid #007BFF; */
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
</style>
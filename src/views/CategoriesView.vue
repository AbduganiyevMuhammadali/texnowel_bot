<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { onMounted, ref, watch, inject } from 'vue';
import { AddShoppingCartFilled, CloseOutlined } from '@vicons/material'

const folderUrl = new URL('../assets/folder.png', import.meta.url).href;
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore();
const categories = ref([])
const currencies = ref([])
const imgUrl = inject('imgUrl');
// console.log(imgUrl)
const getAllPaytypes = () => {
    // const body = {
    //     url: 'pay-type',
    //     params: {},
    //     requestType: 'GET',
    //     body: {}
    // }

    axios.get('pay-type',).then((res) => {
        currencies.value = res;
    })
}


const getAll = (parent_id) => {
    if(!parent_id) return
    // const body = {
    //     url: 'product/all-price-balance-not-zero/' + parent_id,
    //     params: {},
    //     requestType: 'POST',
    //     body: {
    //         datetime: Math.floor(new Date().getTime() / 1000),
    //         keyword: "", 
    //         limit: 200,
    //         page: 1,
    //         parent_id: 0,
    //         sklad_id: 1,
    //     }
    // }

    const data = {
        datetime: Math.floor(new Date().getTime() / 1000),
        keyword: "", 
        limit: 200,
        page: 1,
        parent_id: 0,
        sklad_id: 1,
    }

    axios.post('product/all-price-balance-not-zero/' + parent_id, data).then((res) => {
        categories.value = res;
        console.log(res);
    })
}

const getDollarRate = () => {
//   const body = {
//         url: 'dollar-exchange-rate/last',
//         params: {},
//         requestType: 'GET',
//         body: {}
//     }
  axios.get('dollar-exchange-rate/last').then((res) => {
    cartStore.dollarRate = res.rate;
    cartStore.cart.dollar_rate = res.rate;
  })
}

const clickItem = (item) => {
    if(item.is_folder == 1) {
        router.push({ name: 'category', params: { id: item.id } })
    } else {
        showProduct.value = true;
        sProduct.value = item;
    }
}
onMounted(() => {
    const parent_id = route.params.id;
    getAll(parent_id)
    getAllPaytypes()
    getDollarRate()
    cartStore.cart.kontragent_id = parseInt(localStorage.getItem('user_id'))
})
watch(() => route.params.id, (val) => {
    getAll(val)
})
//calc product start
import AddProduct from '../components/AddProduct.vue';
const showProduct = ref(false);
const sProduct = ref({})
//calc product end

//search text start
const searchJob = ref(null)
// watch(() => cartStore.searchText, (val) => {
//     if(val.length < 3) {
//         getAll(route.params.id)
//     } else {
//         if(searchJob.value) {
//             clearTimeout(searchJob);
//         }
//         searchJob.value = setTimeout(() => {
//             const body = {
//             url: 'product/all-price-balance-not-zero/0',
//             params: {},
//             requestType: 'POST',
//             body: {
//                 datetime: Math.floor(new Date().getTime() / 1000),
//                 keyword: val,
//                 limit: 200,
//                 page: 1,
//                 parent_id: 0,
//                 sklad_id: 1
//             }
//             }
//             axios.post('', body).then((res) => {
//                 categories.value = res;
//             })
//         }, 1000)
//     }
// })

//search text end

watch(() => cartStore.searchText, (val) => {
    if (val.length < 3) {
        // Call `getAll` with the parent_id from route params
        getAll(route.params.id);
    } else {
        // Clear the previous timeout if it's still active
        if (searchJob.value) {
            clearTimeout(searchJob.value);
        }

        // Set a new timeout
        searchJob.value = setTimeout(() => {
            const data = {
                datetime: Math.floor(new Date().getTime() / 1000), // Get current timestamp
                keyword: val, // Use search keyword
                limit: 200, // Set the limit for the query
                page: 1, // Page number (defaulted to 1)
                parent_id: 0, // Parent ID (may change depending on use case)
                sklad_id: 1 // Example sklad_id, adjust as necessary
            };

            // Make the axios POST request
            axios.post('product/all-price-balance-not-zero/0', data)
                .then((res) => {
                    categories.value = res.data; // Assuming res.data contains the response data
                })
                .catch((error) => {
                    console.error('Error fetching product data:', error); // Handle any errors
                });
        }, 1000); // 1-second debounce
    }
});

const visibleRef = ref(false)
const onHide = () => (visibleRef.value = false)
const imgRef = ref('')
const onShow = (item, event) => {
    event.stopPropagation()
    imgRef.value = imgUrl + item.picture_name;
    visibleRef.value = true
}
const product_info = ref( {
    name:null,
    brend:null,
    color:null,
    model:null,
    img:null,
    picture_name:null,
    extra_unit1:null
})

const showProductInfo = ref(false)

const info = (item) =>{
    product_info.value = {
        name:null,
        brend:null,
        color:null,
        model:null,
        img:null,
        picture_name:null,
        extra_unit1:null
    }
    showProductInfo.value = true;
    console.log(item.model.name)
    product_info.value.name = item.name
    product_info.value.brend = item.brand.name
    product_info.value.model = item.model.name
    product_info.value.picture_name = item.picture_name
    product_info.value.extra_unit1 = item.extra_unit1.name
    product_info.value.color = item.colour.name

}

const indexRef = ref(0)

</script>

<template>
    
    <div>
        <vue-easy-lightbox
            :visible="visibleRef"
            :imgs="imgRef"
            :index="indexRef"
            >
            <template #close-btn>
                <div @click="onHide" style="position: absolute; z-index: 100; right: 10px; top: 20px">
                    <n-button type="error">
                        <template #icon>
                            <CloseOutlined></CloseOutlined>
                        </template>
                    </n-button>
                </div>
            </template>
        </vue-easy-lightbox>
        <div class="folders">
            <n-form-item label="Тўлов тури" style="margin-top: 10px;">
                <n-select disabled v-model:value="cartStore.pay_type" :options="currencies" label-field="name" value-field="id" />
            </n-form-item>
            

            <div class="card" >
                <div v-for="item in categories">
                <div class="card-item" v-if="item.is_product == 0" >
                        <div class="card-item__img">
                            <img  v-if="item.is_folder == 0" @click="info(item)" 
                            :src="imgUrl+item.picture_name"
                            style="width: 80px; ">
                            <img v-if="item.is_folder == 1" style="width: 80px;" src="https://png.klev.club/uploads/posts/2024-03/png-klev-club-p-papka-png-2.png" alt="">
                        </div>
                        <!-- :src="imgUrl+item.picture_name" -->

                        <div style="text-align: center;">
                            <p v-if="item.is_folder == 0">
                            {{ item.extra_name }}
                            </p>
                            <p v-else style="font-size: 30px; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
                                {{ item.extra_name }}
                            </p>
                        </div>
                        <p v-if="item.is_folder == 0" style="text-align: center ; position: absolute; top: -20px; right: -10px"> 
                            <span v-if="item.balance <= 10" style="background-color: red; padding: 2px 4px; border-radius: 3px; color: #fff" >
                                - 10 
                            </span>
                            <span v-else style="background-color: blue; padding: 2px 4px; border-radius: 3px; color: #fff">
                                10 +
                            </span>
                        </p>
                        <p v-if="item.is_folder == 0" >
                            <span v-if="item.is_price == 0" >
                                {{ new Intl.NumberFormat('ru-RU').format(item.price_register.chakana_dollar_price) }} $
                            </span>
                            <span v-else style="color: red" >
                                Narxi chiqmagan !
                            </span>
                        </p>
                        
                        
                        <n-button v-if="item.is_folder == 0" type="success" class="card-item__button" @click="clickItem(item)">
                            Add
                            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M6.5 2a1.5 1.5 0 0 0-1.415 1H3.5A1.5 1.5 0 0 0 2 4.5v12A1.5 1.5 0 0 0 3.5 18h6.757a5.503 5.503 0 0 1-.657-1H3.5a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5h1.585A1.5 1.5 0 0 0 6.5 5h3a1.5 1.5 0 0 0 1.415-1H12.5a.5.5 0 0 1 .5.5v4.707a5.48 5.48 0 0 1 1-.185V4.5A1.5 1.5 0 0 0 12.5 3h-1.585A1.5 1.5 0 0 0 9.5 2h-3zM6 3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm4.854 6.354a.5.5 0 0 0-.708-.708L7 12.293l-1.146-1.147a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3.5-3.5zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0zm-4-2a.5.5 0 0 0-1 0V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15v-1.5z" fill="currentColor"></path></g></svg>
                        </n-button>
                        <n-button v-if="item.is_folder == 1" type="success" class="card-item__button" @click="clickItem(item)">
                            Kirish
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M20 6h-8l-1.41-1.41C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 9.79V14H9c-.55 0-1-.45-1-1s.45-1 1-1h3v-1.79c0-.45.54-.67.85-.35l2.79 2.79c.2.2.2.51 0 .71l-2.79 2.79a.5.5 0 0 1-.85-.36z" fill="currentColor"></path></svg>
                        </n-button>
                </div>

            </div>
            </div>

            <n-drawer v-model:show="showProduct" :height="240" placement="top">
                <n-drawer-content :title="sProduct.name" closable>
                    <AddProduct :product="sProduct" :pay_type_id="cartStore.pay_type" @add="showProduct = false" :is-cart="false"></AddProduct>
                </n-drawer-content>
            </n-drawer>
            <n-badge @click="router.push({ name: 'cart' })" :value="cartStore.getLength()" style="position: fixed; right: 20px; bottom: 20px;">
                <n-button type="success" style="width: 60px; height: 60px">
                    <template #icon>
                        <n-icon size="40">
                            <AddShoppingCartFilled></AddShoppingCartFilled>
                        </n-icon>
                    </template>
                </n-button>
            </n-badge>
            <n-drawer v-model:show="showProductInfo" :height="350" placement="top" style=" width: 90%; border-radius: 10px; margin: auto; margin-top: 100px;">
                <n-drawer-content :title="sProduct.name" closable>
                    <div>
                        <div class="card-item__img">
                            <img 
                            :src="imgUrl+product_info.picture_name"
                            style="width: 120px; margin-bottom: 10px; border-radius: 10px">
                        </div>
                        <div class="modal-card">
                            <div class="modal-card__item">
                                Name
                            </div>
                            <div class="modal-card__item" >
                                {{ product_info.name }}
                            </div>
                        </div>
                        <div class="modal-card" >
                            <div class="modal-card__item" >
                                Model
                            </div>
                            <div class="modal-card__item" >
                                {{ product_info.model }}
                            </div>
                        </div>
                        <div class="modal-card" >
                            <div class="modal-card__item" >
                                Brend
                            </div>
                            <div class="modal-card__item" >
                                {{ product_info.brend }}
                            </div>
                        </div>
                        <div class="modal-card" >
                            <div class="modal-card__item" >
                                Rangi
                            </div>
                            <div class="modal-card__item" >
                                {{ product_info.color }}
                            </div>
                        </div>
                        <div class="modal-card" >
                            <div class="modal-card__item" >
                                Razmeri
                            </div>
                            <div class="modal-card__item" >
                                {{ product_info.extra_unit1 }}
                            </div>
                        </div>
                    </div>
                </n-drawer-content>
            </n-drawer>
        </div>
    </div>
</template>

<style scoped>
.folders {
    padding: 0 20px;
}
#cats {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
}
#cats tr th {
    background-color: #0047ca;
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
 .card{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    margin-top: 10px;
    gap:10px;
 }
 .card-item{
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    height: 240px;
    max-height: 240px;
 }
 .card-item__button{
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 4px;
    border-radius: 4px;
 }
 .card-item__button svg{
    color: #fff;
    margin-left: 10px;
    width: 20px;
 }
 .card-item__img{
    width: 100%;
    display: flex;
    max-height: 90px;
    align-items: center;
    justify-content: center;
 }

 .card-item__img img{
    max-width: 70px;
    height: 90px;
 }

.modal-card{
    width: 98%;
    display: flex;
    justify-content: space-between;
}
.modal-card__item{
    width: 100%;
    padding: 2px 10px;
    border: 1px dashed #ccc;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: bold;
}
</style>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { AppRegistrationRound, LogInFilled } from '@vicons/material'
const message = useMessage()

const form_data = ref({
    phone_number: '',
    password: ''
})

const router = useRouter();

// const login = async () => {
//     let phoneNumber = form_data.value.phone_number.replace(/[^\d]/g,"")
//     const body = {
//         url: 'kontragent/login',
//         params: {},
//         requestType: 'POST',
//         body: {
//             phone_number: '+'+phoneNumber,
//             password: form_data.value.password
//         }
//     }
//     axios.post('', body).then((res) => {
//         localStorage.setItem('token', res.token);
//         localStorage.setItem('user_id', res.id);
//         router.push({ name: 'category', params: { id: 0 } });
//     })
// }

const login = async () => {
    // Telefon raqamidan faqat raqamlarni olish
    let phoneNumber = form_data.value.phone_number.replace(/[^\d]/g, "");

    // Yangi data obyektini tayyorlash
    let data = {
        phone_number: `+${phoneNumber}`,  // Telefon raqamiga '+' qo'shish
        password: form_data.value.password
    };

    try {
        // POST so'rovini yuborish
        const res = await axios.post('kontragent/login', data);

        // Server javobini konsolga chiqarish
        console.log("Response from server:", res);
        console.log("Response data:", res.id);

        // Agar javobda data bo'lsa
        if (res ) {
            // Javobni konsolda ko'rib chiqish
            console.log("Response data:", res);
            if (res.is_person == 1) {
                message.error("Ruxsat berilmagan !")
            }else{

                // Token va user_id'ni localStorage'ga saqlash
                localStorage.setItem('token', res.token);  // Tokenni saqlash
                localStorage.setItem('user_id', res.id);   // User ID'ni saqlash

                // 'category' sahifasiga yo'naltirish
                router.push({ name: 'category', params: { id: 0 } });
            }
            
        } else {
            console.error("Response data is missing or incorrect");
        }
    } catch (error) {
        console.error("Login failed:", error);
        // Xatolik yuz berganda foydalanuvchiga bildirish
        alert("Login failed. Please check your credentials and try again.");
    }
};





const length = ref(0)
const formatTelNumber = () => {
  if (length.value < form_data.value.phone_number.length) {
    let numbers = formatNumber(form_data.value.phone_number)
    form_data.value.phone_number = numbers
  }
  length.value = form_data.value.phone_number.length
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
    <div class="form">
        <!-- <n-input type="text" placeholder="Телефон" v-model:value="form_data.phone_number" /> -->
        <input class="phone_number" type="text" required v-model="form_data.phone_number" @keyup="formatTelNumber()" maxlength="19" placeholder="Телефон">
        <n-input
            type="password"
            placeholder="Парол"
            show-password-on="mousedown"
            :maxlength="8"
            style="margin-top: 20px;"
            v-model:value="form_data.password"
        />
        <n-button @click="login" type="info" style="width: 100%; margin-top: 20px;" icon-placement="right">Кириш
            <template #icon>
                <n-icon size="25">
                    <LogInFilled></LogInFilled>
                </n-icon>
            </template>
        </n-button>
        <n-button @click="router.push({ name: 'registration' })" type="primary" style="width: 100%; margin-top: 20px;" icon-placement="right">
            Регистрация
            <template #icon>
                <n-icon size="25">
                    <AppRegistrationRound></AppRegistrationRound>
                </n-icon>
            </template>
        </n-button>
    </div>
</template>

<style scoped>
.form {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    padding: 30px;
}
.phone_number{
    /* width: 100%; */
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
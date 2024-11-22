<script setup>
import { ref, onMounted } from 'vue';
import { AppRegistrationRound } from '@vicons/material'
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter()
const form_data = ref({
    name: '',
    phone_number: '',
    password: '',
    telegram_id: '123456',
    sklad_id: 1,
    user_id: null,
    is_person:1,
    from:"Bot oqrali"
})
const userList = ref([])

const getUser = () => {

    axios.get('users/alluser').then((res) => {
        userList.value = res.data
    })
}

const registr = async () => {
    let phoneNumber = form_data.value.phone_number.replace(/[^\d]/g,"")

    let data = {
        name: form_data.value.name,
        phone_number: '+' + phoneNumber,
        password: form_data.value.password,
        sklad_id: form_data.value.sklad_id,
        telegram_id: form_data.value.telegram_id,
        user_id: form_data.value.user_id,
        is_person:form_data.value.is_person,
        from:form_data.value.from
    }
    
    axios.post('kontragent/registration', data).then((res) => {
        router.push({ name: 'login' })
    })
}

onMounted(() => {
    getUser()
})
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
    <div class="main">
        <n-input placeholder="ФИО" v-model:value="form_data.name"></n-input>
        <!-- <n-input placeholder="Телефон" v-model:value="form_data.phone_number" style="margin-top: 10px;"></n-input> -->
        <input class="phone_number" type="text" required v-model="form_data.phone_number" style="margin-top: 10px;" @keyup="formatTelNumber()" maxlength="19" placeholder="Телефон">
        <n-input type="password" placeholder="Парол" v-model:value="form_data.password" style="margin-top: 10px;"></n-input>
        <n-select v-model:value="form_data.user_id" :options="userList" style="margin-top: 10px;" value-field="id" label-field="username"/>
        <n-button @click="registr" type="primary" style="width: 100%; margin-top: 20px;" icon-placement="right">
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
.main {
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
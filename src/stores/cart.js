import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', () => {
  const dollarRate = ref(0);
  const pay_type = ref(3);
  const searchText = ref('');
  const cart = ref({
    dollar_rate: 0,
    dollar_summa: 0,
    refund_money: 0,
    refund_money_dollar: 0,
    sklad_id: 1,
    created_at: new Date()
      .valueOf()
      .toString()
      .slice(0, 10),
    updated_at: new Date()
      .valueOf()
      .toString()
      .slice(0, 10),
    kontragent_id: parseInt(localStorage.getItem('user_id')),
    user_id: 1,
    pay_type_id: 3,
    price_type: "chakana",
    skidka_summa: 0,
    summa: 0,
    comment: "",
    cash_summa: 0,
    plastic_summa: 0,
    count_all: 0,
    from: 'webbot',
    phone_number: '',
    location_text: '',
    lat: 41.311081,
    long: 69.240562,
    telegram_id: 0,
    rasxod_table: []
  })
  const addProduct = (item, isCart) => {
    if(item.count <= 0) {
      return
    }
    const index = cart.value.rasxod_table.findIndex((val) => val.product_id == item.product_id);
    if(index != -1 && !isCart) {

        // cart.value.rasxod_table[index].count += parseFloat(item.count);
        cart.value.rasxod_table[index].pack_count += parseFloat(item.pack_count);
        cart.value.rasxod_table[index].count = parseFloat(cart.value.rasxod_table[index].pack_count) * parseFloat(cart.value.rasxod_table[index].pack_norma);
        cart.value.rasxod_table[index].price = parseFloat(item.price);
        cart.value.rasxod_table[index].summa = parseFloat(cart.value.rasxod_table[index].count) * parseFloat(item.price);
    } else if(isCart) {
      cart.value.rasxod_table[index] = { ...item };
    } else {
        cart.value.rasxod_table.push({ ...item });
    }
  }
  const getOne = (id) => {
    return cart.value.rasxod_table.find((val) => val.product_id == id);
  }
  const clearCart = () => {
    cart.value.dollar_rate = 0;
    cart.value.dollar_summa = 0
    cart.value.refund_money = 0
    cart.value.refund_money_dollar = 0
    cart.value.sklad_id = 1
    cart.value.created_at = new Date()
      .valueOf()
      .toString()
      .slice(0, 10)
    cart.value.updated_at = new Date()
      .valueOf()
      .toString()
      .slice(0, 10)
    cart.value.kontragent_id = parseInt(localStorage.getItem('user_id'))
    cart.value.user_id = 1
    cart.value.pay_type_id = 3
    cart.value.price_type = "chakana";
    cart.value.skidka_summa = 0
    cart.value.comment = ""
    cart.value.cash_summa = 0
    cart.value.plastic_summa = 0
    cart.value.from = 'webbot'
    cart.value.phone_number = ''
    cart.value.location_text = ''
    cart.value.lat = 41.311081
    cart.value.long = 69.240562
    cart.value.telegram_id = 0
    cart.value.rasxod_table = [];
  }
  cart.value.summa = computed(() => {
    let summ = 0;
    for (let index = 0; index < cart.value.rasxod_table.length; index++) {
      const element = cart.value.rasxod_table[index];
      summ += element.summa;
    }
    return summ;
  })
  cart.value.count_all = computed(() => {
    let countall = 0;
    for (let index = 0; index < cart.value.rasxod_table.length; index++) {
      const element = cart.value.rasxod_table[index];
      countall += element.count;
    }
    return countall;
  })

  watch(pay_type, (val) => {
    if(val == 3) {
      for (let index = 0; index < cart.value.rasxod_table.length; index++) {
        const element = cart.value.rasxod_table[index];
        element.price = Number(element.chakana_dollar_price).toFixed(3);
        element.pack_price = Number(element.price) * Number(element.pack_norma).toFixed(3);
        element.summa = Number(element.price) * Number(element.count).toFixed(3);
      }
    } else {
      for (let index = 0; index < cart.value.rasxod_table.length; index++) {
        const element = cart.value.rasxod_table[index];
        element.price = Number(element.chakana_price).toFixed(3);
        element.pack_price = Number(element.price) * Number(element.pack_norma).toFixed(3);
        element.summa = Number(element.price) * Number(element.count).toFixed(3);
      }
    }
  })
  const deleteItem = (item) => {
    const index = cart.value.rasxod_table.findIndex((val) => val.product_id == item.product_id);
    cart.value.rasxod_table.splice(index, 1)
  }
  const getLength = () => {
    return cart.value.rasxod_table.length;
  }
  return { cart, dollarRate, addProduct, pay_type, clearCart, getOne, searchText, deleteItem, getLength }
})
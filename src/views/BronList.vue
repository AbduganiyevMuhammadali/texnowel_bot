<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios'
const bronlist = ref([]);
const products = ref([]);
const getAll = () => {
    // const body = {
    //     url: 'bron/by-kontragent',
    //     params: {},
    //     requestType: 'GET',
    //     body: {}
    // }
    axios.get('bron/by-kontragent').then((res) => {
        bronlist.value = res;
    })
}
const getOne = (id) => {
    axios.get( 'bron/id/'+id,).then((res) => {
        products.value = res.rasxod_table;
    })
}
const columns = [
    {
        title: 'Sana',
        key: 'created_at',
        render: (_) => {
            return new Date(_.created_at * 1000).toLocaleDateString() + "  " + new Date(_.created_at * 1000).toLocaleTimeString()
        }
    },
    {
        title: "Summa",
        key: 'summa',
        render: (_) => {
            return new Intl.NumberFormat('ru-RU').format(_.summa)
        }
    }
]

const columns2 = [
    {
        title: 'Номи',
        key: 'product.extra_name',
        width: '120',
    },
    {
        title: 'Нархи',
        key: 'price',
        width: '50',
        render: (_) => {
            return new Intl.NumberFormat('ru-RU').format(_.price)
        }
    },
    {
        title: 'Сони',
        key: 'count',
        width: '40',
        render: (_) => {
            return new Intl.NumberFormat('ru-RU').format(_.count)
        }
    },
    {
        title: 'Сумма',
        key: 'summa',
        width: '50',
        render: (_) => {
            return new Intl.NumberFormat('ru-RU').format(_.summa)
        }
    }
]
const showDrawer = ref(false);
const rowProps = (row) => {
  return {
    style: "cursor: pointer",
    onClick: () => {
        getOne(row.id);
        showDrawer.value = true;
    },
  };
};
onMounted(() => {
    getAll()
})

</script>
<template>
    <div style="padding: 10px 20px;">
        <n-data-table  :columns="columns" :data="bronlist" :row-props="rowProps"></n-data-table>
        <n-drawer v-model:show="showDrawer" placement="bottom">
            <n-drawer-content title="Маҳсулотлар" closable>
                <n-data-table :columns="columns2" :scroll-x="400" :data="products"></n-data-table>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>
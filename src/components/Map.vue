<script setup>
    import { useCartStore } from '../stores/cart'
    import { onMounted, ref, watch } from 'vue'
    const cart = useCartStore()
    const coords = ref([cart.cart.lat, cart.cart.long])
    const marker_cords = ref([cart.cart.lat, cart.cart.long])
    const lat = ref(cart.cart.lat)
    const long = ref(cart.cart.lat)
    const markerIcon = {
        imageHref: "https://cdn-icons-png.flaticon.com/512/2555/2555572.png",
        imageSize: [43, 43],
        imageOffset: [0, 0],
    }
    const controls =  ['zoomControl','geolocationControl','fullscreenControl','searchControl']
    watch(lat, (val) => {
        cart.cart.lat = val
    })
    watch(long, (val) => {
        cart.cart.long = val
    })
    const onClick = (e) => {
        console.log(e)
        marker_cords.value = e.get('coords')
        lat.value = e.get('coords')[0]
        long.value = e.get('coords')[1]
    }
    onMounted(() => {
        lat.value = cart.cart.lat;
        long.value = cart.cart.long;
        coords.value[0] = cart.cart.lat;
        coords.value[1] = cart.cart.long;
        marker_cords.value[0] = cart.cart.lat;
        marker_cords.value[1] = cart.cart.long;
    })
    </script>
    
    <template>
        <yandex-map
          :coords="coords"
          zoom="9"
          style="height: 200px"
          :controls="controls"
          @click="onClick"
        >
          <ymap-marker marker-id="123" :coords="marker_cords" :icon="markerIcon"/>
        </yandex-map>
    </template>
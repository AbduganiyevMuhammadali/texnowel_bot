import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', () => {
  const errorText = ref('');

  return { errorText }
})

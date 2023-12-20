import { defineStore } from 'pinia'
export const useGraphStore = defineStore('graph', {
    state: () => ({ nodes: 0, edges: 'Eduardo' }),
    getters: {
      doubleCount: (state) => state.count * 2,
    },
    actions: {
      increment() {
        this.count++
      },
    },
  })

import { Store, createStore } from "vuex"
import { InjectionKey } from "vue"

export interface Global {
  SceneInfo?: any
}

export const key: InjectionKey<Store<Global>> = Symbol("global")

export const store = createStore<Global>({
  state: {
    SceneInfo: null
  },

  mutations: {
    updateSceneInfo(state, value: any) {
      state.SceneInfo = value
    }
  }
})

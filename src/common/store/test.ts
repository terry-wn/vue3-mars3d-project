
import { Store, createStore } from "vuex"
import { InjectionKey } from "vue"

export interface Test {
  count?: number
}

export const key: InjectionKey<Store<Test>> = Symbol("test")

export const store = createStore<Test>({
  state: {
    count: 0
  }
})


import { inject, onBeforeMount, onBeforeUnmount } from "vue"

export default function useLifecycle(mapWork: any): void {
  const getMapInstance = inject<any>("getMapInstance")
  onBeforeMount(() => {
    if (mapWork.onMounted) {
      const map = getMapInstance()
      mapWork.onMounted(map)
    }
  })
  onBeforeUnmount(() => {
    if (mapWork.onUnmounted) {
      mapWork.onUnmounted()
    }
  })
}

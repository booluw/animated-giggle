/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp, h } from "vue";

import type { Notification } from "@/types/components";
import Notify from "./Notify.vue";

const useNotification = {
  notifications: [] as Notification[],
  app: null as any,

  notify(notification: Notification) {
    let app = null as any;

    if (!app) {
      app = createApp({
        render() {
          return h(Notify, {
            key: new Date().getSeconds(),
            ...notification
          })
        }
      })

      const container = document.createElement('div');
      document.body.append(container)
      app.mount(container)
    } else {
      app._instance.proxy.$forceUpdate();
    }
  }
}

export default useNotification
export const notify = useNotification.notify


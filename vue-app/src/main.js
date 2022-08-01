import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FontAwesomeIcon from "@/utilities/fontawesome-icons";

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .mount('#app')

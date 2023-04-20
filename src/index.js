import Datatable from "./Datatable.vue";
const plugin = {
    install (Vue) {
        Vue.component('datatable', Datatable)
    }
}

export default plugin

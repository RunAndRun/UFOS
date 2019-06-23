import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Card,
  Notice,
  Input,
  InputNumber,
  Radio,
  Form,
  FormItem,
  Row,
  Col,
  Poptip,
  Avatar,
  Button,
  RadioGroup,
  Select,
  Option,
  Carousel,
  CarouselItem,
  Icon,
  Modal
} from 'iview'
import axios from './axios/client'
import 'iview/dist/styles/iview.css'
import './style/common.css'

Vue.config.productionTip = false

Vue.component('Card', Card)
Vue.component('Input', Input)
Vue.component('InputNumber', InputNumber)
Vue.component('Radio', Radio)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('Row', Row)
Vue.component('Poptip', Poptip)
Vue.component('Avatar', Avatar)
Vue.component('Col', Col)
Vue.component('Button', Button)
Vue.component('RadioGroup', RadioGroup)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Carousel', Carousel)
Vue.component('CarouselItem', CarouselItem)
Vue.component('Icon', Icon)
Vue.component('Modal', Modal)
Vue.prototype.axios = axios
Vue.prototype.$Modal = Modal
Vue.prototype.$Notice = Notice

async function init () {
  let rs = await axios.post('/ufo/user')
  store.commit('setUser', rs.data.data)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
init()

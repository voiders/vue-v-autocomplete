import Vue from 'vue'
import VueResource from 'vue-resource'
import AutoComplete from './main.js'

Vue.use(VueResource);
Vue.use(AutoComplete);

new Vue({
  el: '#app',
  data:{
    isJson:true,
    myIndex : ["name"],
    data: ["Andrea","Bruno","Edgar","Erick","Kirk","Sheydee","Cristian","Luis","Augusto"] 
  },
  methods:{
    label: function(item){
      return item.code + ' - ' + item.name;
    }
  }
})

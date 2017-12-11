import Vue from 'vue'
import VueResource from 'vue-resource'
import AutoComplete from './AutoComplete.vue'

Vue.use(VueResource);

new Vue({
  el: '#app',
  data:{
    isJson:true,
    myIndex : ["name"]
  },
  methods:{
    label: function(item){
      return item.code + ' - ' + item.name;
    }
  },
  components:{
    "vue-v-autocomplete":AutoComplete
  }
})

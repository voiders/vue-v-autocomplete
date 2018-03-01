<template>
  <ul :class="ulStyle + custom" v-show="(showData && focusValue)">
      <li :class="liClass(($index==selectedIndex))" v-for="(item,$index) in originData" @mouseover="hoverItem($index)" :key="$index">
        <a :class="aClass(($index==selectedIndex))"  @click="selectItem(item)" v-text="loadLabel(item,$index,extra)"></a>
      </li>
    </ul>
</template>
<script>
export default {
  name: "ul-list",
  props:{
    'ul-style':{
        type: String,
        default: ''
    },
    'show-data':{
        type: Boolean,
        default: ''
    },
    'focus-value':{
        type: Boolean,
        default: ''
    },
    'selected-index':{
        type: Number
    },
    'origin-data':{
        type: Array,
        default:  () => []
    },
    'li-class' : {
        type : Function,
        default : function(condition){
        }
    },
    'a-class' : {
        type : Function,
        default : function(condition){
        }
    },
    'hover-item' : {
        type : Function,
        default : function(index){
        }
    },
    'select-item' : {
        type : Function,
        default : function(item){
        }
    },
    'load-label' : {
        type : Function,
        default : function(item,$index,extra){
        }
    },
    'extra':{
        type: Object
    }
  },
  data (){
      return{
        custom : ' ul-custom' 
      }
  }
}
</script>

<style>
.ul-custom{
    width: 100%;
    background: white;
}

</style>
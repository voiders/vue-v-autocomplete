<template>

  <div @keydown.delete.stop style="position: relative;" v-click-outside="outClick">
    <input type="text" ref="inputfilter" v-autofocus="focus" placeholder="Opciones" v-model="filter" :class="cstyle.input + 'form-control'" @focus="focusValue = true; showData = true"  @keydown.up="upKey()" @keydown.down="downKey()" @keydown.enter.prevent="selectItemByIndex()" @keydown.tab="selectItemByIndex()">
    <ul :class="cstyle.ul + ' dropdown-ac'" style="display: block; max-height: 300px; height:auto; overflow-y:auto; width: 100%;" v-show="(showData && focusValue)">
      <li :class="{active: ($index==selectedIndex)}" v-for="(item,$index) in originData" @mouseover="hoverItem($index)" >
        <a @click="selectItem(item)" v-text="loadlabel(item,$index,extra)"></a>
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  name: 'vue-v-autocomplete',
	props:{
		'extra':{
			type: Object
		},
		'length':{
			type: Number,
			default : 3
		},
		'data':{
			type: Array,
			default:  () => []
		},
		'indexes':{
			type: Array,
			default:  () => []
		},
		'url':{
			type: String
		},
		'method':{
			type: String,
			default: 'get'
		},
		'id-key' : {
			type: String
		},
		'value':{
			type:Object,
			default: undefined
		},
		'response-key':{
			type:String,
			default: undefined
		},
		'focus' : {
			type: Boolean,
			default: true
		},
		'loadlabel' :{
			type: Function,
			default : function(item,index,extra){
				return item;
			}
		},
		'refitem' : {
			type: Object
		},
		'onchange' : {
			type : Function,
			default : function(item,index,extra){
				// console.log(item);
			}
		},
		'class-input':{
			type: String,
			default : ''
		},
		'class-ul':{
			type: String,
			default : ''
		},
		'json-file' : {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return{
			showData: false,
			focusValue : false,
			selectedIndex : -1,
			componentType: 'autocomplete-default',
			filter:'',
			itemSelected: {},
			originData:[],
			isJsonFile: false,
			cstyle:{
				input:'',
				ul: ''
			}

		}
	},
	methods :{
		hoverItem : function(index){
			this.selectedIndex = index;
		},
		selectItem :function(item){
			this.onchange(item,this.selectedIndex,this.extra);

			if(this["responseKey"]){
				this.$emit('update:refitem',item[this["responseKey"]]);

			}else{
				this.$emit('update:refitem',JSON.parse(JSON.stringify(item)));

			}

			this.filter = this.loadlabel(item,this.extra);
			this.itemSelected = item;
			this.focusValue = false;
		},
		selectItemByIndex : function(){
			if(this.originData){

				this.selectItem(this.originData[this.selectedIndex]);
			}
		},
		updateIndex: function(index){
			this.selectedIndex = index;
			this.selectItemByIndex();
			this.selectItem(this.data[index]);
		},
		upKey:function(){
			if(this.originData){
				if(this.selectedIndex == 0){
					this.selectedIndex = (this.originData.length-1);
				}else{
					this.selectedIndex=this.selectedIndex-1;
				}
				// console.log(this.selectedIndex);
			}

		},
		downKey:function(){
			if(this.originData){
				if(this.selectedIndex == (this.originData.length-1)){
					this.selectedIndex = 0;
				}else{
					this.selectedIndex=this.selectedIndex+1;
				}
				// console.log(this.selectedIndex);
			}
		},
		outClick:  function(e){
			if(document.activeElement != this.$refs.inputfilter){
				this.focusValue = false;
				this.showData = false;
			}
		},
		loadFromValue :function(){
			if(this.value){
				let scope = this;

				if(this["responseKey"]){

					this.data.forEach(function(item,index){
						
						if(scope.value == item[scope["responseKey"]]){
							scope.updateIndex(index);
						}

					});
				}else{
					this.data.forEach(function(item,index){
						
						if(scope.value == item){
							scope.updateIndex(index);
						}

					});
				}
			}
		},
		localSearch: function(){
			var indx = this.indexes;
			var regex = new RegExp(this.filter,'i');
			var scope = this;

			this.originData = [];

			this.data.forEach(function(item){
				var res = false;

				if(indx.length > 0){
					for(var i in indx){
						res = res || regex.test(item[indx[i]]);
					}
				}else{
					
					res = regex.test(item);

				}

				if(res){
					scope.originData.push(item);
				}
			});
			this.showData = (this.data.length > 0);
		}

	},
	computed:{

	},
	watch: {
		filter: function(){
			
			if(!this.url){
				
				this.localSearch();

			}else if(this.isJsonFile){
				let scope = this;
				let call = (this.method.toLowerCase() == 'post')?this.$http.post(this.url):this.$http.get(this.url);
				
				call.then(
					response =>{
						if(scope["idKey"]){
							if(Object.prototype.toString.call(response.body[scope["idKey"]]) == '[object Array]'){
								scope.data = response.body[scope["idKey"]];
							}else{
								scope.data = JSON.parse(response.body[scope["idKey"]]);
							}
							
						}else{
							if(Object.prototype.toString.call(response.body) == '[object Array]'){
								scope.data = response.body;
							}else{
								scope.data = JSON.parse(response.body);
							}

						}
						
						scope.localSearch();
						scope.showData = (scope.data.length > 0);
					},
					response =>{
						scope.data = [];
					}
				);
			}else{
				if(this.filter && this.filter.length >= this.length){
					var scope = this;

					if (this.method.toLowerCase() == 'post') {
						var dest = this.url.split("?")[0];
						var params = this.url.split("?")[1].split("&");
						var data = new FormData();

						for(k in params){

							data.append(params[k].split("=")[0],params[k].split("=")[1]);
						}

						this.$http.post(dest,data).then(
							response =>{
								if(scope["idKey"]){
									scope.originData = response.body[scope.key];

								}else{
									scope.originData = response.body;
								}
								scope.showData = (scope.originData.length > 0);
							},
							response =>{
								scope.data = [];
							}
						);

					}else{
						this.$http.get(this.url+this.filter).then(
							response =>{
								if(scope["idKey"]){
									scope.originData = response.body[scope["idKey"]];

								}else{
									scope.originData = response.body;
								}
								scope.showData = (scope.originData.length > 0);
							},
							response =>{
								scope.data = [];
							}
						);
					}
					this.showData = (this.originData.length > 0);

				}else{
					this.originData = [];
					this.showData = false;
				}

			}
		}
		
	},
	directives: {
		'click-outside': {
			bind: function(el, binding, vNode) {
			
				if (typeof binding.value !== 'function') {
					const compName = vNode.context.name
					let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
					if (compName) { warn += `Found in component '${compName}'` }

					console.warn(warn)
				}
				// Define Handler and cache it on the element
				const bubble = binding.modifiers.bubble
				const handler = (e) => {
					if (bubble || (!el.contains(e.target) && el !== e.target)) {
						binding.value(e)
					}
				}
				el.__vueClickOutside__ = handler

				// add Event Listeners
				document.addEventListener('click', handler)
			},

			unbind: function(el, binding) {
				// Remove Event Listeners
				document.removeEventListener('click', el.__vueClickOutside__)
				el.__vueClickOutside__ = null

			}
		},
		autofocus: {
			inserted: function (el,binding) {

				if(binding.value){
					el.focus();
				}
				
			}
		}
	},
	mounted:function(){
		// this.componentType = this.template;
				
		this.cstyle.input = this['classInput'];
		this.cstyle.ul = this['classUl'];
		this.isJsonFile = this['jsonFile'];

		if(!this.data){
			this.data = [];
		}

		if(!this.indexes){
			this.indexes = [];
		}

		if(!this.url){
			this.focusValue = true;
			this.showData = true;
		}

		if(this.data){
			this.originData = this.data;
			this.focusValue = true;
			this.showData = true;
			this.loadFromValue();
		}
	}
}
</script>

<style>
.dropdown-ac{
	list-style:none;
	position:relative;
	float:left;
	margin:0;
	padding:0;
	border-bottom: 1px solid #000000;
	border-left: 1px solid #000000;
	border-right: 1px solid #000000;
}
.dropdown-ac li{
	margin-top:5px;
	padding: 2px;
}

.dropdown-ac li.active{
	background: #3273DC;
	color: #FFFFFF;
}
</style>

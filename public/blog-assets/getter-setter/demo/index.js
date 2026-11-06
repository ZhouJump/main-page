let data = {
	list:[],
	input:''
}

// 实现数据监听
let myData = {}
myData.data = data
for(let item in data){
	Object.defineProperty(myData, item, {
		get(){
			return myData.data[item]
		},
		set(val){
			myData.data[item] = val
			binds.forEach((bindsItem) => {
				if(bindsItem.getAttribute('bind') === item){
					bindsItem.value = val
					bindsItem.innerHTML = val
				}
			})
			// 当 list 更新时，重新渲染列表
			if(item === 'list') {
				renderList()
			}
		}
	})
}
data = myData

// 渲染列表函数
function renderList() {
	const listContainer = document.querySelector('.list')
	listContainer.innerHTML = data.list.map((item, index) => `
		<div class="item">
			<span>${item}</span>
			<button class="delete" onclick="deleteItem(${index})">Delete</button>
		</div>
	`).join('')
}

// 添加项目函数
function add() {
	if(data.input.trim()) {
		data.list = [...data.list, data.input]
		data.input = '' // 清空输入框
	}
}

// 删除项目函数
function deleteItem(index) {
	data.list = data.list.filter((_, i) => i !== index)
}

// 实现绑定
let binds = document.querySelectorAll('[bind]');
binds.forEach((item) => {
	item.oninput = (e) => {
		data[item.getAttribute('bind')] = e.target.value
	}
})

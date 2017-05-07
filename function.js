function log() {
    console.log.apply(console, arguments)
}

function bindEvent(element, eventName, callback) {
    /*
    element 是一个标签
    eventName 是一个 string, 表示事件的名字
    callback 是一个函数
    用法如下, 假设 button 是一个标签
    bindEvent(button, 'click', function(){
        log('click 事件')
    })
    */
    element.addEventListener(eventName, callback)
}

function removeChildren(element) {
    //用以移除element元素下所有子元素
    while(element.hasChildNodes()){
        element.removeChild(element.lastChild)
    }
}

function bindEventDelegate(element, eventName, callback, responseClass) {
    /*
    element 是一个标签
    eventName 是一个 string, 表示事件的名字
    callback 是一个函数
    responseClass 是一个字符串

    在 element 上绑定一个事件委托
    只会响应拥有 responseClass 类的元素
    */
    element.addEventListener(eventName, function(event){
        let target = event.target
        if(target.classList.contains(responseClass)){
            callback(event)
        }
    })
}

function appendHtml(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

function bindAll(selector, eventName, callback, responseClass) {
    /*
    selector 是一个 string, 选择器, 有如下三种取值
        1, 标签选择器, 如 'div'
        2, class 选择器, 如 '.red'
        3, id 选择器, 如 '#id-input-name'
    eventName 是一个 string, 表示事件的名字
    callback 是一个函数
    responseClass 是一个字符串, 这个参数可以为空
    */
    let targetList = document.querySelectorAll(selector)
    for (var i = 0; i < targetList.length; i++) {
        if (!Boolean(responseClass)) {
            bindEvent(targetList[i], eventName, callback)
        }else {
            bindEventDelegate(targetList[i], eventName, callback, responseClass)
        }
    }
}

// ajax封装
function ajax(request){
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function(){
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

function selectClass(element, className){
    // element是一个元素
    // 该函数遍历element父元素下所有子元素
    // 移除他们的类名为className的类,再给element加上这个类
    //用以实现在同类元素中选中的元素CSS变化
    let parent = element.parentElement
    for(i = 0; i < parent.children.length; i++){
        let child = parent.children[i]
        if(child.classList.contains(className)){
            child.classList.remove(className)
        }
    }
    element.classList.add(className)
}

function toggleClass(element, className){
    element.classList.toggle(className)
}

function e(selector) {
    return document.querySelector(selector)
}

function es(selector) {
    return document.querySelectorAll(selector)
}

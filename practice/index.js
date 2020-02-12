import vue from 'vue'

var node = document.createElement('div');
document.body.appendChild(node);

new vue({
    el: node,
    template:'<div>hello</div>'
})

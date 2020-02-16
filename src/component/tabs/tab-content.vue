<script lang="jsx">
export default {
    name: 'TabContent',
    props: {
        panes: {
            type: Array,
            require: true
        }
    },
    watch:{
    　　data:{
    　　   immediate:true,
           handler:function(){
        
           }
    　　}
    },  　　
    render() {
        const content = this.panes.map(pane => {
            return pane.active ? pane.$slots.default : null;
        });
        return (
            <div class="tab-content">
                {content}
            </div>  
        )
    }
}
</script>
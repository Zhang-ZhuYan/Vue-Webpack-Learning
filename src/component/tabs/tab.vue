<script type="text/jsx" lang="jsx">
export default {
    name: 'Tab',
    inject: ['tabs'],
    props: {
        index: {
            type: [Number,String]
        },
        label: {
            type: String
        }
    },
    mounted(){
        this.$parent.panes.push(this);
    },
    computed: {
        active(){
            return this.tabs.value == this.index;
        }
    },
    methods: {
        handleClick(){
            this.$parent.change(this.index);
        }
    },
    render() {
        const tabName =  `tab_${this.index}`;
        let tabstyle = {
            tab: true,
            active: this.active
        }
        tabstyle[tabName] = true;
        let tagLabel = this.$slots.label || <span>{this.label}</span>;
        return (
            <div class={tabstyle} on-click={this.handleClick}>
                {tagLabel}
            </div>
        ) 
    }
}
</script>
<style scoped>
.tab{
    cursor: pointer;
    padding: 0 20px;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative; 
}
.active{
    color: #409eff;
}

</style>
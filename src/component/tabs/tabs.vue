<script type="text/jsx" lang="jsx">
export default {
    name: 'Tabs',
    provide() {
        let tabs = {};
        Object.defineProperty(tabs,'value',{
            enumerable: true,
            get: (v) => v=this.value
        })
        return {
            tabs
        } 
    },
    data() {
        return {
            activeBarWidth: 50,
            translateX: 0
        }
    },
    props: {
        value: {
            type: [String,Number],
            require: true
        }
    },
    computed: {
        activeBarStyle(){
            return {
                width: `${this.activeBarWidth}px`,
                transform: `translateX(${this.translateX}px)`
            }
        }
    },
    mounted(){
        this.toActiveTab(this.value);
    },
    methods: {
        change(index){
            this.$emit('change',index);
            this.toActiveTab(index);
        },
        toActiveTab(index){
            const tabNav = this.$refs.tabsNav;
            const tab = this.$el.querySelector('.tab_'+index);
            const tabNavRect = tabNav.getBoundingClientRect();
            const tabRect = tab.getBoundingClientRect();
            this.translateX = Math.abs(tabRect.left - tabNavRect.left);
            this.activeBarWidth = tabRect.width;
        }
    },
    render() {
        return (
            <div class="tabs">
                <div class="tabs-nav" ref="tabsNav">
                    <div class="tabs__active-bar" style={this.activeBarStyle}></div>
                    {this.$slots.default}
                </div>
            </div>
        )
    }
}
</script>
<style scoped>
.tabs{
  display: block;
  position: relative;
}
.tabs-nav{

}
.tabs:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #e4e7ed;
    z-index: 1;
}
.tabs__active-bar {
    width: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: #409eff;
    z-index: 2;
    transition: transform .3s cubic-bezier(.645,.045,.355,1);
    list-style: none;
}
</style>

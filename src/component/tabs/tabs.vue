<script type="text/jsx" lang="jsx">
export default {
    name: 'Tabs',
    props: {
        value: {
            type: [String,Number],
            require: true
        }
    },
    render() {
        return (
            <div class="tabs">
                <div class="tabs-nav">
                    <div class="tabs__active-bar"></div>
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
    /*background-color: #e4e7ed;*/
    background-color: red;
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

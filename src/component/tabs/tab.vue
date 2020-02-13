<script type="text/jsx" lang="jsx">
export default {
    name: 'Tab',
    props: {
        index: {
            type: [Number,String]
        },
        label: {
            type: String
        }
    },
    computed: {
        active(){
            return true;
        }
    },
    render() {
        const tabstyle = {
            tab: true,
            active: this.active
        }
        let tagLabel = this.$slots.label || <span>{this.label}</span>;
        return (
            <div class={tabstyle}>
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

</style>
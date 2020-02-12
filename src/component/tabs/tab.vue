<script lang="jsx">
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
            return false;
        }
    },
    render() {
        /*const tabstyle = {
            tab: true,
            active: this.active
        }
        const tagLabel = this.$slots.label || <span>{this.label}</span>;
        retrun (
            <div class={tabstyle}>
               {tabLabel}
            </div>
        )*/
        return (
            <div>1111</div>
        )
    }
}
</script>
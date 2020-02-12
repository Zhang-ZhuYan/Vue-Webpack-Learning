<script lang="jsx">
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
            /*<div class="tabs">
                <div class="tabs-nav">
                    {this.$slots.default}
                </div>
            </div>*/
            <div>2222</div>
        )
    }
}
</script>
<style scoped>
.tabs{
  display: block;
}
.tabs-nav{

}
</style>

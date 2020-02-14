<script lang="jsx">
export default {
    name: 'TabContent',
    props: {
        panes: {
            type: Array,
            require: true
        }
    },
    render() {
        const content = this.panes.map(pane => {
            return pane.active ? pane.$slots.default : null;
        });
        return (
            <div>{ content }</div>  
        )
    }
}
</script>
export default {
    updateCountAsync(store, args){
        setInterval(function () {
            var preValue = store.state.count;
            store.commit('updateCount', preValue+args.count);
        }, args.timer)
    }
}

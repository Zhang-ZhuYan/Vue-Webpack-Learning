import '../../static/assets/style/footer.css'
export default {
    data(){
        return {
            author: 'zzy'
        }
    },
    render(){
        return (
            <div class="footer">
                <div>created by {this.author}</div>
            </div>
        )
    }
}
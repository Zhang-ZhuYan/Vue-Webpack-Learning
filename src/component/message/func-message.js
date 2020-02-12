import message from './message.vue'

export default {
    extends: message,
    computed: {
        style(){
            return {
                position: 'fixed',
                right: '0px',
                bottom: `${this.verticalOffset}px`
            }
        }
    },
    data(){
        return {
            verticalOffset: 0,
            autoClose: 3000,
            timer: null
        }
    },
    methods: {
        createTimer(){
            if(this.autoClose){
                this.timer = setTimeout(() => {
                    this.visible = false;
                },this.autoClose);
            }
        },
        clearTimer(){
            if(this.timer){
                clearTimeout(this.timer);
            }
        }
    },
    mounted(){
        this.createTimer();
    },
    destroyed(){
        this.clearTimer();
    }
}
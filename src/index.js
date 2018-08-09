import MessageCenterComponent from './MessageCenter.vue'
import MessageService from './MessageService' // user API that sends things to EventBus

const MessageCenter = {
    install(Vue, options) {
        Vue.prototype.$messages = MessageService;
        Vue.component('vue-sticky-messages', MessageCenterComponent);
    }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MessageCenter)
}

export default MessageCenter;
var MessageCenterComponent = require('./MessageCenter.vue')
var MessageService = require('./MessageService')

const MessageCenter = {
    install(Vue, options) {
        Vue.prototype.$messages = MessageService;
        Vue.component('message-center', MessageCenterComponent);
    }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MessageCenter)
}

module.exports = MessageCenter;
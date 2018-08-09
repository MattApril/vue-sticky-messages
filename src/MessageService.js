import { EventBus } from './EventBus';

const MessageService = {

    add( type, msg ) {
        EventBus.$emit('app-msg', {
            type: type,
            msg: msg
        });
    },

    success( msg ) {
        this.add('success', msg);
    },

    error( msg ) {
        this.add('error', msg);
    },

};

module.exports = MessageService;
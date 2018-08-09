import { EventBus } from './EventBus';

/**
 * Message API
 * Interfaces with EventBus
 */
export default {

    /**
     * Sends a message of specified type
     * @param type
     * @param msg
     */
    add( type, msg ) {
        EventBus.$emit('app-msg', {
            type: type,
            msg: msg
        });
    },

    /**
     * Sends a success message
     * @param msg
     */
    success( msg ) {
        this.add('success', msg);
    },

    /**
     * Sends an info message
     * @param msg
     */
    info( msg ) {
        this.add('info', msg);
    },

    /**
     * Sends a warning message
     * @param msg
     */
    warning( msg ) {
        this.add('warning', msg);
    },

    /**
     * Sends an error message
     * @param msg
     */
    error( msg ) {
        this.add('error', msg);
    },

}
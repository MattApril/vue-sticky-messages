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
    send(msg, type) {
        EventBus.$emit('app-msg', {
            msg: msg,
            type: type
        });
    },

    /**
     * Sends a success message
     * @param msg
     */
    success(msg) {
        this.send(msg, 'success');
    },

    /**
     * Sends an info message
     * @param msg
     */
    info(msg) {
        this.send(msg, 'info');
    },

    /**
     * Sends a warning message
     * @param msg
     */
    warning(msg) {
        this.send(msg, 'warning');
    },

    /**
     * Sends an error message
     * @param msg
     */
    error(msg) {
        this.send(msg, 'danger');
    },

}
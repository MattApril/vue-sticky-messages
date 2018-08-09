<template>
    <div v-show="messages.length > 0"
         id="message_center"
         ref="message_center"
         class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-md-offset-4"
         :class="{fade: isClosing}">

        <div id="message-box"
             @mouseover="handleMouseOver"
             @mouseout="handleMouseOut">

            <!-- Close All -->
            <div class="clearfix">
                <button v-show="messages.length > 1" @click.stop="close" type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <!-- Show MAX_VISIBLE messages -->
            <div v-for="(message, index) in visibleMessages" class="message-row alert alert-dismissible message-dismissible" :class="['alert-' + message.type]" role="alert">
                <!-- this close button only gets shown if we have one message, so we have some way to close it -->
                <button v-show="messages.length == 1" @click="close" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {{message.text}}
            </div>

            <!-- Show More -->
            <div v-show="collapsedMessages.length">
                <div class="collapse" id="hiddenMessages">
                    <div v-for="(message, index) in collapsedMessages" class="message-row alert alert-dismissible message-dismissible" :class="['alert-' + message.type]" role="alert">
                        {{message.text}}
                    </div>
                </div>
                <a @click="showMore = !showMore" role="button" data-toggle="collapse" href="#hiddenMessages" aria-expanded="false" aria-controls="hiddenMessages">
                    <em>
                        <span v-if="showMore">show less</span>
                        <span v-else>show {{collapsedMessages.length}} more..</span>
                    </em>
                </a>
            </div>

        </div>

    </div>
</template>

<style scoped>
    #message_center {
        position: -webkit-sticky;
        position: sticky;
        top: 5px;
        z-index: 200;
    }

    #message-box {
        /* modified from .well */
        min-height: 20px;
        padding: 3px 5px;
        margin-bottom: 20px;
        background-color: #b5b5b5;
        border: 1px solid #999999;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }

    #message-box .message-row {
        margin: 0;
        padding: 5px;
    }
    #message-box .message-dismissible {
        padding-right: 35px;
    }

    a {
        color: black;
    }

    .fade {
        visibility: hidden;
        opacity: 0;
        -webkit-transition: visibility 0s 3s, opacity 3s linear;
        transition: visibility 0s 3s, opacity 3s linear;
    }
</style>

<script>
    import { EventBus } from './EventBus'
    import VueScrollTo from 'vue-scrollto'

    /**
     * Maximum number of messages to always display (outside of the collapse section)
     * @type {number}
     */
    const MAX_VISIBLE = 1;

    /**
     * Maximum number of messages to store
     * @type {number}
     */
    const MAX_MESSAGES = 6;

    /**
     * Maximum time in seconds (without any interaction) before we automatically clear the messages
     * @type {number}
     */
    const MAX_KEEP_ALIVE = 6;

    /**
     * Stores setTimeout reference for countdown before calling fadeClose
     */
    var closeTimer = null;

    /**
     * Stores setTimeout reference for faceClose countdown
     */
    var fadeTimer = null;

    export default {

        props: {
            msg: String,
            msgType: String
        },

        created: function() {
            // listen for events on our EventBus
            EventBus.$on('app-msg', this.handleEvent);
            // listen for all clicks on the document
            window.addEventListener('click', this.handleDocumentClick);
        },

        mounted: function() {
            // display initial message
            if( this.msg ) {
                var type = this.msgType || 'info';
                this.addMsg( type, this.msg );
            }
        },

        data: function(){
            return {
                messages: [],
                MAX_VISIBLE: MAX_VISIBLE,
                showMore: false,
                isClosing: false,
                scroll_config: {
                    container: 'body',
                    easing: 'ease-in',
                    cancelable: false
                }
            };
        },

        computed: {
            visibleMessages: function() {
                return this.messages.slice(0, MAX_VISIBLE);
            },
            collapsedMessages: function() {
                return this.messages.slice(MAX_VISIBLE);
            }
        },

        methods: {
            /**
             * Handle an app-msg event
             * @param payload
             */
            handleEvent: function( payload ) {

                console.log(payload);

                if( payload.msg ) {
                    var type = payload.type || 'info'
                    this.addMsg(type, payload.msg);

                    // if the message center is not in view, we need the user to see it - so scroll to it.
                    // this is a fallback mechanism for browsers that do not support sticky positioning.
                    // also note that it should always be in view for browsers that so, so it's also a feature detection in a way.
                    var vm = this;
                    Vue.nextTick( function(){
                        if( !isElementInViewport(vm.$refs.message_center) ) {
                            VueScrollTo.scrollTo(vm.$refs.message_center, 300, vm.scroll_config);
                        }
                    });
                }
            },

            /**
             * Add message to list
             * @param type
             * @param text
             */
            addMsg: function( type, text ) {
                // prepend new message to front of array
                this.messages.unshift({
                    text: text,
                    type: type
                });

                // limit number of messages to store, for UI and sanity reasons
                // removing from the end
                if( this.messages.length > MAX_MESSAGES ) {
                    this.messages.splice(MAX_MESSAGES);
                }

                this.restartCloseTimer( MAX_KEEP_ALIVE );
            },

            /**
             * Cancels any existing timeout and starts the close timer over for N seconds
             * @param seconds
             */
            restartCloseTimer: function( seconds=2 ) {
                // first make sure we clear any existing timer
                this.stopCloseTimer();
                // now delay for N seconds before initiating fadeClose
                closeTimer = setTimeout( this.fadeClose, seconds * 1000 );
            },

            /**
             * cancels and active timers for either closing or fading closed
             */
            stopCloseTimer: function() {
                // if we are stopping the close we also want to make sure any active fadeClose is also cleared
                this.cancelFadeClose();
                clearTimeout( closeTimer );
                closeTimer = null;
            },

            /**
             * Initialize a delayed fade out close
             */
            fadeClose: function() {
                // make sure we kill any active timer that would re-call this same method again
                this.stopCloseTimer();
                // set the isClosing state
                this.isClosing = true;
                // wait for 3 seconds before actually closing, this gives the user a chance to prevent the close
                // NOTE: if you change this time you must also update the css transition times.
                fadeTimer = setTimeout( this.close, 3000 );
            },

            /**
             * Cancels the fade close.
             */
            cancelFadeClose: function() {
                this.isClosing = false;
                clearTimeout( fadeTimer );
                fadeTimer = null;
            },

            /**
             * Clears messages and closes
             */
            close: function() {
                this.messages = [];
                this.stopCloseTimer();
                this.$emit('closed');
            },

            /**
             * Handles mouseover event
             */
            handleMouseOver: function() {
                // when user hovers over we want to keep the message center visible indefinitely
                this.stopCloseTimer();
            },

            /**
             * Handles mouseout event
             */
            handleMouseOut: function() {
                // once user leaves we can leave it open for a couple seconds then fade out.
                // the check for existing messages is a fix caused by mouseout being triggered when we click the close button
                if( this.messages.length ) {
                    this.restartCloseTimer(2);
                }
            },

            /**
             * Global document click handler
             * @param e
             */
            handleDocumentClick: function(e) {
                // if we clicked on anything other than the message center, initiate a fadeClose right away.
                // the idea is that the user is doing something else and does not case about us anymore :(
                // and of course we only care to do this if we actually have any messages in the first place
                if( this.messages.length && !this.$refs.message_center.contains(e.target) ){
                    this.fadeClose();
                }
            }

        }
    }

    /**
     * Tests if an element is visible
     * @param el
     * @returns {boolean}
     */
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }
</script>
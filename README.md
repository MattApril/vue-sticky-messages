 # vue-sticky-messages

A message/toast component for vue. Currently depends on bootstrap styling, but that will hopefully change soon.

## Installing

A step by step series of examples that tell you how to get a development env running

#### Via NPM
```
npm install vue-sticky-messages
```
#### Direct script usage
```
<script src="https://unpkg.com/vue"></script>
<!-- comes after Vue -->
<script src="https://unpkg.com/vue-sticky-messages"></script>
```

## Basic Usage

Setup for Node environments only:
```
import StickyMessages from 'vue-sticky-messages'
Vue.use(StickyMessages)
```

Add the component to your page. Typically this will be someone at the top of your layout. The component uses [position:sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position#Types_of_positioning) css rule. Therefore once the user scrolls past its static position on the page it will remain "stuck". 
```
<vue-sticky-messages></vue-sticky-messages>
```

To display a message from within a component:
```
// send a message of a specific type
this.$messages.success('good job!');
this.$messages.error('ruh-roh.');
this.$messages.warning('careful...');
this.$messages.info('hello');


// or to programatically define the type of message use the send method:
this.$messages.send( 'type', 'msg' );
```

## Advanced Usage

#### Props

| Prop            | Type   | Default | Description                                                                                        |
|-----------------|--------|---------|----------------------------------------------------------------------------------------------------|
| msg             | String |         | Default message when component is initialized                                                      |
| msg-type        | String |         | Uses `default-type` if not specified                                                               |
| max-uncollapsed | Number | 1       | Maximum number of messages to always display (outside of the collapse section)                     |
| max-messages    | Number | 5       | Maximum number of messages to store                                                                |
| auto-fade-delay | Number | 6       | Maximum time in seconds (without any other interaction) before we automatically clear the messages |
| fade-seconds    | Number | 3       | Time in seconds that is takes for the fade animation to play out and fully close the notification. |
| default-type    | String | 'info'  | Default type of message to display when no type is specified                                       |


```
<vue-sticky-messages
        msg="Initial message when component mounted"
        msg-type="success"
        default-type="info"
        :max-uncollapsed="1"
        :max-messages="5"
        :auto-fade-delay="6"
        :fade-seconds="3"
></vue-sticky-messages>
```

## TO DO
* Remove bootstrap dependency
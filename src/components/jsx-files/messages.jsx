import { defineComponent } from "vue";

const MessageList = defineComponent({
    name: 'MessageList',
    props: {
        messages: Array,
        my_user_id: String
    },

    render() {
        let message_list;

        if (this.messages && this.messages.length > 0) {
            message_list = this.messages.map((message, index) => (
                <li key={index} class={message.sender_id === this.my_user_id ? 'my-message' : 'received-message'}>
                    { message.text } <small class="message-timestamp"> { message.created_at.date.slice(10, 16) } </small>
                </li>
            ));
        }

        return (
            <ul id="messages-list">
                { message_list }
            </ul>
        );
    }
});

export default MessageList;

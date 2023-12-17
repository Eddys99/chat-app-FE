class MessageDTO {
    constructor(text, user, conversation_id = null) {
        this.sender_id = user.user_id;
        this.conversation_id = conversation_id;
        this.text = text;
    }
}

export default MessageDTO;

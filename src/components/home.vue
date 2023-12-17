<template>
    <header>
        <div id="search-container">
            <input type="text" placeholder="type username" id="search-bar" >
            <button @click="addFriend" id="search-btn"> Add friend </button>
        </div>
        <div id="routes-container">
            <button @click="friendRequests" class="user-auth-btn"> Friend Requests </button>
            <button @click="logoutUser" class="user-auth-btn"> Logout </button>
        </div>
    </header>
    <div id="chat-window">
        <div id="friends-list">
            <FriendList :friends="friends"/>
        </div>
        <div id="chat-container">
            <div id="messages-window">
                <MessageList :messages="messages" :my_user_id="my_user_id"/>
            </div>
            <div id="input-container">
                <textarea id="msg-input" rows="1" v-on:keydown="adjustHeight"></textarea>
                <button id="send-msg-button" v-on:click="interceptMessage"> Send </button>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

import FriendList from "./jsx-files/friend-list.jsx";
import MessageList from "./jsx-files/messages.jsx";

import MessageDTO from '../dtos/message-dto.js';

export default {
    components: {
        FriendList,
        MessageList
    },
    name: "home",
    data() {
        return {
            shift_key: false,
            // messages: [
            //     {
            //         "_id": "654800c124c69d11dc722dea",
            //         "request_id": "652317c39a4f091bd62e0a38_1699217601862",
            //         "conversation_id": null,
            //         "sender_id": "652317c39a4f091bd62e0a38",
            //         "text": "Message",
            //         "created_at": {
            //             "date": "2023-11-05 20:53:21",
            //             "timestamp": "1699217601866"
            //         }
            //     },
            //     {
            //         "_id": "654800c124c69d11dc722dea",
            //         "request_id": "652317c39a4f091bd62e0a38_1699217601862",
            //         "conversation_id": null,
            //         "sender_id": "652317c39a4f091bd62e0a38 2",
            //         "text": "Received Message 2",
            //         "created_at": {
            //             "date": "2023-11-05 20:53:21",
            //             "timestamp": "1699217601866"
            //         }
            //     },
            //     {
            //         "_id": "654800c124c69d11dc722dea",
            //         "request_id": "652317c39a4f091bd62e0a38_1699217601862",
            //         "conversation_id": null,
            //         "sender_id": "652317c39a4f091bd62e0a38",
            //         "text": "Message 2",
            //         "created_at": {
            //             "date": "2023-11-05 20:53:21",
            //             "timestamp": "1699217601866"
            //         }
            //     }
            // ],
            // friends: ["user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user",
            //     "user"
            // ],
            messages: [],
            friends: [],
            my_user_id: JSON.parse(localStorage.getItem(('user'))).user_id
        }
    },
    async mounted() {
        try {
            this.socket = io('http://localhost:3045');

            this.socket.on('connected', () => {
                console.log('Connected to the server');
            });
        } catch (error) {
            console.error(`[SocketClient] something went wrong: `, { error });
        }

        this.friends = await this.getFriendList();
        this.messages = await this.getMessageList();

        console.log(this.friends);
    },
    methods: {
        logoutUser: function() {
            localStorage.removeItem('user');
            this.$router.push('/login');
        },

        adjustHeight: function(event) {
            const textarea = document.getElementById('msg-input');
            if (event.key === 'Shift') {
                this.shift_key = true;
            }

            if (event.key === 'Enter' && this.shift_key === false) {
                event.preventDefault();
                this.interceptMessage();
            } else if (event.key === 'Enter' && this.shift_key === true) {
                this.shift_key = false;
            } else if ((event.key !== 'Enter' && event.key !== 'Shift') && this.shift_key === true) {
                this.shift_key = false;
            }

            let count = 0;
            for (let i = 0; i < textarea.value.length; i++) {
                const searchForNewSpace1 = (JSON.stringify(textarea.value[i]) === JSON.stringify("\n"));
                const searchForNewSpace2 = (JSON.stringify(textarea.value[i]) === JSON.stringify("\r"));
                if (searchForNewSpace1 || searchForNewSpace2) {
                    count++;
                }
            }

            if (textarea.rows < 5) {
                textarea.rows = count + 1;

                textarea.style.overflowY = "scroll";
                textarea.style.overflowX = "hidden";
            }

            if (textarea.rows > count) {
                textarea.rows = count;
            }

            if (count === 0) {
                textarea.rows = 1;

                textarea.style.overflowY = "hidden";
                textarea.style.overflowX = "hidden";
            }
        },

        interceptMessage: function() {
            const textarea = document.getElementById('msg-input');

            if (textarea.value.length === 0) {
                textarea.style.border = "solid 1px #ff0000";
            } else {
                this.sendPrivateMessage(textarea.value);
                textarea.value = '';
                textarea.style.border = "none";
            }
        },

        getMessageList: async function() {
            if (this.$router.params && this.$router.params.conversation_id) {
                try {
                    const response = await axios.post(`http://localhost:3035/messages/get-messages`, this.$router.params.conversation_id);
                    this.messages = response.data;
                } catch (error) {
                    console.error('Something went wrong at getting messages: ', { error });
                    this.messages = null;
                }

            } else {
                this.messages = null;
            }

            return this.messages;
        },

        getFriendList: async function() {
            if (this.$router.params && this.$router.params.conversation_id) {
                try {
                    const payload = [this.my_user_id, this.$router.params.conversation_id];
                    const response = await axios.post('http://localhost:3035/conversations/get-friends', payload);
                    this.friends = response.data;
                } catch(error) {
                    console.error(`Something went wrong at getting the friend list: `, { error });
                    this.friends = null;
                }

            } else {
                this.friends = null;
            }

            return this.friends;
        },

        sendPrivateMessage: function(text) {
            const message = new MessageDTO(text, JSON.parse(localStorage.getItem('user')), this.$router.params.conversation_id);
            try {
                this.socket.emit('private-message', (message));
            } catch (error) {
                console.error('[sendPrivateMessage] failed to send message: ', { error });
            }
        },

        friendRequests: function() {
            return this.$router.push('/friend-requests');
        },

        addFriend: async function() {
            const username = document.getElementById('search-bar').value;
            const my_data = JSON.parse(localStorage.getItem(('user')));
            const payload = { username, my_data };
            await axios.post(`http://localhost:3035/conversations/add-friend`, payload);
        }
    },
    beforeDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
</script>

<style>
::-webkit-scrollbar {
    width: 0;
}

header {
    display: flex;
    padding: 0;
    justify-content: space-between;
    background-color: #5916e0;
}

#search-bar {
    padding: 10px 35px;
    margin-left: 25px;
    outline: none;
    border: none;
    border-radius: 25px;
    background-color: #260479;
    color: #fff;
}

#search-btn {
    padding: 10px 15px;
    margin-left: 10px;
    text-align: center;
    cursor: pointer;

    background-color: #260479;
    color: #fff;
    border: none;
    border-radius: 3px;
}

.user-auth-btn {
    background-color: #260479;
    color: #fff;
    padding: 10px 15px;
    margin-right: 15px;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    text-decoration: none;
}

.user-auth-btn, #search-bar, #search-btn {
    margin-top: 10px;
    margin-bottom: 10px;
}

#chat-window {
    margin: 50px 25px 0 25px;
    padding: 0 25px 25px 50px;
    border: 2px solid #424242;
    border-radius: 10px;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    height: 100%;
}

#chat-container {
    width: 85%;
}

#messages-window {
    margin: 30px 25px 0 25px;
    padding: 0 50px 20px 10px;
    max-width: 90%;
    border: 2px solid #424242;
    border-radius: 10px;
    background-color: #1a1a1a;
    color: #ffffff;
    overflow-y: auto;
    max-height: 500px;
    min-height: 500px;
}

#friends-list {
    margin: 30px 25px 20px 10px;
    padding: 0 10px 25px 0;
    width: 15%;
    border: 2px solid #424242;
    border-radius: 10px;
    background-color: #1a1a1a;
    color: #ffffff;
    overflow-y: auto;
    max-height: 570px;
    min-height: 570px;
}

#input-container {
    display: flex;
    align-items: center;
}

#msg-input {
    margin: 15px 25px 5px 40px;
    padding: 10px 70% 10px 15px;
    border-radius: 25px;
    background-color: #424242;
    outline-width: 0;
    color: white;
    font-size: 15px;
    resize: none;
    overflow: hidden;
    line-height: 20px;
}

#send-msg-button {
    margin: 25px 20px 25px 10px;
    padding: 10px 25px;
    border-radius: 25px;
    border: none;
    background-color: #5916e0;
    color: white;
    cursor: pointer;
}

.friend-from-list {
    padding: 12px 0;
}

.received-message, .my-message, .friend-from-list {
    list-style: none;
}

#messages-list {
    margin: 5px -20px;
}

.received-message, .my-message {
    text-align: left;
    margin: 10px 0;
    padding: 20px 25px;
    max-width: 35%;
    border-radius: 25px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    clear: both;
}

.received-message {
    background-color: #5916e0;
    float: left;
}

.my-message {
    background-color: #313131;
    float: right;
}

.message-timestamp {
    padding-left: 15px;
}

.my-message > .message-timestamp {
    color: #6c6c6c;
}

.received-message > .message-timestamp {
    color: #b48cff;
}
</style>

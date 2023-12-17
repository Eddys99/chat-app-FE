import { defineComponent } from "vue";

const FriendList = defineComponent({
    name: 'FriendList',
    props: {
        friends: Array
    },
    render() {
        let friend_list;

        if (this.friends && this.friends.length > 0) {
            friend_list = this.friends.map((friend, index) => (
                <li key={index} class="friend-from-list" onClick={this.$router.push(`/${friend._id}`)}>
                    { friend }
                </li>
            ));
        } else {
            friend_list = <p> No friends 😢 </p>
        }

        return (
            <ul id="friends-list-ul">
                { friend_list }
            </ul>
        );
    }
});

export default FriendList;

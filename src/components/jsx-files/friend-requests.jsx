import { defineComponent } from "vue";

const FriendRequests = defineComponent({
    name: 'FriendRequests',
    props: {
        friend_requests: Array
    },
    render() {
        let friend_requests_list;

        return (
            <ul id="friends-requests-list-ul">
                { friend_requests_list }
            </ul>
        );
    }
});

export default FriendRequests;

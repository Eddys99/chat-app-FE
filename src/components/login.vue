<template>
    <form id="login-form">
        <h2> Authenticate </h2>
        <h3 v-if="showErrorMessage"> {{ errors }} </h3>
        <input type="text" autocomplete="username" placeholder="username" class="login-form-input" id="login-username">
        <input type="password" placeholder="password" class="login-form-input" id="login-password">
        <button class="user-auth-btn" @click="loginUser"> Login </button>
        <router-link to="/register" id="router-link"> Go register </router-link>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: "login",
    data() {
        return {
            showErrorMessage: false,
            errors: ""
        }
    },
    methods: {
        loginUser: function(event) {
            event.preventDefault();

            const userCredentials = {
                username: document.getElementById('login-username').value,
                password: document.getElementById('login-password').value
            }

            this.errors = this.checkRegistrationFields(userCredentials);
            if (this.errors.length > 0) {
                this.showErrorMessage = true;
            } else {
                axios.post(`http://localhost:3035/user/login`, userCredentials)
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        this.$router.push('/');
                    })
                    .catch(error => {
                        console.error(`Login failed: `, { error });
                    })
            }
        },

        checkRegistrationFields: function(data) {
            let errors = [];

            Object.keys(data).forEach(key => {
                if (!data[key]) {
                    errors.push(`${key} is missing`);
                }
            });

            return errors;
        }
    }
}
</script>

<style scoped>
#login-form {
    width: 300px;
    margin: 100px auto;
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
}

.login-form-input {
    width: 90%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.user-auth-btn {
    background-color: #5916e0;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

#router-link {
    text-decoration: none;
    margin: 0 0 0 15px
}
</style>

<template>
    <form id="register-form">
        <h2> Register </h2>
        <ul v-if="showErrorMessage">
            <li v-for="(error, index) in errors" :key="index"> {{ error }} </li>
        </ul>
        <input type="text" autocomplete="username" placeholder="username" class="register-form-input" id="register-username">
        <input type="email" autocomplete="email" placeholder="email" class="register-form-input" id="register-email">
        <input type="password" placeholder="password" class="register-form-input" id="register-password">
        <input type="password" placeholder="confirm password" class="register-form-input" id="register-confirm-password">
        <button class="user-auth-btn" @click="registerUser"> Register </button>
        <router-link to="/login" id="router-link"> Go login </router-link>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: "register",
    data() {
        return {
            showErrorMessage: false,
            errors: ""
        }
    },
    methods: {
        registerUser: function(event) {
            event.preventDefault();

            const userCredentials = {
                username: document.getElementById('register-username').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                confirm_password: document.getElementById('register-confirm-password').value,
            }

            this.errors = this.checkRegistrationFields(userCredentials);
            if (this.errors.length > 0) {
                this.showErrorMessage = true;
            } else {
                axios.post('http://localhost:3035/user/register', userCredentials)
                    .then(noop => {
                        console.log('Registered');
                    })
                    .catch(error => {
                        this.showErrorMessage = true;
                        this.errors = ["Registration failed due to server error"];
                        console.error(`Registration failed: `, { error });
                    });
            }
        },

        checkRegistrationFields: function(data) {
            let errors = [];

            Object.keys(data).forEach(key => {
                if (!data[key]) {
                    errors.push(`${key} is missing`);
                }
            });

            if (data.password !== data.confirm_password) {
                errors.push("Passwords don't match");
            }

            return errors;
        }
    }
}
</script>

<style scoped>
#register-form {
    width: 300px;
    margin: 100px auto;
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
}

.register-form-input {
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

}
</style>

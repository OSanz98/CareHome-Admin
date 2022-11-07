<template>
  <div class="login container">
    <!-- form to allow admin to log in to the Firebase Authentication and website. -->
    <form @submit.prevent="login" class="card-panel">
      <h2 class="center deep-purple-text">Login</h2>
      <!-- email field -->
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email" />
      </div>
      <!-- password field -->
      <div class="field">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model="password" />
      </div>
      <p v-if="feedback" class="red-text center">{{feedback}}</p>
      <!-- log in button. -->
      <div class="field">
        <button class="btn deep-purple">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
// import libraries
import firebase from "firebase";
export default {
  // variables initialised.
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    // function used to authenticate the user's account details. If successful redirects user to the home page.
    // If not it will display an error message.
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            console.log(cred.user);
            this.$router.push({ name: "Index" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = "Please fill in both fields";
      }
    }
  }
};
</script>

<style>
/* styling for the log in screen. */
.login {
  max-width: 400px;
  margin-top: 60px;
}
.login h2 {
  font-size: 2.4em;
}
.login .field {
  margin-bottom: 16px;
}
</style>
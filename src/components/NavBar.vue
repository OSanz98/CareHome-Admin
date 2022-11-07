<template>
<!-- layout for the navigation bar -->
  <div class="navbar">
    <nav class="nav-extended indigo darken-2">
      <div class="nav-content">
        <!-- title of the webpage. -->
        <span class="nav-title">CareHome</span>
        <li v-if="user">
          <!-- button to log out -->
          <ul class="left">
            <a @click="logout">Logout</a>
          </ul>
          <!-- button to direct user to AddStaff page when they want to create an account. -->
          <a href class="btn-floating btn-large halfway-fab pink">
            <router-link :to="{name: 'AddStaff'}">
              <i class="material-icons">add</i>
            </router-link>
          </a>
        </li>
      </div>
    </nav>
  </div>
</template>

<script>
// libraries imported
import firebase from "firebase";
export default {
  name: "NavBar",
  // variables initialised
  data() {
    return {
      user: null
    };
  },
  methods: {
    // function used to log out the user from Firebase Authentication  and the website.
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
  },
  // called when the page is loaded. It authenticates the user on the website.
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }
};
</script>
<style>
/* styling for the navbar */
.navbar nav {
  padding: 0 20px;
}
</style>
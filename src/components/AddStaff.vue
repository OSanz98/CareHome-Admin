<template>
  <div class="add-staff container">
    <h2 class="center-align indigo-text">Add new staff member</h2>
    <!-- Form containing fields to create a new account on the central database. -->
    <form @submit.prevent="AddStaff">
      <div class="field UserName">
        <label for="UserName">UserName:</label>
        <input type="text" name="UserName" v-model="UserName" required />
      </div>
      <div class="field Password">
        <label for="Password">Password:</label>
        <input type="text" name="Password" v-model="Password" required />
      </div>
      <div class="field Name">
        <label for="Name">Name:</label>
        <input type="text" name="Name" v-model="Name" required />
      </div>
      <div class="field Surname">
        <label for="Surname">Surname:</label>
        <input type="text" name="Surname" v-model="Surname" required />
      </div>
      <div class="field Email">
        <label for="Email">Email:</label>
        <input type="text" name="Email" v-model="Email" required />
      </div>
      <div class="field JobTitle">
        <label for="JobTitle">Job Title:</label>
        <input type="text" name="JobTitle" v-model="JobTitle" required />
      </div>

      <!-- Add staff button - creates the account -->
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{feedback}}</p>
        <button class="btn pink">Add Staff</button>
      </div>
    </form>
    <!-- cancel buton to cancel the operation -->
    <div class="field center-align">
      <router-link :to="{name: 'Index'}">
        <button class="btn pink">Cancel</button>
      </router-link>
    </div>
  </div>
</template>

<script>
// import libraries to gain access to the firebase database.
import db from "@/Firebase/init";
import slugify from "slugify";
import firebase from "firebase";

export default {
  name: "AddStaff",
  // variables initialised.
  data() {
    return {
      UserName: null,
      Password: null,
      Name: null,
      Surname: null,
      Email: null,
      JobTitle: null,
      feedback: null,
      slug: null,
      user_id: null,
      currentHomeCareID: null
    };
  },
  methods: {
    // function used to create an account on the database.
    AddStaff() {
      if(this.JobTitle == "Manager"){
        this.feedback = "Can't set an account job title to Manager";
      } else if (
        this.UserName ||
        this.Password ||
        this.Name ||
        this.Email ||
        this.JobTitle
      ) {
        //create a slug
        this.slug = slugify(this.UserName, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        // add account details to the cloud firestore.
        let ref = db.collection("CareStaff").doc(this.UserName);
        ref.get().then(doc => {
          if (doc.exists) {
            console.log(doc.data());
            this.feedback = "Username already exists!";
          } else {
            var user = firebase.auth().currentUser;
            let current = db
              .collection("CareStaff")
              .where("user_id", "==", user.uid);
            current.get().then(snapshot => {
              snapshot.forEach(doc => {
                let managerData = doc.data();
                this.currentHomeCareID = managerData.HomeCareID;
              });
            });
            // create the account with the email and password provided
            firebase
              .auth()
              .createUserWithEmailAndPassword(this.Email, this.Password)
              .then(cred => {
                console.log("uid", cred.user.uid);
                ref.set({
                  Email: this.Email,
                  JobTitle: this.JobTitle,
                  Name: this.Name,
                  Surname: this.Surname,
                  UserName: this.UserName,
                  slug: this.slug,
                  user_id: cred.user.uid,
                  HomeCareID: this.currentHomeCareID
                });
                console.log(cred.user.uid);
              })
              .then(() => {
                this.$router.push({ name: "Index" });
              })
              .catch(err => {
                console.log(err);
                this.feedback = err.message;
              });
          }
        });
      } else {
        this.feedback = "Can't leave field blank";
      }
    }
  }
};
</script>

<style>
/* styling for the add staff page */
.add-staff {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.add-staff h2 {
  font-size: 2em;
  margin: 20px auto;
}

.add-staff .field {
  margin: 20px auto;
}
</style>
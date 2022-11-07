<template>
  <div v-if="staff" class="edit-staff container">
    <h2>Edit staff member: {{staff.UserName}}</h2>
    <!-- form created to allow user to edit staff accounts. -->
    <form @submit.prevent="EditStaff">
      <div class="field UserName">
        <label for="UserName">UserName:</label>
        <input type="text" name="UserName" v-model="staff.UserName" required />
      </div>
      <div class="field Name">
        <label for="Name">Name:</label>
        <input type="text" name="Name" v-model="staff.Name" required />
      </div>
      <div class="field Surname">
        <label for="Surname">Surname:</label>
        <input type="text" name="Surname" v-model="staff.Surname" required />
      </div>
      <div class="field JobTitle">
        <label for="JobTitle">Job Title:</label>
        <input type="text" name="JobTitle" v-model="staff.JobTitle" required />
      </div>

      <!-- Update staff button used to edit the account -->
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{feedback}}</p>
        <button class="btn pink">Update Staff</button>
      </div>
    </form>
    <!-- Cancel button to cancel the operation. -->
    <div class="field center-align">
      <router-link :to="{name: 'Index'}">
        <button class="btn pink">Cancel</button>
      </router-link>
    </div>
  </div>
</template>

<script>
// libraries imported
import db from "@/Firebase/init";
import slugify from "slugify";
export default {
  name: "EditStaff",
  // variables initialised
  data() {
    return {
      staff: null,
      feedback: null
    };
  },
  methods: {
    // function used to edit the staff account.
    EditStaff() {
      if (
        this.staff.UserName ||
        this.staff.Name ||
        this.staff.Surname ||
        this.staff.Email ||
        this.staff.JobTitle
      ) {
        this.feedback = null;
        //create a slug
        this.staff.slug = slugify(this.staff.UserName, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        // update the account on the firestore.
        db.collection("CareStaff")
          .doc(this.staff.id)
          .update({
            UserName: this.staff.UserName,
            Name: this.staff.Name,
            Surname: this.staff.Surname,
            JobTitle: this.staff.JobTitle,
            slug: this.staff.slug
          })
          .then(() => {
            this.$router.push({ name: "Index" });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.feedback = "Can't leave field blank";
      }
    }
  },
  // the function below is called when the page is opened. It gets the account details for the specified account
  // and displays it on the page.
  created() {
    //first param in where is the field want to check
    //second param is the evaluation param
    //third param is what comparing it to
    let ref = db
      .collection("CareStaff")
      .where("slug", "==", this.$route.params.staff_slug);

    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.staff = doc.data();
        this.staff.id = doc.id;
      });
    });
  }
};
</script>

<style>
/* styling for the edit staff page. */
.edit-staff {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.edit-staff h2 {
  font-size: 2em;
  margin: 20px auto;
}

.edit-staff .field {
  margin: 20px auto;
}
</style>
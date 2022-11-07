<template>
  <div class="index container">
    <!-- card used to display all staff account details  -->
    <div class="card" v-for="staffMember in careStaff" :key="staffMember.id">
      <div class="card-content">
        <!-- delete account button -->
        <i
          class="material-icons delete"
          @click="deleteStaff(staffMember.id, staffMember.Email)"
          >delete</i
        >
        <!-- displays account name and surname -->
        <h2 class="indigo-text">
          {{ staffMember.Name }} {{ staffMember.Surname }}
        </h2>
        <!-- displays account username -->
        <ul>
          UserName:{{
            staffMember.UserName
          }}
        </ul>
        <!-- displays account id -->
        <ul>
          UserID:
          {{
            staffMember.user_id
          }}
        </ul>
        <!-- display account email address -->
        <ul>
          Email:
          {{
            staffMember.Email
          }}
        </ul>
        <!-- display home care id associated with the account -->
        <ul>
          HomeCareID:
          {{
            staffMember.HomeCareID
          }}
        </ul>
        <!-- display account job title  -->
        <ul>
          Job Title:
          {{
            staffMember.JobTitle
          }}
        </ul>
      </div>
      <!-- button for editing staff -->
      <span class="btn-floating btn-large halfway-fab pink">
        <router-link
          :to="{ name: 'EditStaff', params: { staff_slug: staffMember.slug } }"
        >
          <i class="material-icons edit">edit</i>
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
// import libraries to connect to the Firebase database.
import db from "@/Firebase/init";
import firebase from "firebase";
import slugify from "slugify";


export default {
  name: "Index",
  data() {
    return {
      careStaff: [],
      currentUserID: null,
      op: 2
    };
  },
  methods: {
    deleteStaff(id, email) {
      //delete doc from firestore, then delete from authentication
      db.collection("CareStaff")
        .doc(id)
        .delete()
        .then(() => {
          this.careStaff = this.careStaff.filter(staff => {
            return staff.id != id;
          });
        });
      
    }
  },
  //created() is used to load all of the staff accounts in the same care home as the admin, 
  //and displays accounts onto the home page
  created() {
    
    //get the admin's home care id
    firebase.auth().onAuthStateChanged(function(user) {
      console.log(user.uid);
      let m = db.collection("CareStaff").where("user_id", "==", user.uid);
      m.get().then(snapshot => {
        snapshot.forEach(doc => {
          let lsd = doc.data();
          let homecareID = lsd.HomeCareID;
          console.log(homecareID);
          
          this.op = lsd.HomeCareID;
          displayaccounts();
        });
      });
    });
    console.log(this.op);
    //find all staff with the same care home id as the admin, and push accounts details onto the card
    
    db.collection("CareStaff")
      .where("HomeCareID", "==", this.op)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let staff = doc.data();
          if(staff.JobTitle != "Manager")  {
            staff.id = doc.id;
            this.careStaff.push(staff);
          }
        });
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* styling for the cards on the home page */
.card {
  margin-bottom: 50px;
  margin-top: 50px;
}
</style>

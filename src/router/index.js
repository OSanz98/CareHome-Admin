import Vue from "vue";
import Router from "vue-router";
import Index from "@/components/Index";
import AddStaff from "@/components/AddStaff";
import EditStaff from "@/components/EditStaff";
import Login from "@/components/auth/Login";
Vue.use(Router);

// routes user to the respective pages when called
export default new Router({
  routes: [
    {
      path: "/index",
      name: "Index",
      component: Index
    },
    {
      path: "/add-staff",
      name: "AddStaff",
      component: AddStaff
    },
    {
      path: "/edit-staff/:staff_slug",
      name: "EditStaff",
      component: EditStaff
    },
    {
      path: "/",
      name: "Login",
      component: Login
    }
  ]
});

import Vue from 'vue'
import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker);

import Quasar from "quasar"; 
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.min.css";
Vue.use(Quasar);

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", {
    ...required,
    message: "This field is required!",
  });

Vue.component("ValidationObserver",ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider)


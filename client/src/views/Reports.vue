<template>
  <div>
    <div v-if="error">
      <h2 class="error">Request failed, please contact support</h2>
    </div>
    <div v-if="!error">
      <div style="display: flex; justify-content: space-evenly; height: 30%">
        <b-card title="Report Maker" style="max-width: 25rem;" class="mb-2">
          <b-form @submit.prevent="onSubmit" style="width: 20rem;">
            <b-form-group label="Choose a Report preset:">
              <b-form-select id="reportPresets" v-model="selected" :options="reportPresets"></b-form-select>
            </b-form-group>
            <b-form-group
              id="input-group-reportName"
              label="Choose a name for your Report:"
              label-for="input-reportName"
            >
              <b-form-input id="input-reportName" v-model="reportName" required type="text"></b-form-input>
            </b-form-group>
            <b-form-group label="Or choose what to include in the Report:">
              <b-form-checkbox-group
                id="checkbox-group-pupil"
                v-model="selected"
                :options="options"
                name="Pupil Information Types"
                switches
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-card>
          <object :data="pdf" type="application/pdf" width="50%" class="internal">
            <param name="view" value="fitH">
          </object>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "../auth";
import { isset } from '../utils/isset';
import axios from "axios";
import querystring from "querystring";
export default {
  data() {
    return {
      error: false,
      pupil: [],
      reportPresets: [
        { value: ['', ''], text: "Please select an option" },
        // report to be used when teachers are on trip with pupils: forename, surname, gender, and dob for identifying them on the trip, tutorGroup to group pupils on the trip, home phone for emergency contact
        {
          value: ["forename", "surname", "dob", "tutorGroup", "homePhone"],
          text: "Trip Report"
        },
        // end of term grade results report: homeAddress for sending the grade report home, forename, surname, and tutorGroup to identify pupil when handing out grade report, grades as this is a grade card report
        {
          value: ["homeAddress", "forename", "surname", "tutorGroup", "grades"],
          text: "Grades Report"
        },
        // e.g. medical emergency provided to Doctors/Nurses: forename, surname, gender, dob, and homeAddress so Doctors can identify the pupil, home phone for emergency contact
        {
          value: ["forename", "surname", "gender", "dob", "homeAddress", "homePhone"],
          text: "Medical Identification Report"
        },
      ],
      reportName: '',
      selected: [],
      options: [
        { text: "Forename", value: "forename" },
        { text: "Surname", value: "surname" },
        { text: "Date of Birth", value: "dob" },
        { text: "Home Address", value: "homeAddress" },
        { text: "Home Phone", value: "homePhone" },
        { text: "Gender", value: "gender" },
        { text: "Tutor Group", value: "tutorGroup" },
        { text: "School Email", value: "schoolEmail" },
        { text: "Grades", value: "grades" }
      ],
      pdf: ""
    };
  },
  created() {
    console.log(isset(() => document.getElementById("reportPresets").selectedOptions[0].text));
    this.getById(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.getById(to.params.id);
    next();
  },
  methods: {
    async getById(id) {
      let response = await axios.get(`/api/v1/pupils/${id}`, {
        headers: {
          "x-access-token": auth.getToken()
        }
      });
      let data = await response.data;
      if (data["success"]) {
        if (data.data.pupils.length == 0) {
          this.error = true;
          this.$bvToast.toast("Invalid pupil ID", {
            title: "Error",
            toaster: "b-toaster-top-center",
            autoHideDelay: 5000,
            variant: "danger",
            appendToast: true
          });
        } else {
          let pupil = data.data.pupils[0];
        }
      } else {
        this.error = true;
        this.$bvToast.toast("Invalid pupil ID", {
          title: "Error",
          toaster: "b-toaster-top-center",
          autoHideDelay: 5000,
          variant: "danger",
          appendToast: true
        });
      }
    },
    toPupil(id) {
      this.$router.push({ path: `/pupils/${id}` });
    },
    async onSubmit() {
      let options = this.selected;
      for (info in this.pupil) {
      }
      let response = await axios.post(
        `/api/v1/pupils/${this.$route.params.id}/report`,
        querystring.stringify({
          reportType: this.reportName,
          reportOptions: this.selected
        }),
        {
          headers: {
            "x-access-token": auth.getToken()
          }
        }
      );
      let data = await response.data;
      this.pdf = data.data.report;
    }
  }
};
</script>

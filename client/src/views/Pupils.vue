<template>
  <div>
  <div v-if="error">
    <h2 class="error">Invalid pupil ID</h2>
  </div>
  <div v-if="!error">
    <h2>Pupil {{ pupilid }} - {{ pupilforename }} {{ pupilsurname }}, {{ pupiltutorGroup }}</h2>
    <div style="display: flex; justify-content: space-evenly; ">
      <div>
        <b-card title="Personal Details" style="max-width: 25rem;" class="mb-2">
          <b-form @submit.prevent="onSubmit('personal')" @reset.prevent="onReset">
            <b-card-text>
              <b-form-group id="input-group-forename" label="Forename:" label-for="input-forename">
                <b-form-input
                  id="input-forename"
                  v-model="pupilforename"
                  required
                  type="text"
                  :disabled="!editPersonalDetails"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-surname" label="Surname:" label-for="input-surname">
                <b-form-input
                  id="input-surname"
                  v-model="pupilsurname"
                  required
                  type="text"
                  :disabled="!editPersonalDetails"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-dob" label="Date of Birth:" label-for="input-dob">
                <b-form-input
                  id="input-dob"
                  v-model="pupildob"
                  required
                  type="date"
                  :disabled="!editPersonalDetails"
                ></b-form-input>
              </b-form-group>
            </b-card-text>

            <b-form-group id="input-group-gender" label="Gender:" label-for="input-gender">
                <b-form-input
                  id="input-gender"
                  v-model="pupilgender"
                  required
                  type="text"
                  :disabled="!editPersonalDetails"
                ></b-form-input>
              </b-form-group>

            <b-button variant="primary" v-on:click="editPersonalDetails = true" v-if="!editPersonalDetails">Edit</b-button>
            <b-button type="submit" variant="success" v-if="editPersonalDetails">Submit</b-button>
            <b-button type="reset" variant="danger" v-on:click="editPersonalDetails = false" v-if="editPersonalDetails">Cancel</b-button>
          </b-form>
        </b-card>
      </div>
      <div>
        <b-card title="Home Details" style="max-width: 25rem;" class="mb-2">
          <b-form @submit.prevent="onSubmit('home')" @reset.prevent="onReset">
            <b-card-text>
              <b-form-group id="input-group-homeAddress" label="Address:" label-for="input-homeAddress">
                <b-form-input
                  id="input-homeAddress"
                  v-model="pupilhomeAddress"
                  required
                  type="text"
                  :disabled="!editHomeDetails"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-homePhone" label="Phone Number:" label-for="input-homePhone">
                <b-form-input
                  id="input-homePhone"
                  v-model="pupilhomePhone"
                  required
                  type="tel"
                  :disabled="!editHomeDetails"
                ></b-form-input>
              </b-form-group>
            </b-card-text>

            <b-button variant="secondary" v-on:click="editHomeDetails = true" v-if="!editHomeDetails">Edit</b-button>
            <b-button type="submit" variant="success" v-if="editHomeDetails">Submit</b-button>
            <b-button type="reset" variant="danger" v-on:click="editHomeDetails = false" v-if="editHomeDetails">Cancel</b-button>
          </b-form>
        </b-card>
      </div>
      <div>
        <b-card title="School Details" style="max-width: 25rem;" class="mb-2">
          <b-form @submit.prevent="onSubmit('school')" @reset.prevent="onReset">
            <b-card-text>
              <b-form-group id="input-group-tutorGroup" label="tutor Group:" label-for="input-tutorGroup">
                <b-form-input
                  id="input-tutorGroup"
                  v-model="pupiltutorGroup"
                  required
                  type="text"
                  :disabled="!editSchoolDetails"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-schoolEmail" label="Email:" label-for="input-schoolEmail">
                <b-form-input
                  id="input-schoolEmail"
                  v-model="pupilschoolEmail"
                  required
                  type="email"
                  :disabled="!editSchoolDetails"
                ></b-form-input>
              </b-form-group>
            </b-card-text>

            <b-button variant="warning" v-on:click="editSchoolDetails = true" v-if="!editSchoolDetails">Edit</b-button>
            <b-button type="submit" variant="success" v-if="editSchoolDetails">Submit</b-button>
            <b-button type="reset" variant="danger" v-on:click="editSchoolDetails = false" v-if="editSchoolDetails">Cancel</b-button>
          </b-form>
        </b-card>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import auth from '../auth';
import axios from 'axios';
import querystring from 'querystring';
export default {
  data () {
    return {
      error: false,
      pupilid: '',
      pupilforename: '',
      pupilsurname: '',
      pupildob: '',
      pupilgender: '',
      editPersonalDetails: false,
      pupilhomeAddress: '',
      pupilhomePhone: '',
      editHomeDetails: false,
      pupiltutorGroup: '',
      pupilschoolEmail: '',
      editSchoolDetails: false,
      pupilGrades: [],
    }
  },
  created () {
    this.getById(this.$route.params.id);
  },
  beforeRouteUpdate (to, from, next) {
    this.getById(to.params.id);
    next();
  },
  methods: {
    async getById (id) {
      let response = await axios.get(`/api/v1/pupils/${id}`, {
        headers: {
          'x-access-token': auth.getToken()
        }
      });
      let data = await response.data;
      if (data["success"]) {
        if (data.data.pupils.length == 0) {
          this.error = true;
          this.$bvToast.toast('Invalid pupil ID', {
            title: 'Error',
            toaster: 'b-toaster-top-center',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        } else {
          let pupil = data.data.pupils[0];
          // while we could access pupil.id etc. in the template, adding new features means
          // one would need a dummy pupil object open to know what variables exist.
          // so, it is better for future development to set all the variables here.
          this.pupilid = pupil.id;
          this.pupilforename = pupil.forename;
          this.pupilsurname = pupil.surname;
          this.pupildob = pupil.dob;
          this.pupilhomeAddress = pupil.homeAddress;
          this.pupilhomePhone = pupil.homePhone;
          this.pupilgender = pupil.gender;
          this.pupiltutorGroup = pupil.tutorGroup;
          this.pupilschoolEmail = pupil.schoolEmail;
          this.pupilGrades = pupil.grades;
          this.error = false;
        }
      } else {
        this.error = true;
        this.$bvToast.toast(`${data.message}`, {
          title: 'Error',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 5000,
          variant: 'danger',
          appendToast: true
        })
      }
    },
    async onSubmit (category) {
      const personal = ["forename", "surname", "dob", "gender"];
      const home = ["homeAddress", "homePhone"];
      const school = ["tutorGroup", "schoolEmail"];
      let types = [];
      if (category.toLowerCase() == "personal") {
        types = personal;
      } else if (category.toLowerCase() == "home") {
        types = home;
      } else if (category.toLowerCase() == "school") {
        types = school;
      } else {
        types = personal.concat(home, school);
      }
      for (let type of types) {
        let response = await axios.put(`/api/v1/pupils/${this.pupilid}`, querystring.stringify({
          toReplace: type,
          newValue: `${this["pupil".concat(type)]}`
        }),
        {
          headers: {
            'x-access-token': auth.getToken()
          }
        });
        let data = await response.data;
        if (data["success"]) {
          if (category.toLowerCase() == "personal") {
            this.editPersonalDetails = false;
          } else if (category.toLowerCase() == "home") {
            this.editHomeDetails = false;
          } else if (category.toLowerCase() == "school") {
            this.editSchoolDetails = false;
          } else {
            this.editPersonalDetails = false;
            this.editHomeDetails = false;
            this.editSchoolDetails = false;
          }
        } else {
          this.$bvToast.toast('Unable to submit new details. Please contact support', {
            title: 'Something has gone wrong',
            toaster: 'b-toaster-top-center',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        }
      }
    },
    onReset () {
      this.getById(this.$route.params.id);
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>

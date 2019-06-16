<template>
  <div>
  <div v-if="error">
    <h2 class="error">Invalid pupil ID</h2>
  </div>
  <div v-if="!error">
    <h2>Pupil {{ pupilid }} - {{ pupilforename }} {{ pupilsurname }}, {{ pupiltutorGroup }}</h2>
    <div>
      <b-card title="Personal Details" style="max-width: 20rem;" class="mb-2">
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
          <b-card-text>
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

          <b-button variant="primary" v-on:click="editPersonalDetails = true" v-if="!editPersonalDetails">Edit</b-button>
          <b-button type="submit" variant="success" v-if="editPersonalDetails">Submit</b-button>
          <b-button type="reset" variant="danger" v-on:click="editPersonalDetails = false" v-if="editPersonalDetails">Cancel</b-button>
        </b-form>
      </b-card>
    </div>
    <div>
      <b-card title="Home Address" style="max-width: 20rem;" class="mb-2">
        <b-card-text>
          {{ pupilhomeAddress }}
        </b-card-text>

        <b-button variant="primary">Edit</b-button>
      </b-card>
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
      editHome: false,
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
      console.log(data);
      if (data["success"]) {
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
      } else {
        this.error = true;
        this.$bvToast.toast('Invalid pupil ID', {
          title: 'Error',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 5000,
          variant: 'danger',
          appendToast: true
        })
      }
    },
    async onSubmit () {
      const types = [ "forename", "surname", "dob", "gender", "homeAddress", "homePhone", "tutorGroup", "schoolEmail" ];
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
        console.log(data);
        if (data["success"]) {
          this.editPersonalDetails = false;
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

<template>
  <div>
    <div v-if="error">
      <h2 class="error">Request failed, please contact support</h2>
    </div>
    <div v-if="!error">
      <h2>All Pupils</h2>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="pupils"
      ></b-pagination>
      <div id="pupils">
        <div v-for="pupil in pupils.slice((currentPage-1) * perPage, ((currentPage-1) * perPage) + perPage)">
          <b-card :title="`${pupil.forename} ${pupil.surname}`" style="max-width: 80%; margin-left: 10%;" class="mb-2">
            <b-list-group horizontal>
              <b-list-group-item variant="warning">Tutor Group: {{ pupil.tutorGroup }}</b-list-group-item>
              <b-list-group-item variant="warning">School Email: {{ pupil.schoolEmail }}</b-list-group-item>

              <b-list-group-item>Gender: {{ pupil.gender }}</b-list-group-item>
            </b-list-group>

              <b-button variant="primary" v-on:click="toPupil(pupil.id)" style="float: right;">Show More</b-button>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../auth';
import axios from 'axios';
export default {
  data () {
    return {
      error: false,
      pupils: [],
      perPage: 5,
      currentPage: 1
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    async getAll () {
      let response = await axios.get('/api/v1/pupils/', {
        headers: {
          'x-access-token': auth.getToken()
        }
      });
      let data = await response.data;
      if (data["success"]) {
        this.pupils = data.data.pupils;
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
    toPupil(id) {
      this.$router.push({ path: `/pupils/${id}`});
    }
  },
  computed: {
    rows() {
      return this.pupils.length
    }
  }
}
</script>

<template>
  <div id="app" v-if="!isLoading">
  <!--navbar from https://bootstrap-vue.js.org/docs/components/navbar-->
     <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">Tree Road School</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="loggedIn" to="/dash">Dashboard</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
          <b-button variant="success" v-if="!loggedIn" to="/login">Log In</b-button>

            <b-nav-form v-if="loggedIn" @submit.prevent="searchSubmit">
              <!-- easier for teachers to search by name, but the task specifies searching by ID (see readme) -->
              <b-form-input size="sm" v-model="pupilId" class="mr-sm-2" placeholder="Search for a student by ID"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown right v-if="loggedIn">
              <!-- Using 'button-content' slot -->
              <template slot="button-content"><em>User</em></template>
              <b-dropdown-item><b-button variant="danger" to="/logout">Log Out</b-button></b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    <h1>Tree Road School - Teacher Dashboard</h1>
    <template v-if="$route.matched.length">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import auth from './auth';
export default {
  data () {
    return {
      isLoading: true,
      pupilId: '',
      loggedIn: '',
    }
  },
  async created () {
    if (this.isLoading) {
      this.loggedIn = await auth.loggedIn();
      this.isLoading = false;
    }
    auth.onChange = (loggedIn) => {
      this.loggedIn = loggedIn;
    }
  },
  methods: {
    searchSubmit () {
      this.$router.push({ path: `/pupils/${this.pupilId}`});
    }
  }
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <p v-if="$route.query.redirect">
      You need to login first.
    </p>
    <b-form @submit.prevent="login">
      <b-form-group
        id="input-group-1"
        label="Email Address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="email"
          type="email"
          required
          placeholder="Enter Email"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="input-2"
        description="Your password is securely stored and never readable by us."
      >
        <b-form-input
          id="input-2"
          v-model="password"
          type="password"
          required
          placeholder="Enter Password"
        ></b-form-input>
      </b-form-group>
      <br>
      <b-button type="submit" variant="success">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import auth from '../auth'
export default {
  data () {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  methods: {
    login () {
      auth.login(this.email, this.password, loggedIn => {
        if (!loggedIn) {
          this.$bvToast.toast('Invalid Email/Password', {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        } else {
          this.$bvToast.toast('Correct Email/Password', {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
          this.$router.replace(this.$route.query.redirect || '/dash')
        }
      })
    }
  }
}
</script>

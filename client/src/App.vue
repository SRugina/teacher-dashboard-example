<template>
  <div id="app">
    <h1>Tree Road School - Teacher Dashboard</h1>
    <ul>
      <li>
        <router-link v-if="loggedIn" to="/logout">Log out</router-link>
        <router-link v-if="!loggedIn" to="/login">Log in</router-link>
      </li>
      <li>
      {{ loggedIn }}
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/dash">Dashboard</router-link>
        (authenticated)
      </li>
    </ul>
    <template v-if="$route.matched.length">
      <router-view></router-view>
    </template>
    <template v-else>
      <p>You are logged {{ loggedIn ? 'in' : 'out' }}</p>
    </template>
  </div>
</template>

<script>
import auth from './auth'
export default {
  data () {
    return {
      loggedIn: auth.loggedIn().then((res) => res),
    }
  },
  created () {
    auth.loggedIn().then((res) => console.log(res));
    auth.onChange = (loggedIn) => {
      this.loggedIn = loggedIn;
    }
  }
}
</script>

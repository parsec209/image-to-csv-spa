<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <div class="container">
      <b-navbar-brand to="/">
        <b-img src="../../public/favicon.png" fluid width="50" height="50" alt="" class="mr-2"></b-img>
        <strong >Image-To-CSV</strong>

      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/instructions">
            Overview
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-if="user" class="ml-auto">
          <b-nav-item-dropdown :text="user.username" right>
            <b-dropdown-item to="/profile">
              Account settings
            </b-dropdown-item>
            <b-dropdown-item to="/index/header">
              My headers
            </b-dropdown-item>
            <b-dropdown-item to="/index/doc">
              My recurring documents
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <em>Logout</em>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav v-else class="ml-auto">
          <b-nav-item to="/register">
            Register
          </b-nav-item>
          <b-nav-item to="/login">
            Login
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>


<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNavbar',
  computed: mapGetters(['user']),
  methods: { 
    ...mapActions(['setUser']), 

    async logout() {
      this.setUser(null)
      try {
        await axios.get('/api/user/logout', { withCredentials: true })
        this.$router.push({ 
          name: 'UserLogin', 
          params: { 
            msg: { 
              text: 'Signed out', 
              context: 'success' 
            }
          }
        })
      } catch (err) {
        const errInfo = this.$handleError(err)
        this.$router.push({ 
          name: 'UserLogin', 
          params: { 
            msg: { 
              text: errInfo, 
              context: 'danger' 
            }
          }
        })
      }
    }
  }
}
</script>


<style>
.navbar-dark .navbar-nav .nav-link {
  color: rgb(255,255,255)!important;
}
</style>
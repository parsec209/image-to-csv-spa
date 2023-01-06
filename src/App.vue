<template>
  <div class="d-flex flex-column h-100">
    <header>
      <TheNavbar />
    </header>
    <br>
    <main class="flex-shrink-0">
      <div class="container text-center" v-if="!$store.getters.sessionChecked">
        <br>
        <h4>Loading session</h4> 
        <br>
        <br>
        <b-spinner id="session-spinner" variant="info"></b-spinner>
      </div>  
      <router-view />
    </main>
    <footer class="footer mt-auto py-3">
      <hr>
      <TheFooter />
    </footer>
  </div>
</template>


<script>
import TheFooter from './components/TheFooter.vue'
import TheNavbar from './components/TheNavbar'

export default {
  name: 'App',
  components: {
    TheFooter,
    TheNavbar
  },
}
</script>


<style scoped>
#session-spinner {
  width: 6rem; 
  height: 6rem;
}
</style>

<style>
html, body {
  height: 100%!important; 
}
body {
  background: linear-gradient(#cfecda,#fff);
  background-repeat: no-repeat;
  font-family: Arial, sans-serif;
}
</style>
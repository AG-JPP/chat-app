<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Web chat</a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarText" 
          aria-controls="navbarText" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul v-if="this.$store.getters.getConnectedUser == false" class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to='/login'>
                <a class="nav-link active" aria-current="page" href="#">Login</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to='/singin'>
                <a class="nav-link" href="#">Sign In</a>
              </router-link>
            </li>
          </ul>
          <span @click="disconnect" v-else class="navbar-text">
            Disconnect
          </span>
        </div>
      </div>
    </nav>

    <div class="container">
        <router-view></router-view>
    </div>
  </div>
</template>


<script>

export default {
  name: 'App',
  components: {
    
  },
  methods: {
    disconnect () {
      this.$store.commit('removeUser')
      this.$router.push('/')
    }
  },
  created() {
    this.$store.commit('checkConnectedUser')
  }
}
</script>

<style>
	#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	}
	@import'~bootstrap/dist/css/bootstrap.css';
</style>
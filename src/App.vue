<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1>Welcome to this web chat app</h1>
        </div>
        <div class="col-md-6 offset-md-3">
          
            <router-link to="/login" class="me-3">
              <button type="button" class="btn btn-primary">
                Se connecter
              </button>
            </router-link>
          
            <router-link to="/singin">
              <button type="button" class="btn btn-primary">
                S'inscrire
              </button>
            </router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'App',
  components: {
    
  }, 
  mounted() {
    
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
	margin-top: 60px;
	}
	@import'~bootstrap/dist/css/bootstrap.css';
</style>
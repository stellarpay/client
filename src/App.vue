<template>
  <div>
    <navbar-component></navbar-component>
    <div id="app">
      <main>
        <div class="container">
      <router-view></router-view>
    </div>
    </main>
    <footer-component></footer-component>
    </div>
  </div>
</template>

<script>
import NavbarComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'
export default {
    name: 'app',
    mounted(){
      if(this.$root.account.logged == false){
        this.$router.push('login')
      }
    },
    components: {NavbarComponent, FooterComponent}
}
</script>

<style>
 @import './assets/css/bootstrap.css';
 @import 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css';
 @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
 @import './assets/css/main.css';
 @import './assets/css/animate.css';
 @import './assets/css/anim.css';
 @import './assets/css/sp.css';
</style>

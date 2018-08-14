<template>
  <div v-show="this.$root.account.logged">
      <header>
          <!-- Menu -->
          <section id="menu" class=" navbar-fixed-top">
              <nav class="navbar">
                  <div class="container">
                      <div class="navbar-header">
                          <button type="button" class="navbar-toggle collapsed" data-target="#navbarDropdown">
                              <span class="sr-only">Navbar</span>
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                          </button>
                          <router-link to="/dashboard" class="navbar-brand">Panel</router-link>
                      </div>
                      <div class="collapse navbar-collapse">
                          <ul class="nav navbar-nav navbar-right" style="font-weight:400">
                              <li>
                                  <router-link to="/transfer" class="nav-link">Transfer</router-link>
                              </li>
                              <li>
                                  <router-link to="/merchants" class="nav-link">Merchants</router-link>
                              </li>
                              <li>
                                  <router-link to="/reports" class="nav-link">Reports</router-link>
                              </li>
                              <li>
                                  <li>
                                      <router-link to="/settings" class="top-user"><i class="fa fa-user-circle" style="font-size:35px"></i></router-link>
                                  </li>
                          </ul>
                      </div>
                  </div>
              </nav>
          </section>
          <!-- menu end -->
          <!-- title -->
          <section id="title">
              <div class="container">
                  <div class="row">
                      <div class="user ">
                          <a href="#">
                              <div class="photo" style="background-image:url(https://mir-s3-cdn-cf.behance.net/project_modules/disp/e70b1333850498.56ba69ac32ae3.png)"><i class="ion-loop"></i></div>
                          </a>
                          <div class="content">
                              <p>Welcome, {{ this.$root.account.id }}!</p>
                              <div style="color: rgb(107, 117, 142);
    font-size: 10px;
    line-height: 20px;
    font-weight: 600;
    text-transform: uppercase;" class="visible-xs">Available Balance</div>
                              <span class="hidden-xs">Balance :</span>
                              <b style="font-size:18px" v-show="this.$root.account.native == 0">0.00 XLM</b>
                              <b style="font-size:18px" v-show="this.$root.account.native > 0">{{ this.$root.account.native }} XLM</b>
                          </div>
                      </div>

                      <div class="hidden-xs">
                          <button data-toggle="modal" data-target="#deposit" class="button-d">RECEIVE</button>
                          <router-link to="/transfer" class="button-w">
                              <p style="line-height:33px">Transfer</p>
                          </router-link>
                      </div>
                  </div>
              </div>
          </section>
          <!-- title end-->
          <div class="modal fade" id="deposit" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                  <section class="modal-content">
                      <div class="section-title">
                          <div class="section-title__content">
                              <span class="section-top-title">Receive</span>
                              <span class="subtitle">The receiving address is same for all assets type.&nbsp;<span class="danger">There is no another receiving address.</span>
                              </span>
                          </div>
                      </div>
                      <center>
                          <div class="qr content">
                              <img width="100%" :src="'https://chart.googleapis.com/chart?chs=400x400&chld=M|0&cht=qr&chl='+''+this.$root.account.public"></div>
                      </center>
                      <br>
                      <span>Public Address</span>
                      <br>
                      <div class="modal-input hideit">
                          <input disabled="disabled" id="section-input" type="text" :value="this.$root.account.public">
                      </div>
                      <hr>
                      <small>*Dont forget to double check your public address!</small>
                  </section>
              </div>
          </div>
      </header>
  </div>
</template>


<script>
import StellarSdk from 'stellar-sdk'
export default {
  name: 'Header',
  mounted() {
    // Menu
function menu(){
  var sc = $(window).scrollTop()
  if (sc > 50) {
      $("#menu").addClass("active")
  } else {
      $("#menu").removeClass("active")
  }
}
$(window).scroll(function(){menu();});
$('#menu .collapsed').click(function(){
	$('#navbarDropdown').slideToggle();
});
  },
  methods : {
  }
}
</script>

<style>
</style>

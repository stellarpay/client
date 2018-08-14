<template>
  <div>
    <div class="logmod">
      <center><br><br><img src="https://api.stellarpay.io/assets/logo.png" width="210px" style="margin-top:60px"><br><p style="font-size:35px;color:white">Payment gateway and management for Stellar network</p></center>
      <div class="logmod__wrapper">
        <div v-if="login.message" class="alert alert-success alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        {{ login.message }}
        </div>
        <div v-if="login.error" class="alert alert-danger alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        {{ login.error }}
        </div>
        <div class="logmod__container">
          <ul class="logmod__tabs">
            <li data-tabtar="lgm-2"><a href="#">Login</a></li>
            <li data-tabtar="lgm-1"><a href="#">Sign Up</a></li>
          </ul>
          <div class="logmod__tab-wrapper">
          <div class="logmod__tab lgm-1">
            <div class="logmod__heading">
              <span class="logmod__heading-subtitle">*Your password and wallet key are never stored in <strong>database.</strong></span>
            </div>
            <div class="logmod__form">
              <form accept-charset="utf-8" action="#" class="simform">
                <div class="sminputs">
                  <div class="input full">
                    <label class="string optional" for="user-name">Account ID</label>
                    <input class="string optional" maxlength="255" v-model="login.signup.id" type="text" size="50" disabled/>
                    <span class="gen-uuid" @click="fetchUuid()">Generate New</span>
                  </div>
                </div>
                <div class="sminputs">
                  <div class="input full">
                    <label class="string optional" for="user-email">Email * (for Notifications and backup)</label>
                    <input class="string optional" maxlength="255" v-model="login.signup.email" type="email" placeholder="Email" size="50" />
                  </div>
                </div>
                <div class="sminputs">
                  <div class="input string optional">
                    <label class="string optional" for="user-pw">Password *</label>
                    <input class="string optional" maxlength="255" v-model="login.signup.password" placeholder="Password" type="password" size="50" />
                  </div>
                  <div class="input string optional">
                    <label class="string optional" for="user-pw-repeat">Repeat password *</label>
                    <input class="string optional" maxlength="255" id="user-pw-repeat" placeholder="Repeat password" type="password" size="50" />
                  </div>
                </div>
                <div class="simform__actions">
                  <button class="submit" type="button" @click="sendSignup()" v-show="login.submitted == false"><b>Signup</b></button>
                  <button class="submit" type="button" :disabled="login.submitted" v-show="login.submitted"><b>Registering..</b></button>
                  <span class="simform__actions-sidetext">By creating an account you agree to our <a class="special" href="#" target="_blank" role="link">Terms & Privacy</a></span>
                </div>
              </form>
            </div>
            <div class="logmod__alter">
              <div class="logmod__alter-container">

                <a href="#" class="connect howto">
                  <div class="connect__icon">
                    <i class="fa fa-question"></i>
                  </div>
                  <div class="connect__context">
                    <span>How does the authentication mechanism work?</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="logmod__tab lgm-2">
            <div class="logmod__heading">
              <span class="logmod__heading-subtitle">Enter your ID and password <strong>to sign in</strong></span>
            </div>
            <div class="logmod__form">
              <form accept-charset="utf-8" action="#" class="simform">
                <div class="sminputs">
                  <div class="input full">
                    <label class="string optional" for="user-name">Account ID</label>
                    <input class="string optional" maxlength="255" v-model="login.account.id" placeholder="UUID" type="text" size="50" />
                  </div>
                </div>
                <div class="sminputs">
                  <div class="input full">
                    <label class="string optional" for="user-pw">Password</label>
                    <input class="string optional" maxlength="255" v-model="login.account.password" placeholder="Password" type="password" size="50" />
                    						<span class="hide-password">Show</span>
                  </div>
                </div>
                <div class="simform__actions">
                    <button class="submit" type="button" @click="fetchAccount()" v-show="login.submitted == false"><b>Login</b></button>
                    <button class="submit" type="button" :disabled="login.submitted" v-show="login.submitted"><b>Logging..</b></button>
                    <span class="simform__actions-sidetext"><a class="special" role="link" href="#" style="text-decoration:none;line-height:45px">Restore Wallet</a></span>
                </div>
              </form>
            </div>
            <div class="logmod__alter">
              <div class="logmod__alter-container">
                <a href="#" class="connect try">
                  <div class="connect__icon">
                    <i class="fa fa-code"></i>
                  </div>
                  <div class="connect__context">
                    <span>Have you visited StellarPay <strong>API documentation?</strong></span>
                  </div>
                </a>
              </div>
            </div>
              </div>
          </div>
        </div>
      </div>
      <center><a href="https://stellarpay.io" style="text-decoration:none"><i class="fa fa-arrow-left" style="color:white;font-size:30px"></i><p style="font-size:35px;color:white">Back to Home</p></a></center>
    </div>
</div>
</template>

<script>
import StellarSdk from 'stellar-sdk'
import CryptoJS from 'crypto-js'
import axios from 'axios';
import bip39 from 'bip39'
import { ENTROPY, LANGUAGE, genMnemonic, hexSeed } from "../lib/keygen"
import setState from 'vue-set-state'
import {generateKeyPair} from '../lib/sep5'

    export default {
        name: 'Login',
        computed: {
          login()
          {
              return this.$root;
          },
        },
        data() {
            return {
                input: {
                    username: "",
                    password: ""
                }
            }
        },
        mounted(){
          this.generateMnemonic();
          this.fetchUuid();
          this.restoreMnemonic('liberty hybrid settle mandate south analyst pride vehicle armor robot just swing');

          var LoginModalController = {
          tabsElementName: ".logmod__tabs li",
          tabElementName: ".logmod__tab",
          inputElementsName: ".logmod__form .input",
          hidePasswordName: ".hide-password",

          inputElements: null,
          tabsElement: null,
          tabElement: null,
          hidePassword: null,

          activeTab: null,
          tabSelection: 0,

    findElements: function () {
        var base = this;

        base.tabsElement = $(base.tabsElementName);
        base.tabElement = $(base.tabElementName);
        base.inputElements = $(base.inputElementsName);
        base.hidePassword = $(base.hidePasswordName);

        return base;
    },

    setStateLogin: function (state) {
    	var base = this,
            elem = null;

        if (!state) {
            state = 0;
        }

        if (base.tabsElement) {
        	elem = $(base.tabsElement[state]);
            elem.addClass("current");
            $("." + elem.attr("data-tabtar")).addClass("show");
        }

        return base;
    },

    getActiveTab: function () {
        var base = this;

        base.tabsElement.each(function (i, el) {
           if ($(el).hasClass("current")) {
               base.activeTab = $(el);
           }
        });

        return base;
    },

    addClickEvents: function () {
    	var base = this;

        base.hidePassword.on("click", function (e) {
            var $this = $(this),
                $pwInput = $this.prev("input");

            if ($pwInput.attr("type") == "password") {
                $pwInput.attr("type", "text");
                $this.text("Hide");
            } else {
                $pwInput.attr("type", "password");
                $this.text("Show");
            }
        });

        base.tabsElement.on("click", function (e) {
            var targetTab = $(this).attr("data-tabtar");

            e.preventDefault();
            base.activeTab.removeClass("current");
            base.activeTab = $(this);
            base.activeTab.addClass("current");

            base.tabElement.each(function (i, el) {
                el = $(el);
                el.removeClass("show");
                if (el.hasClass(targetTab)) {
                    el.addClass("show");
                }
            });
        });

        base.inputElements.find("label").on("click", function (e) {
           var $this = $(this),
               $input = $this.next("input");

            $input.focus();
        });

        return base;
    },

          initialize: function () {
              var base = this;

              base.findElements().setStateLogin().getActiveTab().addClickEvents();
          }
      };

      $(document).ready(function() {
          LoginModalController.initialize();
      });

        },
        methods: {
          fetchUuid(){
            axios.get('https://api.stellarpay.io/api/generate_uuid').then(response => {
                this.$root.signup.id = response.data.uuid
                })
          },
          fetchAccount(){
            this.$root.error = ''
            axios.get('https://api.stellarpay.io/api/'+'account/'+this.$root.account.id).then(response => {
                if(response.data.error){
                  this.$root.error = response.data.error
                } else {
                  this.$root.account.data = response.data
                  this.$root.account.payload = response.data.payload
                  try {
                    this.$root.account.private = this.decryptUserData(this.$root.account.payload,this.$root.account.id+':'+this.$root.account.password)
                    var decryptedPayload = JSON.parse(this.$root.account.private)
                    this.$root.account.private = decryptedPayload.secret
                    this.$root.account.mnemonic = decryptedPayload.mnemonic
                    this.loginAccount(decryptedPayload.secret)
                  }
                  catch(err) {
                    if(err){
                      this.$root.error = 'Wrong password!'
                    }
                  }
                }
                })
          },
          loginAccount(secret){
            this.$root.account.from = StellarSdk.Keypair.fromSecret(secret)
            this.$root.account.public = this.$root.account.from.publicKey()
            this.$root.account.signature = this.$root.account.from.sign('LoginForStellarPay').toString("hex")
            var params = new URLSearchParams();
            params.append('id', this.$root.account.id);
            params.append('signature', this.$root.account.signature);
            var stateForAxios = this.$root
            var prefix = this
            var router = this.$router
            this.$root.submitted = true
            axios.post('https://api.stellarpay.io/api/signin', params).then(function (response){
              if(response.data.error){
                stateForAxios.error = response.data.error
              } else{
                stateForAxios.account.logged = true
                stateForAxios.message = ''
                stateForAxios.error = ''
                stateForAxios.submitted = false
                stateForAxios.active_currency.code = 'native'
                router.push('dashboard')
              }
            })
          },
          chain()
          {
              return this.$root;
          },
          sendSignup(){
            var data = JSON.stringify({secret:this.$root.syncWithServer.private,mnemonic:this.$root.syncWithServer.mnemonic})
            this.$root.syncWithServer.data = this.encryptUserData(data,this.$root.signup.id+':'+this.$root.signup.password)
            this.$root.syncWithServer.signature = this.$root.syncWithServer.random.sign('LoginForStellarPay').toString("hex")
            this.$root.syncWithServer.content = JSON.stringify({pbkdf2_iterations:"10000",payload:this.$root.syncWithServer.data})
            var params = new URLSearchParams();
            params.append('id', this.$root.signup.id);
            params.append('email', this.$root.signup.email);
            params.append('payload', this.$root.syncWithServer.content);
            params.append('signature', this.$root.syncWithServer.signature);
            var stateForAxios = this.$root
            var router = this.$router
            this.$root.submitted = true
            axios.post('https://api.stellarpay.io/api/signup', params).then(function (response){
              if(response.data.error){
                stateForAxios.error = response.data.error
              } else{
                stateForAxios.message = 'Successfuly Created!'
                stateForAxios.account.id = stateForAxios.signup.id
                stateForAxios.account.password = stateForAxios.signup.password
                stateForAxios.account.payload = stateForAxios.syncWithServer.data
                stateForAxios.account.public = stateForAxios.syncWithServer.public
                stateForAxios.account.private = stateForAxios.syncWithServer.private
                stateForAxios.account.mnemonic = stateForAxios.syncWithServer.mnemonic
                stateForAxios.account.signature = stateForAxios.syncWithServer.signature
                stateForAxios.account.logged = true
                stateForAxios.submitted = false
                stateForAxios.message = ''
                stateForAxios.error = ''
                router.push('backup')
              }
            })
          },
          encryptUserData(msg, pass) {
            var salt = CryptoJS.lib.WordArray.random(128/8);

            var key = CryptoJS.PBKDF2(pass, salt, {
                keySize: 16,
                iterations: 10000
              });

            var iv = CryptoJS.lib.WordArray.random(128/8);

            var encrypted = CryptoJS.AES.encrypt(msg, key, {
              iv: iv,
              padding: CryptoJS.pad.Pkcs7,
              mode: CryptoJS.mode.CBC

            });
            var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
            return transitmessage;
          },
          decryptUserData(transitmessage, pass) {
            var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
            var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
            var encrypted = transitmessage.substring(64);

            var key = CryptoJS.PBKDF2(pass, salt, {
                keySize: 16,
                iterations: 10000
              });

            var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
              iv: iv,
              padding: CryptoJS.pad.Pkcs7,
              mode: CryptoJS.mode.CBC

            })
            return decrypted.toString(CryptoJS.enc.Utf8);
          },
          generateMnemonic() {
            var mnemonic = genMnemonic(ENTROPY.medium, this.$root.language)
            var bip39Seed = hexSeed(mnemonic, this.$root.passphrase)

            this.setState({ mnemonic, bip39Seed })

            const keyPair = generateKeyPair(
              bip39Seed, 0
            )
            this.$root.syncWithServer.random = keyPair
            this.$root.syncWithServer.public = keyPair.publicKey()
            this.$root.syncWithServer.private = keyPair.secret()
            this.$root.syncWithServer.mnemonic = mnemonic
          },
          restoreMnemonic(mnemonic) {
            var bip39Seed = bip39.mnemonicToSeedHex(mnemonic)
            this.setState({
              mnemonic,
              bip39Seed
            })
              const keyPair = generateKeyPair(bip39Seed, this.$root.derivationPathIndex)
          },
        fetchTrustlines() {
        StellarSdk.Network.useTestNetwork();
        var prefix = this.$root
        var server = new StellarSdk.Server(prefix.horizon_server, {allowHttp: true});
        console.log(prefix.horizon_server)
        var current = this
        server.loadAccount(prefix.account.public)
        .then(function(account) {
          $.grep(account.balances, function (altered) {
            if(altered.asset_type == 'native'){
              altered.asset_code = 'native'
              altered.code = 'XLM'
              prefix.balances[altered.asset_type] = altered.balance
              prefix.account.native = altered.balance
              prefix.assets = account.balances
              current.fetchHistory('native')
            } else {
              prefix.active_currency.issuer = altered.asset_issuer
              altered.code = altered.asset_code
              altered.issuer = altered.asset_issuer
              prefix.transfer.assets[altered.asset_code] = altered
              prefix.balances[altered.asset_code] = altered.balance
              prefix.assets = account.balances
              current.fetchHistory(altered.asset_code)
            }
          });
        });
      },
      fetchHistory(asset) {
        var prefix = this.$root
        var server = new StellarSdk.Server(prefix.horizon_server, {allowHttp: true});
        server.payments()
          .forAccount(prefix.account.public)
          .order('desc')
          .limit(200)
          .call()
          .then(function (operationResult) {
            prefix.last_actions[asset] = operationResult.records
            var filtered = operationResult.records.filter(function (el) {
              if(asset == 'native'){
                  el.asset_code = 'XLM'
                 return el.asset_type == asset;
              } else {
                return el.asset_code == asset;
              }
            });
            prefix.last_actions[asset] = filtered
            var layer = prefix.last_actions[asset]
            $.grep(layer, function(layerElement){
                if(layerElement.type == 'create_account'){
                  layerElement.tx_type = 'Create'
                  layerElement.amount = layerElement.starting_balance
                } else {
                  layerElement.tx_type = 'Payment'
                }
            })
            prefix.$forceUpdate();
          });
      },
        }
    }
</script>

<style>
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

.logmod {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: overlay;
  opacity: 1;
  background: linear-gradient(-204deg,#16306e 0,#121700 105%);
  z-index: 1;
}
.logmod::after {
  clear: both;
  content: "";
  display: table;
}
.logmod__wrapper {
  display: block;
  background: #FFF;
  position: relative;
  max-width: 550px;
  border-radius: 4px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
  margin: 120px auto;
}
.logmod__close {
  display: block;
  position: absolute;
  right: 50%;
  background: url("https://raw.githubusercontent.com/maidsafe/safe_launcher/master/app/images/close_white.svg") no-repeat scroll 0% 0% transparent;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  top: -72px;
  margin-right: -24px;
  width: 48px;
  height: 48px;
}
.logmod__container {
  overflow: hidden;
  width: 100%;
}
.logmod__container::after {
  clear: both;
  content: "";
  display: table;
}
.logmod__tab {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
}
.logmod__tab-wrapper {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.logmod__tab.show {
  opacity: 1;
  height: 100%;
  visibility: visible;
}
.logmod__tabs {
  list-style: none;
  padding: 0;
  margin: 0;
}
.logmod__tabs::after {
  clear: both;
  content: "";
  display: table;
}
.logmod__tabs li.current a {
  background: #FFF;
  color: #333;
}
.logmod__tabs li a {
  width: 50%;
  position: relative;
  float: left;
  text-align: center;
  background: #D2D8D8;
  line-height: 72px;
  height: 72px;
  text-decoration: none;
  color: #809191;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}
.logmod__tabs li a:focus {
  outline: dotted 1px;
}
.logmod__heading {
  text-align: center;
  padding: 12px 0 12px 0;
}
.logmod__heading-subtitle {
  display: block;
  font-weight: 400;
  font-size: 15px;
  color: #888;
  line-height: 48px;
}
.logmod__form {
  border-top: 1px solid #e5e5e5;
}
.logmod__alter {
  display: block;
  position: relative;
  margin-top: 7px;
}
.logmod__alter::after {
  clear: both;
  content: "";
  display: table;
}
.logmod__alter .connect:last-child {
  border-radius: 0 0 4px 4px;
}

.connect {
  overflow: hidden;
  position: relative;
  display: block;
  width: 100%;
  height: 72px;
  line-height: 72px;
  text-decoration: none;
}
.connect::after {
  clear: both;
  content: "";
  display: table;
}
.connect:focus, .connect:hover, .connect:visited {
  color: #FFF;
  text-decoration: none;
}
.connect__icon {
  vertical-align: middle;
  float: left;
  width: 70px;
  text-align: center;
  font-size: 22px;
}
.connect__context {
  vertical-align: middle;
  text-align: center;
}
.connect.try {
  background: #647189;
  color: #FFF;
}
.connect.try a {
  color: #FFF;
}
.connect.try .connect__icon {
  background: #59657a;
}
.connect.howto {
  background: #647189;
  color: #FFF;
}
.connect.howto a {
  color: #FFF;
}
.connect.howto .connect__icon {
  background: #59657a;
}

.simform {
  position: relative;
}
.simform__actions {
  padding: 15px;
  font-size: 14px;
}
.simform__actions::after {
  clear: both;
  content: "";
  display: table;
}
.simform__actions .submit {
  height: 48px;
  float: right;
  color: #FFF;
  width: 50%;
  font-weight: 700;
  font-size: 16px;
  background: #4285f4;
  margin-top: 7px;
}
.simform__actions .submit::after {
  clear: both;
  content: "";
  display: table;
}
.simform__actions-sidetext {
  display: inline-block;
  float: left;
  width: 50%;
  padding: 0 10px;
  margin: 9px 0 0 0;
  color: #8C979E;
  text-align: center;
  line-height: 24px;
}
.simform__actions-sidetext::after {
  clear: both;
  content: "";
  display: table;
}

.sminputs {
  border-bottom: 1px solid #E5E5E5;
}
.sminputs::after {
  clear: both;
  content: "";
  display: table;
}
.sminputs .input {
  display: block;
  position: relative;
  width: 50%;
  height: 71px;
  padding: 11px 24px;
  border-right: 1px solid #e5e5e5;
  border-bottom: none;
  float: left;
  background-color: #FFF;
  border-radius: 0;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.sminputs .input.active {
  background: #eee;
}
.sminputs .input.active .hide-password {
  background: #eee;
}
.sminputs .input.active .gen-uuid {
  background: #eee;
}
.sminputs .input.full {
  width: 100%;
}
.sminputs .input label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  line-height: 24px;
}
.sminputs .input input {
  postion: relative;
  display: inline-block;
  height: 24px;
  font-size: 15px;
  line-height: 19.2px;
  color: #555;
  border-radius: 4px;
  vertical-align: middle;
  box-shadow: none;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  color: rgba(75, 89, 102, 0.85);
}
.sminputs .hide-password {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 15px;
  border-left: 1px solid #e4e4e4;
  font-size: 14px;
  background: #FFF;
  overflow: hidden;
  color: #444;
  cursor: pointer;
  margin-top: 12px;
  line-height: 48px;
}
.sminputs .gen-uuid {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 15px;
  border-left: 1px solid #e4e4e4;
  font-size: 14px;
  background: #FFF;
  overflow: hidden;
  color: #444;
  cursor: pointer;
  margin-top: 12px;
  line-height: 48px;
}
html {
  font-size: 16px;
  line-height: 24px;
  font-family: "Lato", sans-serif;
}

.btn, .simform__actions .submit {
  display: inline-block;
  line-height: normal;
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  border: none;
  outline: none;
  outline-offset: 0;
  font-weight: 400;
  box-shadow: none;
  min-width: 90px;
  padding: 10px 14px;
}
.btn.full, .simform__actions .full.submit {
  width: 100%;
}
.btn.lg, .simform__actions .lg.submit {
  min-width: 125px;
  padding: 17px 14px;
  font-size: 22px;
  line-height: 1.3;
}
.btn.sm, .simform__actions .sm.submit {
  min-width: 65px;
  padding: 4px 12px;
  font-size: 14px;
}
.btn.xs, .simform__actions .xs.submit {
  min-width: 45px;
  padding: 2px 10px;
  font-size: 10px;
  line-height: 1.5;
}
.btn.circle, .simform__actions .circle.submit {
  overflow: hidden;
  width: 56px;
  height: 56px;
  min-width: 56px;
  line-height: 1;
  padding: 0;
  border-radius: 50%;
}
.btn.circle.lg, .simform__actions .circle.lg.submit {
  width: 78px;
  height: 78px;
  min-width: 78px;
}
.btn.circle.sm, .simform__actions .circle.sm.submit {
  width: 40px;
  height: 40px;
  min-width: 40px;
}
.btn.circle.xs, .simform__actions .circle.xs.submit {
  width: 30px;
  height: 30px;
  min-width: 30px;
}
.btn:focus, .simform__actions .submit:focus, .btn:active, .simform__actions .submit:active, .btn.active, .simform__actions .active.submit, .btn:active:focus, .simform__actions .submit:active:focus, .btn.active:focus, .simform__actions .active.submit:focus {
  outline: 0;
  outline-offset: 0;
  box-shadow: none;
}
.btn.red, .simform__actions .red.submit {
  background: #f44336;
  color: #FFF;
}
.btn.red:active, .simform__actions .red.submit:active, .btn.red:focus, .simform__actions .red.submit:focus {
  background-color: #ef1d0d;
}
.btn.red:hover, .simform__actions .red.submit:hover {
  background-color: #f32c1e;
}
.btn.pink, .simform__actions .pink.submit {
  background: #E91E63;
  color: #FFF;
}
.btn.pink:active, .simform__actions .pink.submit:active, .btn.pink:focus, .simform__actions .pink.submit:focus {
  background-color: #c61350;
}
.btn.pink:hover, .simform__actions .pink.submit:hover {
  background-color: #d81558;
}
.btn.purple, .simform__actions .purple.submit {
  background: #9C27B0;
  color: #FFF;
}
.btn.purple:active, .simform__actions .purple.submit:active, .btn.purple:focus, .simform__actions .purple.submit:focus {
  background-color: #7b1f8a;
}
.btn.purple:hover, .simform__actions .purple.submit:hover {
  background-color: #89229b;
}
.btn.deep-purple, .simform__actions .deep-purple.submit {
  background: #673AB7;
  color: #FFF;
}
.btn.deep-purple:active, .simform__actions .deep-purple.submit:active, .btn.deep-purple:focus, .simform__actions .deep-purple.submit:focus {
  background-color: #532f94;
}
.btn.deep-purple:hover, .simform__actions .deep-purple.submit:hover {
  background-color: #5c34a4;
}
.btn.indigo, .simform__actions .indigo.submit {
  background: #3F51B5;
  color: #FFF;
}
.btn.indigo:active, .simform__actions .indigo.submit:active, .btn.indigo:focus, .simform__actions .indigo.submit:focus {
  background-color: #334293;
}
.btn.indigo:hover, .simform__actions .indigo.submit:hover {
  background-color: #3849a2;
}
.btn.blue, .simform__actions .blue.submit {
  background: #2196F3;
  color: #FFF;
}
.btn.blue:active, .simform__actions .blue.submit:active, .btn.blue:focus, .simform__actions .blue.submit:focus {
  background-color: #0c7fda;
}
.btn.blue:hover, .simform__actions .blue.submit:hover {
  background-color: #0d8aee;
}
.btn.light-blue, .simform__actions .light-blue.submit {
  background: #03A9F4;
  color: #FFF;
}
.btn.light-blue:active, .simform__actions .light-blue.submit:active, .btn.light-blue:focus, .simform__actions .light-blue.submit:focus {
  background-color: #028ac7;
}
.btn.light-blue:hover, .simform__actions .light-blue.submit:hover {
  background-color: #0398db;
}
.btn.cyan, .simform__actions .cyan.submit {
  background: #00BCD4;
  color: #FFF;
}
.btn.cyan:active, .simform__actions .cyan.submit:active, .btn.cyan:focus, .simform__actions .cyan.submit:focus {
  background-color: #0093a6;
}
.btn.cyan:hover, .simform__actions .cyan.submit:hover {
  background-color: #00a5bb;
}
.btn.teal, .simform__actions .teal.submit {
  background: #009688;
  color: #FFF;
}
.btn.teal:active, .simform__actions .teal.submit:active, .btn.teal:focus, .simform__actions .teal.submit:focus {
  background-color: #00685e;
}
.btn.teal:hover, .simform__actions .teal.submit:hover {
  background-color: #007d71;
}
.btn.green, .simform__actions .green.submit {
  background: #4CAF50;
  color: #FFF;
}
.btn.green:active, .simform__actions .green.submit:active, .btn.green:focus, .simform__actions .green.submit:focus {
  background-color: #3e8f41;
}
.btn.green:hover, .simform__actions .green.submit:hover {
  background-color: #449d48;
}
.btn.light-green, .simform__actions .light-green.submit {
  background: #8BC34A;
  color: #FFF;
}
.btn.light-green:active, .simform__actions .light-green.submit:active, .btn.light-green:focus, .simform__actions .light-green.submit:focus {
  background-color: #74a838;
}
.btn.light-green:hover, .simform__actions .light-green.submit:hover {
  background-color: #7eb73d;
}
.btn.lime, .simform__actions .lime.submit {
  background: #CDDC39;
  color: #FFF;
}
.btn.lime:active, .simform__actions .lime.submit:active, .btn.lime:focus, .simform__actions .lime.submit:focus {
  background-color: #b6c423;
}
.btn.lime:hover, .simform__actions .lime.submit:hover {
  background-color: #c6d626;
}
.btn.yellow, .simform__actions .yellow.submit {
  background: #FFEB3B;
  color: #FFF;
}
.btn.yellow:active, .simform__actions .yellow.submit:active, .btn.yellow:focus, .simform__actions .yellow.submit:focus {
  background-color: #ffe60d;
}
.btn.yellow:hover, .simform__actions .yellow.submit:hover {
  background-color: #ffe822;
}
.btn.amber, .simform__actions .amber.submit {
  background: #FFC107;
  color: #FFF;
}
.btn.amber:active, .simform__actions .amber.submit:active, .btn.amber:focus, .simform__actions .amber.submit:focus {
  background-color: #d8a200;
}
.btn.amber:hover, .simform__actions .amber.submit:hover {
  background-color: #edb100;
}
.btn.orange, .simform__actions .orange.submit {
  background: #FF9800;
  color: #FFF;
}
.btn.orange:active, .simform__actions .orange.submit:active, .btn.orange:focus, .simform__actions .orange.submit:focus {
  background-color: #d17d00;
}
.btn.orange:hover, .simform__actions .orange.submit:hover {
  background-color: #e68900;
}
.btn.deep-orange, .simform__actions .deep-orange.submit {
  background: #FF5722;
  color: #FFF;
}
.btn.deep-orange:active, .simform__actions .deep-orange.submit:active, .btn.deep-orange:focus, .simform__actions .deep-orange.submit:focus {
  background-color: #f33a00;
}
.btn.deep-orange:hover, .simform__actions .deep-orange.submit:hover {
  background-color: #ff4409;
}
.btn.brown, .simform__actions .brown.submit {
  background: #795548;
  color: #FFF;
}
.btn.brown:active, .simform__actions .brown.submit:active, .btn.brown:focus, .simform__actions .brown.submit:focus {
  background-color: #5c4137;
}
.btn.brown:hover, .simform__actions .brown.submit:hover {
  background-color: #694a3e;
}
.btn.grey, .simform__actions .grey.submit {
  background: #9E9E9E;
  color: #FFF;
}
.btn.grey:active, .simform__actions .grey.submit:active, .btn.grey:focus, .simform__actions .grey.submit:focus {
  background-color: #878787;
}
.btn.grey:hover, .simform__actions .grey.submit:hover {
  background-color: #919191;
}
.btn.blue-grey, .simform__actions .blue-grey.submit {
  background: #607D8B;
  color: #FFF;
}
.btn.blue-grey:active, .simform__actions .blue-grey.submit:active, .btn.blue-grey:focus, .simform__actions .blue-grey.submit:focus {
  background-color: #4d6570;
}
.btn.blue-grey:hover, .simform__actions .blue-grey.submit:hover {
  background-color: #566f7c;
}

.special {
  color: #16306e;
  position: relative;
  text-decoration: none;
  transition: all 0.15s ease-out;
}
.special:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: 0px;
  left: 0;
  background: #f00;
  visibility: hidden;
  transform: scaleX(0);
  transition: all 0.3s ease-in-out 0s;
}
.special:hover {
  transition: all 0.15s ease-out;
}
.special:hover:before {
  visibility: visible;
  transform: scaleX(1);
}

#baseline {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background-image: url(https://basehold.it/i/24);
}

</style>

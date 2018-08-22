<template>
  <div>
      <div v-if="transfer.error" class="alert alert-danger alert-dismissable">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
          {{ transfer.error }}
      </div>
      <div v-if="transfer.message" class="alert alert-success alert-dismissable">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
          {{ transfer.message }}
      </div>
      <br v-if="transfer.message || transfer.error">
      <div class="content-title">Contact List</div>
      <div id="navbarDropdown" class="left-box">
          <div class="left-box-w">
              <div class="left-box-w-d">
                  <div class="left-box-w-d-d">
                      <div class="left-box-d" v-bind:class="{ 'contacts-intro' : transfer.contacts == ''}">

                          <div class="bar" v-for="data in transfer.contacts" @click="selectContact(data.address)">
                              <div class="middle">
                                  <div class="left">
                                      <a aria-current="false" href="#" id="link" rel="nofollow">
                                          <div class="generated_icon">
                                              {{ transfer.shortAsset(data.name)}}
                                          </div>
                                      </a>
                                      <div class="asset">
                                          <div class="name">{{ data.name }}</div>
                                      </div>
                                  </div>
                                  <div class="right">
                                      <span class="status">{{ transfer.shortIt(data.address,20)}}</span>
                                  </div>
                              </div>
                          </div>

                      </div>
                      <button id="left-box-button" data-toggle="modal" data-target="#contactsModal" style="user-select: none;">ADD NEW CONTACT</button>

                  </div>
              </div>
          </div>
      </div>
      <div class="transfer-box">
          <div class="row header">
              <div class="col-md-7">
                  <h4 class="title">Transfer</h4>
                  <p>Move your assets instantly on Stellar network. It is just happening in few seconds!</p>
              </div>
              <img src="https://api.stellarpay.io/assets/images/money_transfer.png" class="animated bounceInDown">
          </div>
          <div class="row">
              <div class="panel panel-default" style="height:295px">
                  <div class="panel-body">
                      <div class="col-md-4">
                          <div class="form-group">
                              <label>Amount</label>
                              <input type="text" class="form-control" v-model="transfer.transfer.amount" onkeyup="this.value = this.value.replace (/^\.|[^\d\.]/g, '')" placeholder="0.00" maxlength="12" autocomplete="off">
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="form-group">
                              <label>Currency</label>
                              <select class="form-control" v-model="transfer.transfer.currency">
                                  <option v-for="asset in transfer.assets" :value="asset.asset_code">
                                      <p v-if="asset.asset_code != 'native'">
                                          {{ asset.asset_code }}
                                      </p>
                                      <p v-if="asset.asset_code == 'native'">
                                          XLM
                                      </p>
                                  </option>
                              </select>
                          </div>
                      </div>
                      <div class="col-md-5">
                          <div class="form-group">
                              <label>Fee</label>
                              <input type="text" class="form-control" value="0.00001" disabled>
                          </div>
                      </div>
                      <div class="col-md-12">
                          <div class="form-group">
                              <label>Receiver</label>
                              <input type="text" class="form-control" v-model="transfer.transfer.receiver" autocomplete="off">
                          </div>

                          <div class="form-group">
                              <label>MEMO Text</label>
                              <textarea class="form-control" rows="2" v-model="transfer.transfer.note"></textarea>
                          </div>
                          <div class="pull-right">
                              <a href="javascript:void(0)" class="btn btn-success" @click="checkAccount(transfer.transfer.receiver)" v-if="transfer.message != null" v-show="transfer.submitted == false"><b>SEND</b></a>
                              <a href="javascript:void(0)" class="btn btn-success" v-if="transfer.message != null" :disabled="transfer.submitted" v-show="transfer.submitted"><b>SENDING</b></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div class="modal fade" id="contactsModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <section class="modal-content">
                  <div v-if="transfer.error" class="alert alert-danger alert-dismissable">
                      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                      {{ transfer.error }}
                  </div>
                  <br v-if="transfer.error">
                  <div v-if="transfer.message" class="alert alert-success alert-dismissable">
                      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                      {{ transfer.message }}
                  </div>
                  <br v-if="transfer.message">
                  <div class="section-title">
                      <div class="section-title__content">
                          <span class="section-top-title">Add New Contact</span>
                          <span class="subtitle">You dont need to remember your friends or shoppings addresses. Add them in your contacts and save your time.
                          </span>
                      </div>
                  </div>
                  <span>Contact Label</span>
                  <br>
                  <div class="modal-input donthide">
                      <input id="section-input" type="text" v-model="transfer.create_contact.label">
                  </div>
                  <br>
                  <span>Public address</span>
                  <br>
                  <div class="modal-input donthide">
                      <input id="section-input" type="text" v-model="transfer.create_contact.address">
                  </div>
                  <hr>
                  <button class="button large primary inline" @click="createContact(transfer.create_contact.label,transfer.create_contact.address,transfer.create_contact.photo,transfer.account.signature)">Save</button>
              </section>
          </div>
      </div>
  </div>
</template>

<script>
import App from '../App.vue'
import StellarSdk from 'stellar-sdk'
import NavbarComponent from './Header.vue'
import axios from 'axios';

export default {
  components: {
  NavbarComponent
  },
  name: 'Transfer',
  computed: {
    transfer()
    {
        return this.$root;
    },
  },
  mounted(){
    if(this.$root.account.logged == false){
      this.$router.push('login')
    } else {
      this.fetchContacts()
    }
  },
  methods: {
    startTransfer(){
      var prefix = this.$root
      var secret = prefix.account.private
      var transferDest = prefix.transfer.receiver
      var transferAmount = prefix.transfer.amount
      var memo = prefix.transfer.note
      var asset = prefix.transfer.currency
      var keypair = StellarSdk.Keypair.fromSecret(secret);
      if(prefix.testnet_active == false){
        StellarSdk.Network.usePublicNetwork();
        var server = new StellarSdk.Server(prefix.sdf_horizon_server, {allowHttp: true});
      } else {
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
      }
      var sourcePublicKey = keypair.publicKey();
      var router = this.$router
      prefix.submitted = true
      if(asset == ''){
        prefix.error = 'Please select asset type!'
        setTimeout(function() {
          prefix.error = ''
        }, 2000);
        prefix.submitted = false
      }
        if(asset == 'native'){
          var transferAsset = StellarSdk.Asset.native();
        } else {
          var assetIssuer = prefix.transfer.assets[asset]['asset_issuer'];
          var transferAsset = new StellarSdk.Asset(asset , assetIssuer);
        }
        server.loadAccount(sourcePublicKey)
          .then(function(account) {
            var transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.payment({
          destination: transferDest,
          asset: transferAsset,
          amount: transferAmount,
        }))
        .addMemo(StellarSdk.Memo.text(memo))
        .build();
            transaction.sign(keypair);
            server.submitTransaction(transaction)
              .then(function(result) {
                console.log(result);
                if(result.ledger > 0){
                  prefix.message = 'Successfuly transfered'
                  setTimeout(function() {
                      prefix.message = ''
                      prefix.error = ''
                      prefix.submitted = false
                      prefix.transfer.amount = ''
                      prefix.transfer.currency = ''
                      prefix.transfer.note = ''
                      prefix.transfer.receiver = ''
                      prefix.transfer.destinationStatus = ''
                      router.push('dashboard')
                  }, 5000);
                }
              });
          })
          .catch(function(error) {
            prefix.error = error.message
            setTimeout(function(){
              prefix.error = ''
            }, 2000)
            prefix.submitted = false
          });
    },
    createAccountTransfer(){
      var prefix = this.$root
      var secret = prefix.account.private
      var transferDest = prefix.transfer.receiver
      var transferAmount = prefix.transfer.amount
      var memo = prefix.transfer.note
      var asset = prefix.transfer.currency
      var keypair = StellarSdk.Keypair.fromSecret(secret);
      if(prefix.testnet_active == false){
        StellarSdk.Network.usePublicNetwork();
        var server = new StellarSdk.Server(prefix.sdf_horizon_server, {allowHttp: true});
      } else {
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
      }
      var sourcePublicKey = keypair.publicKey();
      var router = this.$router
      prefix.submitted = true
      if(asset == ''){
        prefix.error = 'Please select asset type!'
        setTimeout(function() {
          prefix.error = ''
        }, 2000);
        prefix.submitted = false
      }
        server.loadAccount(sourcePublicKey)
          .then(function(account) {
            var transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.createAccount({
          destination: transferDest,
          startingBalance: transferAmount,
        }))
        .addMemo(StellarSdk.Memo.text(memo))
        .build();
            transaction.sign(keypair);
            server.submitTransaction(transaction)
              .then(function(result) {
                console.log(result);
                if(result.ledger > 0){
                  prefix.message = 'Successfuly transfered'
                  setTimeout(function() {
                      prefix.message = ''
                      prefix.error = ''
                      prefix.submitted = false
                      prefix.transfer.amount = ''
                      prefix.transfer.currency = ''
                      prefix.transfer.note = ''
                      prefix.transfer.receiver = ''
                      prefix.transfer.destinationStatus = ''
                      router.push('dashboard')
                  }, 5000);
                }
              });
          })
          .catch(function(error) {
            prefix.error = error.message
            setTimeout(function(){
              prefix.error = ''
            }, 2000)
            prefix.submitted = false
          });
    },
    createContact(label,address,photo,signature){
      var prefix = this.$root
      prefix.submitted = true
      if(label == '' || address == '' || label == undefined || address == undefined){
        prefix.error = 'Contact label and address cannot be blank!'
        setTimeout(function() {
          prefix.error = ''
        }, 2000);
      } else {
        var current = this
        var params = new URLSearchParams();
        params.append('label', label);
        params.append('photo', 'test');
        params.append('address', address);
        params.append('signature', signature);
            axios.post(this.$root.api_server+'/api/create_contact', params).then(function (response){
              prefix.create_contact = []
              prefix.message = 'Contact successfuly added!'
            })
        setTimeout(function() {
            $('#contactsModal').modal('hide');
            prefix.message = ''
            prefix.submitted = false
            current.fetchContacts()
        }, 2500);
      }
    },
    checkAccount(publicKey){
      var prefix = this.$root
      if(prefix.testnet_active == false){
        StellarSdk.Network.usePublicNetwork();
        var server = new StellarSdk.Server(prefix.sp_horizon_server, {allowHttp: true});
      } else {
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
      }
      var current = this
      server.loadAccount(publicKey)
        .catch(function(error) {
          if(error.message == 'Not Found'){
            prefix.transfer.destinationStatus = 'not_exist'
          }
          if(prefix.transfer.destinationStatus = 'not_exist'){
            current.createAccountTransfer()
          }
        })
        .then(function(account) {
          if(prefix.transfer.destinationStatus != 'not_exist'){
            current.startTransfer()
          }
        });
    },
    fetchContacts(){
      axios.get(this.$root.api_server+'/api/contacts/'+this.$root.account.signature).then(response => {
          this.$root.contacts = response.data.result
      })
    },
    selectContact(address){
      this.$root.transfer.receiver = address
      this.$forceUpdate()
    }
  }
}
</script>

<style>
</style>

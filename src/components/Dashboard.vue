<template>
  <div>
      <!-- LEFT BOX ( LEFT SIDEBAR ) -->
      <div class="content-title">Balances</div>
      <div id="navbarDropdown" class="left-box">
          <div class="left-box-w">
              <div class="left-box-w-d">
                  <div class="left-box-w-d-d">
                      <div class="left-box-d">

                          <div class="bar active" v-on:click="changeAsset('native');">
                              <div class="middle">
                                  <div class="left">
                                      <a aria-current="false" href="#" id="link" rel="nofollow">
                                          <img src="https://api.stellarpay.io/assets/images/assets/xlm.svg" class="icon">
                                      </a>
                                      <div class="asset">
                                          <div class="name">Stellar Lumens</div>
                                      </div>
                                  </div>
                                  <div class="right">
                                      <span class="status" v-show="this.$root.account.native > 0">{{ dashboard.balances['native'] }} XLM</span>
                                      <span class="status" v-show="this.$root.account.native == 0">0.00 XLM</span>
                                  </div>
                              </div>
                          </div>

                          <div class="bar" v-on:click="changeAsset('native');" v-show="dashboard.last_actions['USD-STRONGHOLDISSUERACCOUNT'] == true">
                              <div class="middle">
                                  <div class="left">
                                      <a aria-current="false" href="#" id="link" rel="nofollow">
                                          <img src="https://api.stellarpay.io/assets/images/assets/stronghold.png" class="icon" style="background: cornflowerblue;">
                                      </a>
                                      <div class="asset">
                                          <div class="name">USD (Stronghold)</div>
                                      </div>
                                  </div>
                                  <div class="right">
                                      <span class="status">
  </span>
                                  </div>
                              </div>
                          </div>

                          <div class="bar" v-for="asset in dashboard.assets" v-on:click="changeAsset(asset.asset_code);" v-if="asset.asset_type != 'native'">
                              <div class="middle">
                                  <div class="left">
                                      <a aria-current="false" href="#" id="link" rel="nofollow">
                                          <div class="generated_icon">{{ dashboard.shortAsset(asset.asset_code)}}</div>
                                      </a>
                                      <div class="asset">
                                          <div class="name">{{ asset.asset_code }}</div>
                                      </div>
                                  </div>
                                  <div class="right">
                                      <span class="status">{{ asset.balance }} {{ asset.asset_code }}</span>
                                  </div>
                              </div>
                          </div>

                      </div>
                      <button id="left-box-button" data-toggle="modal" data-target="#newAssetModal" style="user-select: none;">ADD NEW ASSET</button>

                  </div>
              </div>
          </div>
      </div>
      <!-- LEFT BOX END -->
      <!-- CENTER BOX ( CONTENT - MAIN ) END-->
      <div class="center-box">
          <div class="box">

              <div class="center-box-w">
                  <div class="center-box-w-l">
                      <div class="center-box-w-l-d">
                          <span class="center-box-w-l-d-a" v-if="dashboard.balances['native'] > 0 && dashboard.active_currency.code == 'native'">${{ (dashboard.balances['native'] * dashboard.prices.USD_XLM).toFixed(2) }}</span>
                          <span class="center-box-w-l-d-a" v-if="dashboard.balances['native'] == null">$0.00</span>

                          <div class="center-box-w-l-d-a-t" v-if="dashboard.active_currency.code != 'native'">Issuer : {{ dashboard.shortIt(dashboard.transfer.assets[dashboard.active_currency.code].asset_issuer,20) }}</div>
                      </div>
                  </div>

                  <div class="content-header">
                      <button class="button-w">EXCHANGE</button><span class="current-price"><i class="fa fa-info-circle" style="font-size:21px"></i></span></div>
              </div>
              <!-- history -->
              <div class="history">

                  <div v-show="dashboard.last_actions[dashboard.active_currency.code] == false">
                      <div class="no-transaction-top">
                          <i class="fa fa-table" style="font-size:60px;margin-top:60px"></i>
                          <br>
                          <span class="no-transaction-text">There is no received payment for {{ dashboard.active_currency.code }}.</span>
                          <br>
                          <span class="no-transaction-text" style="font-size:15px">*The history indicator filtering transactions for latest 200 and type <b>Payment</b> operations.</span>
                          <br>
                          <span class="no-transaction-text" style="font-size:14px">If you are looking for detailed history , switch <router-link to="/history" style="color:darkblue">[History]</router-link> page.</span>
                      </div>
                  </div>

                  <div v-show="dashboard.account.status == 'not_exist'">
                      <div class="no-transaction-top">
                          <i class="fa fa-table" style="font-size:60px;margin-top:90px"></i>
                          <br>
                          <span class="no-transaction-text">Your Stellar account doesnt exist on the network.</span>
                          <br>
                          <span class="no-transaction-text" style="font-size:15px">To create a account, send least <b>1 XLM</b> to your wallet.</span>
                      </div>
                  </div>

                  <table class="history-table table table-striped table-hover">
                      <tbody>
                          <tr v-for="item in dashboard.last_actions[dashboard.active_currency.code]" :data-href="'/account/tx/'+item.transaction_hash">
                              <td width="80px">
                                  <div class="date">
                                      <p style="font-size:16px">{{ item.tx_type }}</p>
                                  </div>
                              </td>
                              <td>
                                  <span v-if="(item.type == 'payment' && item.source_account == dashboard.account.public)">Transfer to {{ dashboard.shortIt(item.to,10) }}</span>
                                  <span v-if="(item.type == 'payment' && item.source_account != dashboard.account.public)">Transfer from {{ dashboard.shortIt(item.source_account,10) }}</span>
                                  <span v-if="(item.type == 'create_account')">Create Account</span>
                                  <span class="label label-success" v-if="item.succeeds"> Confirmed </span>
                                  <span class="label label-default" v-if="item.status == 3"> Refund </span>
                              </td>
                              <td align="right">
                                  <span class="text-danger" style="font-weight: initial;" v-if="(item.source_account == dashboard.account.public)">- {{ item.amount }} {{ item.asset_code }} </span>
                                  <span class="text-success" style="font-weight: initial;" v-if="(item.source_account != dashboard.account.public)">+ {{ item.amount }} {{ item.asset_code }} </span>
                                  <span> {{ dashboard.horizonTime(item.created_at) }} </span></td>
                          </tr>
                      </tbody>
                  </table>
                  <a v-if="dashboard.last_actions.length > 5" href="#" class="view"><i class="fa fa-history" aria-hidden="true"></i> All History</a>
              </div>
          </div>
      </div>
      <div class="content-title" style="margin-top:30px">Action Chart</div>
      <div class="left-box" style="max-width:685px">
          <div class="chart-box">
              <div class="tradingview-widget-container">
                  <div id="tv-medium-widget"></div>
              </div>
          </div>
      </div>

      <!-- RIGHT BOX ( RIGHT SIDEBAR ) -->
      <div class="right-box">
          <a class="twitter-timeline" data-height="400" href="https://twitter.com/StellarOrg?ref_src=twsrc%5Etfw">Tweets by StellarOrg</a>
      </div>
      <!-- RIGHT BOX END -->

      <div class="modal fade" id="newAssetModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <section class="modal-content">
                  <div v-if="dashboard.error" class="alert alert-danger alert-dismissable">
                      {{ dashboard.error }}
                  </div>
                  <br v-if="dashboard.error">
                  <div v-if="dashboard.message" class="alert alert-success alert-dismissable">
                      {{ dashboard.message }}
                  </div>
                  <br v-if="dashboard.message">
                  <div class="section-title">
                      <div class="section-title__content">
                          <span class="section-top-title">Add New Asset</span>
                          <span class="subtitle">Stellar allows hold any type of asset: USD,BTC and other tokens of value.
          </span>
                      </div>
                  </div>
                  <span>Asset Code</span>
                  <br>
                  <div class="modal-input donthide">
                      <input id="section-input" type="text" v-model="dashboard.create_asset.code">
                  </div>
                  <br>
                  <span>Issuer</span>
                  <br>
                  <div class="modal-input donthide">
                      <input id="section-input" type="text" v-model="dashboard.create_asset.issuer">
                  </div>
                  <hr>
                  <button class="button large primary inline" @click="createAsset(dashboard.account.private,dashboard.create_asset.code,dashboard.create_asset.issuer,dashboard.create_asset.limit,dashboard.create_asset.label,dashboard.create_asset.logo)" v-show="dashboard.submitted == false">Create</button>
                  <button class="button large primary inline" @click="createAsset(dashboard.account.private,dashboard.create_asset.code,dashboard.create_asset.issuer,dashboard.create_asset.limit,dashboard.create_asset.label,dashboard.create_asset.logo)" :disabled="dashboard.submitted" v-show="dashboard.submitted">Creating</button>
                  <button class="button large primary inline" @click="resetButton()" style="background:#c47f00;border: 1px solid #c47f00">Reset</button>
                </section>
          </div>
      </div>
  </div>
</template>

<script>
import StellarSdk from 'stellar-sdk'
import toggleSwitch from '../lib/ToggleSwitch'
import axios from 'axios';

export default {
  computed: {
    dashboard()
    {
        return this.$root;
    }
  },
  mounted() {
    if(this.$root.account.logged == false){
      this.$router.push('login')
    }
    if(this.$root.account.logged == true){
      this.fetchTrustlines()
      this.$nextTick(function () {
      window.setInterval(() => {
      var current = this
      current.$forceUpdate()
      $(".bar").click(function(){
          $(".bar").removeClass("active");
          $(this).addClass("active");
      });
        }, 1000);
        window.setInterval(() => {
        var current = this
        current.fetchTrustlines()
      }, 8000);
    })
    }
    /* eslint-disable */
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t.widgets.load();
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };
      return t;
    }(document, "script", "twitter-wjs"));
    /* eslint-enable */
    new TradingView.MediumWidget(
    {
    "container_id": "tv-medium-widget",
    "symbols": [
      [
        "Stellar",
        "XLMUSD"
      ],
      [
        "Repo Coin",
        "REPOUSDT"
      ],
      [
        "Mobius",
        "SLTUSDT"
      ],
      [
        "Smartlands",
        "SLTUSDT"
      ],
      [
        "SureRemit",
        "RMTUSDT"
      ]
    ],
    "greyText": "Quotes by",
    "gridLineColor": "#e9e9ea",
    "fontColor": "#83888D",
    "underLineColor": "#dbeffb",
    "trendLineColor": "#4bafe9",
    "width": "1000px",
    "height": "400px",
    "locale": "en"
    }
    );
  },
  methods:{
      createAsset(secret,code,issuer,limit,label,logo){
        var prefix = this.$root
        if(prefix.testnet_active == false){
          StellarSdk.Network.usePublicNetwork();
          var server = new StellarSdk.Server(prefix.sdf_horizon_server, {allowHttp: true});
        } else {
          StellarSdk.Network.useTestNetwork();
          var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
        }
        var keypair = StellarSdk.Keypair.fromSecret(secret);
        var sourcePublicKey = keypair.publicKey();
        var met = this
        prefix.submitted = true
        server.loadAccount(sourcePublicKey)
        .then(function(account) {
          var asset = new StellarSdk.Asset(code, issuer);
          var transaction = new StellarSdk.TransactionBuilder(account)
          .addOperation(StellarSdk.Operation.changeTrust({
            asset: asset
          }))
          .build();
          transaction.sign(keypair);
          server.submitTransaction(transaction)
            .then(function(result) {
              if(result.ledger > 0){
                prefix.message = 'Asset successfuly added!'
                setTimeout(function() {
                    prefix.message = ''
                    prefix.error = ''
                    prefix.create_asset = []
                    $('#newAssetModal').modal('hide');
                    prefix.submitted = false
                }, 2500);
              } else {
                setTimeout(function() {
                    prefix.submitted = false
                }, 2500);
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
        fetchTrustlines() {
        var prefix = this.$root
        if(prefix.testnet_active == false){
          StellarSdk.Network.usePublicNetwork();
          var server = new StellarSdk.Server(prefix.sp_horizon_server, {allowHttp: true});
        } else {
          StellarSdk.Network.useTestNetwork();
          var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
        }
        var current = this
        prefix.account.status = ''
        server.loadAccount(prefix.account.public)
        .then(function(account) {
          $.grep(account.balances, function (altered) {
            if(altered.asset_type == 'native'){
              altered.asset_code = 'native'
              altered.code = 'XLM'
              altered.rate = ''
              altered.status = true
              prefix.balances[altered.asset_type] = altered.balance
              prefix.account.native = altered.balance
              prefix.assets = account.balances
              current.fetchHistory('native')
            } else {
              prefix.active_currency.issuer = altered.asset_issuer
              altered.code = altered.asset_code
              altered.issuer = altered.asset_issuer
              altered.rate = ''
              altered.status = false
              prefix.transfer.assets[altered.asset_code] = altered
              prefix.balances[altered.asset_code] = altered.balance
              prefix.assets = account.balances
              current.fetchHistory(altered.asset_code)
            }
          });
        })
        .catch(function(error) {
          if(error){
            prefix.account.status = 'not_exist'
          }
        });
      },
      resetButton(){
        var prefix = this.$root
        prefix.submitted = false
      },
      fetchHistory(asset) {
        var prefix = this.$root
        if(prefix.testnet_active == false){
          StellarSdk.Network.usePublicNetwork();
          var server = new StellarSdk.Server(prefix.sp_horizon_server, {allowHttp: true});
        } else {
          StellarSdk.Network.useTestNetwork();
          var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
        }
        var current = this
        server.payments()
          .forAccount(prefix.account.public)
          .order('desc')
          .limit(200)
          .call()
          .then(function (operationResult) {
            prefix.last_actions[asset] = operationResult.records
            var filtered = prefix.last_actions[asset].filter(function (el) {
              if(asset == 'native'){
                  el.asset_code = 'XLM'
                 return el.asset_type == asset;
              } else {
                return el.asset_code == asset;
              }
            });
            prefix.last_actions[asset] = filtered
            $.grep(prefix.last_actions['native'], function(layerElement){
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
    changeAsset(asset) {
      this.$root.active_currency.code = asset
      this.$forceUpdate()
    }
  }
}
</script>

<style>
 @import '../assets/css/modal.css';
 @import '../assets/css/ToggleSwitch.css';
</style>

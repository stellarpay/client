<template>
  <div>
    <div v-if="merchants.error" class="alert alert-danger alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    {{ merchants.error }}
    <br>
    </div>
    <div v-if="merchants.message" class="alert alert-success alert-dismissable">
  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    {{ merchants.message }}
    <br>
  </div>
    <div class="content-title">API List</div>
    <div id="navbarDropdown" class="left-box">
        <div class="left-box-w">
            <div class="left-box-w-d">
                <div class="left-box-w-d-d">
                    <div class="left-box-d" v-bind:class="{ 'merchants-intro' : merchants.merchants == undefined}">
                        <div class="bar" v-for="data in merchants.merchants" data-toggle="modal" data-target="#apiModal" @click="selectApi(data)">
                            <div class="middle">
                                <div class="left">
                                    <a aria-current="false" href="#" id="link" rel="nofollow">
                                        <div class="generated_icon" v-show="data.apiImage == 'undefined' || data.apiImage == ''">
                                            {{ merchants.shortAsset(data.apiLabel)}}
                                        </div>
                                        <div class="generated_icon" v-show="data.apiImage != 'undefined'" style="background:transparent">
                                            <img :src="data.apiImage" style="border-style: none; height: 100%;">
                                        </div>
                                    </a>
                                    <div class="asset">
                                        <div class="name">{{ data.apiLabel }}</div>
                                    </div>
                                </div>
                                <div class="right">
                                    <span class="status">[API DETAILS]</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <router-link to="/create" id="left-box-button">
                        <center>Create New API</center>
                    </router-link>

                </div>
            </div>
        </div>
    </div>

    <div class="transfer-box">
        <div class="row" style="background-color: #fff;overflow: auto;position: relative;">
            <div class="panel panel-default" style="margin-top:-65px">
                <div style="margin-top:104px">
                    <center>
                        <i class="fa fa-external-link-square" style="font-size:35px"></i>
                        <h1 style="font-size:55px">{{ merchants.stats.orderCount }}</h1>
                        <h3>Orders</h3>
                        <h5>created</h5>
                        <hr>
                        <h3 style="font-size:35px">&</h3>
                        <h1 style="font-size:55px;margin-top:25px">{{ merchants.stats.salesCount }}</h1>
                        <h3>Payments</h3>
                        <h5>processed</h5>
                    </center>
                </div>
            </div>
        </div>
    </div>

    <div class="box" v-show="merchants.merchant_box.status">
        <div class="row">
            <div class="panel panel-default" style="height:456.5px">
                <div class="panel-body">
                    <div class="col-md-12">
                        API Label : {{ merchants.merchant_box.data.apiLabel }} , API ID : {{ merchants.merchant_box.data.apiId }} , Key : {{ merchants.merchant_box.data.apiKey }}
                        <br>
                        <button type="button" @click="showBox()">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="apiModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">

            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                    <h3 class="modal-title" id="lineModalLabel">{{ merchants.active_api.apiLabel }} - API Details</h3>
                </div>
                <div class="modal-body">
                    <center>
                        <div class="generated_icon" v-show="merchants.active_api.apiImage == 'undefined' || merchants.active_api.apiImage == ''" style="width:100px;height:100px">
                        </div>
                        <img :src="merchants.active_api.apiImage" v-show="merchants.active_api.apiImage != 'undefined'" style="width:150px">
                    </center>
                    <span>API Key</span>
                    <br>
                    <div class="modal-input hideit">
                        <input class="css-et39ve e1opuodt6" disabled="disabled" id="section-input" type="text" :value="merchants.active_api.apiId">
                    </div>
                    <br>
                    <span>API Secret</span>
                    <br>
                    <div class="modal-input hideit">
                        <input class="css-et39ve e1opuodt6" disabled="disabled" id="section-input" type="text" :value="merchants.active_api.apiSecret">
                    </div>
                    <br>
                    <span>Label</span>
                    <br>
                    <div class="modal-input donthide">
                        <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.active_api.apiLabel">
                    </div>
                    <br>
                    <span>Logo URL</span>
                    <br>
                    <div class="modal-input donthide">
                        <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.active_api.apiImage">
                    </div>
                    <br>
                    <span>Notification URL</span>
                    <br>
                    <div class="modal-input donthide">
                        <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.active_api.apiIpn">
                    </div>
                    <br>
                    <span>Success URL</span>
                    <br>
                    <div class="modal-input donthide">
                        <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.active_api.successUrl">
                    </div>
                    <br>
                    <span>Cancel URL</span>
                    <br>
                    <div class="modal-input donthide">
                        <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.active_api.cancelUrl">
                    </div>
                    <br>
                    <span>Asset ratios</span>
                    <ul class="list-group" v-for="(rate, asset_name) in merchants.active_api.acceptedCurrencies" v-if="asset_name != 'native'">
                    <br>
                      <li class="list-group-item" style="padding:0px;border:0px;">
                        <div class="left">
                        <div class="generated_icon">{{ merchants.shortAsset(asset_name)}}</div>
                        <span style="margin-left:10px;font-weight:600"> {{ asset_name }}</span>
                      </div>
                        <div class="right">
                          <span class="status" style="margin-top:-50px">
                          per XLM<input id="search" type="text" class="form-control input-lg" v-model="merchants.active_api.acceptedCurrencies[asset_name].rate" placeholder="Asset/XLM Rate" style="width:100px;height:35px"/></span>
                          </div>
                      </li>
                      <hr>
                    </ul>
                    <hr>
                    <center>
                        <a class="button large primary inline" style="text-decoration:none" target="_blank" href="https://stellarpay.io/documentation">API DOCUMENTATION</a>
                        <a class="button large primary inline" style="text-decoration:none;background:orange;border:1px solid orange" @click="updateMerchant()">UPDATE MERCHANT</a>
                        <a target='_blank' :href="'https://checkout.stellarpay.io/?amount=5&description=test&merchant=' + merchants.active_api.apiId">
                          <div v-if="merchants.active_api.isShopify != 'true'">
                            </br></br>
                            <button class="button large primary inline" style="margin-left:10px;background:#777;border-color:#aaa"><i class="fa fa-external-link" aria-hidden="true"></i>&nbsp&nbspTEST ORDER</button>
                          </div>
                        </a>
                    </center>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default{
  computed : {
    merchants(){
      return this.$root;
    }
  },
  mounted(){
    this.fetchMerchants()
    if(this.$root.account.logged == false){
      this.$router.push('login')
    }

    $(".submit").click(function(){
    	return false;
    })
    this.fetchStats()
    },
    methods:{
      updateMerchant(){
        this.$root.error = ''
        this.$root.api_message = ''
        var prefix = this.$root
        var current = this
        var params = new URLSearchParams();
        console.log(prefix.active_api)
          params.append('label', prefix.active_api.apiLabel);
          params.append('ipn', prefix.active_api.apiIpn);
          params.append('currencies', JSON.stringify(prefix.active_api.acceptedCurrencies));
          params.append('logo', prefix.active_api.apiImage);
          params.append('success', prefix.active_api.successUrl);
          params.append('cancel', prefix.active_api.cancelUrl);
          params.append('signature', prefix.account.signature);
          params.append('api_id', prefix.active_api.apiId);
              axios.post(this.$root.api_server+'/api/update_merchant', params).then(function (response){
                if(response.data.message){
                  prefix.error = response.data.error
                } else{
                  $('#apiModal').modal('toggle');
                  current.fetchMerchants()
                  prefix.message = 'Merchant API Successfuly Updated!'
                  setTimeout(function() {
                      prefix.message = ''
                  }, 2500);
                }
              })
      },
      fetchMerchants(){
        axios.get(this.$root.api_server+'/api/merchants/'+this.$root.account.signature).then(response => {
            this.$root.merchants = response.data.result
            })
      },
      fetchStats(){
        axios.get(this.$root.api_server+'/api/stats/'+this.$root.account.id).then(response => {
            this.$root.stats = response.data
            })
      },
      selectApi(data){
        var prefix = this.$root
        prefix.active_api = data

      }
    }

}
</script>

<style>
</style>

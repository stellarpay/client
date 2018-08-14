<template>
  <div>
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
                                            <img :src="data.apiImage" style="border-style: none; width: 40px; height: 40px;">
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
                        <h5>created by customers</h5>
                        <hr>
                        <h3 style="font-size:35px">&</h3>
                        <h1 style="font-size:55px;margin-top:25px">{{ merchants.stats.salesCount }}</h1>
                        <h3>payments successfully</h3>
                        <h5>completed since 2018/08</h5>
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
                        <img :src="merchants.active_api.apiImage" style="height:100px;weight:100px" v-show="merchants.active_api.apiImage != 'undefined'">
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
                    <span>Notification URL</span>
                    <br>
                    <div class="modal-input hideit">
                        <input class="css-et39ve e1opuodt6" disabled="disabled" id="section-input" type="text" :value="merchants.active_api.apiIpn">
                    </div>
                    <br>
                    <span>Success URL</span>
                    <br>
                    <div class="modal-input hideit">
                        <input class="css-et39ve e1opuodt6" disabled="disabled" id="section-input" type="text" :value="merchants.active_api.successUrl">
                    </div>
                    <br>
                    <span>Cancel URL</span>
                    <br>
                    <div class="modal-input hideit">
                        <input class="css-et39ve e1opuodt6" disabled="disabled" id="section-input" type="text" :value="merchants.active_api.cancelUrl">
                    </div>
                    <hr>
                    <center>
                        <button class="button large primary inline" data-clipboard-text="http://laaaocalhost/?ref=1">CHECK API DOCUMENTATION</button>
                        <a target='_blank' :href="'https://stellarpay.io/checkout/?amount=5&description=test&merchant=' + merchants.active_api.apiId">
                            <button class="button large primary inline" style="margin-left:10px;background:#777;border-color:#aaa"><i class="fa fa-external-link" aria-hidden="true"></i>&nbsp&nbspTEST ORDER</button>
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
      createMerchant(label,ipn,currencies,logo){
        this.$root.error = ''
        this.$root.api_message = ''
        var prefix = this.$root
        var current = this
        var params = new URLSearchParams();
          params.append('user_id', prefix.account.id);
          params.append('label', label);
          params.append('ipn', ipn);
          params.append('currencies', JSON.stringify(currencies));
          params.append('logo', logo);
          params.append('signature', prefix.account.signature);
              axios.post('https://api.stellarpay.io/api/create_merchant', params).then(function (response){
                if(response.data.message){
                  prefix.error = response.data.error
                } else{
                  prefix.message = 'Merchant API Successfuly Created!'
                  current.fetchMerchants()
                  setTimeout(function() {
                      prefix.message = ''
                      prefix.api = []
                  }, 2500);
                }
              })
      },
      fetchMerchants(){
        axios.get('https://api.stellarpay.io/api/'+'merchants/'+this.$root.account.signature).then(response => {
            this.$root.merchants = response.data.result
            })
      },
      fetchStats(){
        axios.get('https://api.stellarpay.io/api/'+'stats/'+this.$root.account.id).then(response => {
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

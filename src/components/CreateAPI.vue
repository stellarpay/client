<template>
  <div>
    <div v-if="merchants.error" class="alert alert-danger alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    {{ merchants.error }}
    </div>
    <div v-if="merchants.message" class="alert alert-success alert-dismissable">
  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    {{ merchants.message }}
  </div>
  <br>
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
  <section class="modal-content" v-show="merchants.pages.api == false">
<div class="section-title">
<div class="section-title__content">
<span class="section-top-title">Create New API</span>
</span>
</div>
</div>
<span>Label *</span>
<br>
    <div class="modal-input donthide">
      <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.api.label" placeholder="API Label">
    </div>
  <br>
  <span>Logo</span>
  <br>
    <div class="modal-input donthide">
      <input class="css-et39ve e1opuodt6" id="section-input" type="text" v-model="merchants.api.logo" placeholder="Merchant logo for payment gateway (URL)">
    </div>
    <br>
  <span>Notification Url *</span>
  <br>
    <div class="modal-input donthide">
      <input class="css-et39ve e1opuodt6" id="section-input" v-model="merchants.api.ipn" placeholder="Payment notification URL">
    </div>
    <br>
  <span>Success Transaction URL *</span>
  <br>
    <div class="modal-input donthide">
      <input class="css-et39ve e1opuodt6" id="section-input" v-model="merchants.api.success" placeholder="Redirect URL after transaction succeed">
    </div>
    <br>
  <span>Cancel Transaction URL *</span>
  <br>
    <div class="modal-input donthide">
      <input class="css-et39ve e1opuodt6" id="section-input" v-model="merchants.api.cancel" placeholder="Redirect URL after order cancelled">
    </div>
<hr>
<button class="button large primary inline" @click="next()">Next</button>
</section>
<center><div v-show="merchants.pages.api == true">
<button class="button large primary alternative" @click="previous()">Previous</button>
<button class="button large primary inline" @click="createMerchant(merchants.api.label,merchants.api.ipn,merchants.api.approved_currencies,merchants.api.logo,merchants.api.success,merchants.api.cancel)">Create</button>
</div></center><br>
<section class="modal-content" v-show="merchants.pages.api == true">
<div class="section-title">
<div class="section-title__content">
<span class="section-top-title">Create New API</span>
<span class="subtitle">Accept additional assets on payment gateway.</span>
</span>
</div>
</div>

<div class="col-md-15">
    <input id="search" type="text" class="form-control input-lg" placeholder="Search in assets"/>
    <br>
    <div class="thereis-no" v-show="merchants.assets == false" v-if="merchants.assets['native'] != true">
  <p>You dont have additional assets except Stellar Lumens(XLM)</p>
    </div>
    <ul class="list-group" v-for="asset in merchants.assets" v-if="asset.asset_type != 'native'">
      <li class="list-group-item" style="padding:0px;border:0px;">
        <div class="left">
        <i class="fa fa-plus" style="font-size:20px;color:green;margin-right:10px" v-if="asset.status == false" v-on:click="selectAsset(asset.asset_code)"></i>
        <i class="fa fa-check" style="font-size:20px;color:green;margin-right:10px" v-if="asset.status != false" v-on:click="resetAsset(asset.asset_code)"></i>
        <div class="generated_icon">{{ merchants.shortAsset(asset.asset_code)}}</div>
        <span style="margin-left:10px;font-weight:600"> {{ asset.asset_code }}</span>
      </div>
        <div class="right">
          <span class="status" style="margin-top:-35px">
          <input id="search" type="text" class="form-control input-lg" v-model="asset.rate" placeholder="Asset/XLM Rate" style="width:200px;height:35px"/></span>
          </div>
      </li>
      <hr>
    </ul>
  </div>
  <div v-show="merchants.pages.api == false">
  <button class="button large primary alternative" @click="previous()">Previous</button>
  <button class="button large primary inline" @click="createMerchant(merchants.api.label,merchants.api.ipn,merchants.api.approved_currencies,merchants.api.logo,merchants.api.success,merchants.api.cancel)">Create</button>
  </div>
</section>
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
    this.fillAssets()
    this.$root.api.approved_currencies = {native : ''}
    if(this.$root.account.logged == false){
      this.$router.push('login')
    }
    $("i.fa-question-circle").tooltip();

    $(".submit").click(function(){
    	return false;
    })
    $(function(){
	$('#search').keyup(function(){
		var current_query = $('#search').val();
		if (current_query !== "") {
			$(".list-group li").hide();
			$(".list-group li").each(function(){
				var current_keyword = $(this).text();
				if (current_keyword.indexOf(current_query) >=0) {
					$(this).show();
				};
			});
		} else {
			$(".list-group li").show();
		};
	});
});
    },
    methods:{
      createMerchant(label,ipn,currencies,logo,success,cancel){
        this.$root.error = ''
        this.$root.api_message = ''
        var prefix = this.$root
        var current = this
        var router = this.$router
          var params = new URLSearchParams();
          params.append('user_id', prefix.account.id);
          params.append('label', label);
          params.append('ipn', ipn);
          params.append('success', success);
          params.append('cancel', cancel);
          params.append('currencies', JSON.stringify(prefix.api.approved_currencies));
          params.append('logo', logo);
          params.append('public', prefix.account.public);
          params.append('signature', prefix.account.signature);
              axios.post('https://api.stellarpay.io/api/create_merchant', params).then(function (response){
                if(response.data.message){
                  prefix.error = response.data.error
                } else{
                  prefix.message = 'Merchant API Successfuly Created!'
                  current.fetchMerchants()
                  setTimeout(function() {
                      prefix.message = ''
                      prefix.api.ipn = ''
                      prefix.api.label = ''
                      prefix.api.logo = ''
                      prefix.api.success = ''
                      prefix.api.cancel = ''
                      prefix.pages.api = false
                      prefix.api.approved_currencies = {native : ''}
                      router.push('merchants')
                  }, 3500);
                }
              })
      },
      fetchMerchants(){
        axios.get('https://api.stellarpay.io/api/'+'merchants/'+this.$root.account.signature).then(response => {
            this.$root.merchants = response.data.result
            })
      },
      fillAssets(){
        var prefix = this.$root
        prefix.api.currencies = prefix.transfer.assets
        this.$forceUpdate()
      },
      selectAsset(asset){
          var prefix = this.$root
          if(prefix.api.currencies[asset].rate == ''){
            prefix.error = 'Selected asset rate cannot be blank'
            setTimeout(function() {
              prefix.error = ''
            }, 2500);
          } else {
            prefix.api.currencies[asset].status = true
            prefix.api.approved_currencies[asset] = prefix.api.currencies[asset]
            console.log(prefix.api.approved_currencies)
            this.$forceUpdate()
          }
      },
      resetAsset(asset){
        var prefix = this.$root
        prefix.api.currencies[asset].status = false
        delete prefix.api.approved_currencies[asset]
        this.$forceUpdate()
      },
      next(){
        var prefix = this.$root
        if(prefix.api.label == '' || prefix.api.ipn == '' || prefix.api.success == ''|| prefix.api.cancel == ''){
          prefix.error = '* Signed values cannot be empty.'
          setTimeout(function() {
            prefix.error = ''
          }, 2500);
        } else {
          prefix.error = ''
          prefix.pages.api = true
        }
      },
      previous(){
        var prefix = this.$root
        prefix.pages.api = false
      }
    }

}
</script>

<style>
i.fa-question-circle, i.fa-question-circle:hover, i.fa-question-circle:visited {

    color: black;
}
</style>

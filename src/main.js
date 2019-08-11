import Vue from 'vue'
import App from './App.vue'
import StellarSdk from 'stellar-sdk'
import router from './router/index'
import NavbarComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'
import axios from 'axios';
import moment from 'moment';
import setState from 'vue-set-state'
import StellarBase from 'stellar-base';
import sjcl from 'sjcl';
Vue.use(setState)

var path = require("path");
var segments = require("segments");

new Vue({
  el: 'app',
  router,
  components:{App,NavbarComponent,FooterComponent},
  data: {
  testnet_active : false,
  // StellarPay Horizon Server - Increased Request Rate, Using for Fetching Requests
  sp_horizon_server : 'https://horizon.stellar.org',
  // Stellar Foundation Horizon Server - Using for Broadcasting Operations
  sdf_horizon_server : 'https://horizon.stellar.org',
  // Testnet Server for Sandbox Operations
  testnet_horizon_server : 'https://horizon-testnet.stellar.org/',
  api_server : 'https://api.stellarpay.io',
  prices : '',
  merchants: [],
  contacts: [],
  default_box: {
    status: true
  },
  merchant_box: {
    status: false,
    data: []
  },
  pages: {
    main : true,
    transfer : false,
    merchants : false,
    settings : false,
    signin: true,
    logged: false,
    signup: false,
    api : false,
  },
  error : '',
  message : '',
  transfer_message : '',
  amount : '',
  receiver: '',
  note: '',
  fee: '',
  tx_id: '',
  last_actions: {},
  history:[],
  isfilled: 'false',
  result: '',
  random_bg : '',
  active_api : {},
  active_currency:{
    code : 'native',
    chart_code : '',
    total : '',
    issuer : '',
    logo : '',
    label : '',
    amount : ''
  },
  reports: {
    list : {},
    sum : ''
  },
  temporary : {},
  balances : {},
  assets : [],
  transfer : {
    currency : '',
    amount : '',
    receiver : '',
    note : '',
    assets : {},
    destinationStatus : ''
  },
  submitted : false,
  mnemonic: undefined,
  bip39Seed: undefined,
  StellarBase: true,
  sjcl: true,
  pubKey: undefined,
  secretKey: undefined,
  useDefaultAccount: true,
  pathEditable: false,
  checked: true,
  derivationPath: '0',
  derivationPathIndex: 0,
  derivationPrefix: "44'/148'/",
  buttonVisible: true,
  restoring: false,
  restoredPhrase: [],
  wordValue: '',
  passphrase: '',
  language: "english",
  languageDescription: 'English',
  mnemonicInvalid: false,
  stats: {},
  api:{
    label : '',
    domain : '',
    success : '',
    cancel : '',
    currencies : {},
    is_shopify: 'true'
  },
  create_contact: {
    label : '',
    address : '',
    photo : ''
  },
  create_asset: {
    label : '',
    code : '',
    issuer : '',
    limit : '',
    logo : ''
  },
  signup: {
    id : '',
    password : '',
    password_repeat : '',
    data: '',
    email: '',
    public: '',
    private: '',
  },
  account: {
    id : '',
    password : '',
    data: '',
    signature : '',
    public: '',
    private: '',
    payload : '',
    mnemonic : '',
    from : '',
    native : '',
    date: '',
    logged: false,
    status: ''
  },
  syncWithServer:{
    public : '',
    private: '',
    data : '',
    signature : '',
    content : '',
    random : [],
    keySize : 256,
    mnemonic : '',
    iterations : 1000
  }
  },
  created(){
            path = window.location.pathname;
            segments = path.split("/");
        this.account.date = new Date().toLocaleDateString();
        this.fetchPrice()
        window.setInterval(() => {
        var current = this
        current.fetchPrice()
      }, 45000);
    },

  watch: {
    },
  methods: {
    fetchTrustlines() {
    var prefix = this
    if(prefix.testnet_active == false){
      StellarSdk.Network.usePublicNetwork();
      var server = new StellarSdk.Server(prefix.sp_horizon_server, {allowHttp: true});
    } else {
      StellarSdk.Network.useTestNetwork();
      var server = new StellarSdk.Server(prefix.testnet_horizon_server, {allowHttp: true});
    }
    var vm = this;
    server.loadAccount(prefix.account.public)
    .then(function(account) {
      $.grep(account.balances, function (altered) {
        if(altered.asset_type == 'native'){
          altered.asset_code = 'native'
          prefix.balances[altered.asset_type] = altered.balance
          prefix.assets = account.balances
        } else {
          prefix.active_currency.issuer = altered.asset_issuer
          prefix.balances[altered.asset_code] = altered.balance
          prefix.assets = account.balances
        }
      });
    });
    },
    createMerchant(){
      this.error = ''
      this.api_message = ''
        var params = new URLSearchParams();
        params.append('label', this.api.label);
        params.append('domain', this.api.domain);
        params.append('currencies', this.api.currencies);
            axios.post('/api/create_merchant', params).then(function (response){
              if(response.data.message){
                this.error = response.data.error
              } else{
                this.message = 'Merchant API Successfuly Created!'
              }
            })
    },
    updateSettings(){
      this.message = ''
        var params = new URLSearchParams();
        params.append('first_name', this.settings.first_name);
        params.append('last_name', this.settings.last_name);
        params.append('email', this.settings.email);
        params.append('phone', this.settings.phone);
        params.append('language', this.settings.language);
            axios.post('/api/settings', params).then(function (response){
                if(response.data.result == 0){
                    this.error = response.data.error
                } else {
                    this.message = response.data.message
                }
            })
    },
    merchantBox(data){
      this.merchant_box.data = data,
      this.merchant_box.status = true,
      this.default_box.status = false
    },
    fetchPrice(){
      axios.get(this.$root.api_server+'/api/prices').then(response => {
          this.$root.prices = response.data
          })
    },
    toHM(date){
    var date = new Date(date)
    return moment(date).format('HH:mm')
    },
    toMD(date){
      var date = new Date(date)
      return moment(date).format('DD-MM-YYYY')
    },
    horizonTime(time, zone) {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment(time).format('DD MMM / HH:mm')
    },
    toUP(data){
    return data.toUpperCase()
    },
    shortIt(string,length){
      var maxLength = length;
      var result = string.substring(0, maxLength) + '...';
      return result
    },
    shortAsset(string){
      var maxLength = 1;
      var result = string.substring(0, maxLength) + string.substring(3, maxLength);
      return result
    }

  }
});

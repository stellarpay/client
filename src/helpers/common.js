import StellarSdk from 'stellar-sdk'
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
      StellarSdk.Network.usePublicNetwork();
      var prefix = this.$root
      var keypair = StellarSdk.Keypair.fromSecret(secret);
      var server = new StellarSdk.Server(prefix.horizon_server);
      var sourcePublicKey = keypair.publicKey();
      var asset = new StellarSdk.Asset(code, issuer);
    server.loadAccount(sourcePublicKey)
      .then(function(account) {
        var transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: asset
        }))
        .build();
        transaction.sign(keypair);
        server.submitTransaction(transaction)
          .then(function(result) {
            console.log(result);
          });
      });
    },
    fetchTrustlines() {
    StellarSdk.Network.usePublicNetwork();
    var prefix = this.$root
    var server = new StellarSdk.Server(prefix.horizon_server);
    var vm = this;
    server.loadAccount('GATSNAWVCTFFE7DAGFPYBXBZX3OWL7KL6NPWUPS2KSGOFY4CB7EKXDPQ')
    .then(function(account) {
      $.grep(account.balances, function (altered) {
        if(altered.asset_type == 'native'){
          altered.asset_code = 'native'
          prefix.balances[altered.asset_type] = altered.balance
        } else {
          prefix.balances[altered.asset_code] = altered.balance
        }
        prefix.assets = account.balances
      });
    });
  },
  fetchHistory() {
    var prefix = this.$root
    var server = new StellarSdk.Server(prefix.horizon_server);
    server.payments()
      .forAccount(prefix.account.public)
      .order('desc')
      .call()
      .then(function (operationResult) {
        prefix.last_actions = operationResult.records
        $.grep(prefix.last_actions, function (a) {
        if (a.type == 'payment') {
            a.tx_type = 'Payment';
            a.asset_code = 'XLM';
        }
        if (a.type == 'create_account') {
            a.tx_type = 'Create';
            a.amount = a.starting_balance;
            a.asset_code = 'XLM';
            a.to = a.account;
        }
        return a;
        });
      })
      .catch(function (err) {
        console.error(err);
      })
  },
  test(){
    console.log('test')
  },
  changeAsset() {
    $(".bar").click(function(){
        $(".bar").removeClass("active");
        $(this).addClass("active");
    });
  }
  }
}

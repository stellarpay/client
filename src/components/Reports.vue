  <template>
  <div>
      <div class="content-title">Sales Reports</div>
      <div class="center-box">
          <div class="box">
              <div class="center-box-w">
                  <div class="center-box-w-l">
                      <div class="center-box-w-l-d">Total Amount of Sales<span class="center-box-w-l-d-a">${{ (reports.reports.sum * reports.prices.USD_XLM).toFixed(2) }}</span>
                      </div>
                  </div>
                  <div class="content-header">
                      <button class="button-w">Export</button><span class="current-price"><i class="fa fa-info" style="font-size: 21px;"></i></span></div>
              </div>
              <div class="history">
                  <table class="history-table table table-striped table-hover">
                      <tbody>
                          <tr v-for="item in reports.reports.list" :data-href="'/account/tx/'+item.transactionId">
                              <td width="70px">
                                  <div class="generated_icon" style="background:transparent"><img :src="item.merchantLogo" style="border-style: none; width: 150%;margin-left:10px"></div>
                              </td>
                              <td>
                                  <span>Payment received for {{ item.merchantLabel }}</span>
                                  <span class="label label-success"> Confirmed </span>
                              </td>
                              <td align="right">
                                  <span class="text-success" style="font-weight: initial;" v-if="item.orderCurrency.currency == 'native'">+ {{ item.orderAmount }} XLM</span>
                                  <span class="text-success" style="font-weight: initial;" v-if="item.orderCurrency.currency != 'native'">+ {{ item.orderAmount }} {{ item.orderCurrency.currency }}</span>
                                  <span> {{ reports.horizonTime(item.createdAt) }} </span></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  mounted(){
    this.fetchReports()
  },
  computed: {
    reports()
    {
        return this.$root;
    }
  },
  methods : {
    fetchReports(){
      axios.get('https://api.stellarpay.io/api/'+'reports/'+this.$root.account.id).then(response => {
          this.$root.reports.list = response.data.result
          this.$root.reports.sum = response.data.sum.amount
          })
    },
  }
}
</script>

<style>
</style>

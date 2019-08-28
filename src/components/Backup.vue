<template>
  <div class="container">
    <section class="modal-content">
      <div class="section-title">
        <div class="section-title__content">
          <span class="section-top-title">Mnemonic and Secret Key Backup</span>
          We strongly recommend to you take a backup of your mnemonic. If you lost your ID and password, there is no another way to access your funds without mnemonic and secret key backups.
        </div>
      </div>
      <span>12 words mnemonic backup</span>
      <br>
      <div class="modal-input donthide">
        <input id="section-input" type="text" v-model="backup.account.mnemonic" style="font-size:13.3px" disabled>
      </div>
      <br>
      <span>Secret key backup</span>
      <br>
      <div class="modal-input donthide">
        <input id="section-input" type="text" v-model="backup.account.private" disabled>
      </div>
      <br>
      <router-link to="/dashboard" style="text-decoration:none"><button class="button large primary inline">Go to dashboard</button></router-link>
      </section>
  </div>
</template>

<script>
export default {
  computed: {
    backup()
    {
        return this.$root;
    }
  },
}
</script>

<style>
</style>

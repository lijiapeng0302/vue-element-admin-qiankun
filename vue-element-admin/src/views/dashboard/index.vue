<template>
  <div class="dashboard-container">
    <div id="vueContainer"></div><!--新增部分，用于承载子应用-->

    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { start } from "qiankun";

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted(){
    console.log('大苏打实打实大2',window.qiankunStarted)
    if (!window.qiankunStarted) {
      console.log('大苏打实打实大',window.qiankunStarted)
            window.qiankunStarted = true
            start()
          }  
  }
}
</script>

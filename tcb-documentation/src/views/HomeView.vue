<template>
  <div class="home">
    <HelloWorld msg="这里是documentatuion子应用"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
<style scoped>
  .home{
    padding: 20px;
  }
</style>

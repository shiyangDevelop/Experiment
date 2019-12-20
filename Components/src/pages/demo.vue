<template>
  <div class="demo">
    <!-- <ProgressComponent></ProgressComponent> -->
    <!-- <temp></temp> -->
    <StructureOrgTreeComponent v-if="data.length" :data='data'/>
  </div>
</template>
<script>
// import data_ from '../components/data'
import StructureOrgTreeComponent from '../components/StructureOrgTreeComponent'
export default {
  components: {
    ProgressComponent: () => import('../components/ProgressComponent'),
    StructureOrgTreeComponent
  },
  data () {
    return {
      data: []
    }
  },
  mounted () {
    setTimeout(() => {
      import('../components/data').then((res) => {
        this.data = res.default
        console.log(this.data)
      })
    }, 1000)
    
  }
}
</script>
<style scoped>
.demo {
  display: flex;
  overflow: auto;
}
</style>

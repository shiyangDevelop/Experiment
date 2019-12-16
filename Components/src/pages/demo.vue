<template>
  <div class="demo">
    <!-- <ProgressComponent></ProgressComponent> -->
    <!-- <temp></temp> -->
    <StructureOrgTreeComponent/>
  </div>
</template>
<script>
import StructureOrgTreeComponent from '../components/StructureOrgTreeComponent'
export default {
  components: {
    ProgressComponent: () => import('../components/ProgressComponent'),
    StructureOrgTreeComponent
  }
}
</script>
<style scoped>
/* .demo {
  width: 300px;
  height: 300px;
} */
</style>

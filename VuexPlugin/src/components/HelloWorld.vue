<template>
  <div class="demo">
    <input type="text" :value="name" @input="changeName($event)">
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { depClone } from '../tools/tools'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState({
      name: state => state.person.name,
      rule: state => state.person.children[1].rule
    })
  },
  watch: {
    // 监听vuex中state赋值
    '$store.state' (newval, oldval) {
      this.init()
    }
  },
  methods: {
    init () {
      console.log(this.name)
      console.log(this.rule)
    },
    changeName (event) {
      // 提交状态修改
      this.$store.commit('changeName', event.target.value)
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

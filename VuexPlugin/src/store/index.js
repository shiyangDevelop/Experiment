import state from './state'
import mutations from './mutations'
import { syncToSession } from './plugins'
export default {
  state,
  mutations,
  plugins: [ syncToSession ]
}

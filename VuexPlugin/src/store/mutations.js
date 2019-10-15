export default {
  changeName: (state, name) => {
    state.person.name = name
  },
  initData: (state, data) => {
    state = data
  }
}

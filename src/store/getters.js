const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  phone: state => state.user.phone,
  realname: state => state.user.realname,
  gender: state => state.user.gender,
  level: state => state.user.level,
  language: state => state.user.language,
  permission_routes: state => state.permission.routes
}
export default getters

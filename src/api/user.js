import request from '@/utils/request'

export function getAllUsers(query) {
  return request({
    url: '/user/getAllUsers',
    method: 'get',
    params: { ...query }
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: { ...data }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(username) {
  return request({
    url: `/user/del?username=${username}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'put',
    params: { ...data }
  })
}

export function editUser(data) {
  return request({
    url: '/user/center',
    method: 'put',
    params: { ...data }
  })
}

export function updatePass(data) {
  return request({
    url: 'user/updatePass',
    method: 'put',
    params: { ...data }
  })
}

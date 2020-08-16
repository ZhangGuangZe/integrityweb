import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/complaint/getAllList',
    method: 'get',
    params: { ...query }
  })
}

export function getUserComplaints(username) {
  return request({
    url: `/complaint/getUserComplaints?username=${username}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/complaint/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/complaint/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/complaint/update',
    method: 'put',
    params: { ...data }
  })
}


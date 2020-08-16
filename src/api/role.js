import request from '@/utils/request'

export function getAllRoles(query) {
  return request({
    url: '/role/getAllRoles',
    method: 'get',
    params: { ...query }
  })
}

export function add(data) {
  return request({
    url: '/role/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/role/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/role/update',
    method: 'put',
    params: { ...data }
  })
}


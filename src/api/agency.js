import request from '@/utils/request'

export function getAllAgency(query) {
  return request({
    url: '/agency/getAllAgency',
    method: 'get',
    params: { ...query }
  })
}

export function add(data) {
  return request({
    url: '/agency/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/agency/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/agency/update',
    method: 'put',
    params: { ...data }
  })
}


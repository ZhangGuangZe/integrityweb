import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/evaluation/getAllList',
    method: 'get',
    params: { ...query }
  })
}

export function add(data) {
  return request({
    url: '/evaluation/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/evaluation/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/evaluation/update',
    method: 'put',
    params: { ...data }
  })
}


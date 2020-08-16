import request from '@/utils/request'

export function getAllBlock(query) {
  return request({
    url: '/block/getAllBlock',
    method: 'get',
    params: { ...query }
  })
}

export function add(data) {
  return request({
    url: '/block/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/block/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/block/update',
    method: 'put',
    params: { ...data }
  })
}


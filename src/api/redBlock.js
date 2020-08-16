import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/redBlock/getAllList',
    method: 'get',
    params: { ...query }
  })
}

export function getTimeList(time) {
  return request({
    url: `/redBlock/getTimeList?time=${time}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/redBlock/add',
    method: 'post',
    params: { ...data }
  })
}

export function del(id) {
  return request({
    url: `/redBlock/del?id=${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    url: '/redBlock/update',
    method: 'put',
    params: { ...data }
  })
}


import request from '@/utils/request'

//获取精品歌单
export function getHighQualityList(params) {
  return request({
    url: 'https://v1.itooi.cn/netease/songList/highQuality',
    method: 'get',
    params
  })
}

//歌单分类
export function getHotSongList(params) {
  return request({
    url: 'https://v1.itooi.cn/netease/songList/hot',
    method: 'get',
    params
  })
}

//歌单分类
export function getSongListDetail(params) {
  return request({
    url: 'https://v1.itooi.cn/netease/songList',
    method: 'get',
    params
  })
}

//音乐播放地址
export function getSongSrc(params) {
  return request({
    url: 'https://v1.itooi.cn/netease/url',
    method: 'get',
    params
  })
}

//音乐详情
export function getSongDetail(params) {
  return request({
    url: 'https://v1.itooi.cn/netease/song',
    method: 'get',
    params
  })
}
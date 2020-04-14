import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import role from './role'
import problems from './problems'
import tags from './tags'
import mall from './mall'
import order from './order'
import judge from './judge'
import user from './user'
import title from './title'
import contest from './contest'
import rank from './rank'
import discuss from './discuss'
import challenge from './challenge'
import article from './article'
import search from './remote-search'

const mocks = [
  ...role,
  ...problems,
  ...tags,
  ...mall,
  ...order,
  ...judge,
  ...user,
  ...title,
  ...contest,
  ...rank,
  ...discuss,
  ...challenge,
  ...article,
  ...search
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

export default mocks

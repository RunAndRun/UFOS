module.exports = {
  mongodb: 'mongodb://127.0.0.1:27017/ufo',
  redis: {
    get host () {
      return '127.0.0.1'
    },
    get port () {
      return 6379
    }
  },
  smtp: {
    get host () {
      return 'smtp.qq.com'
    },
    get user () {
      return '840430624@qq.com'
    },
    get pass () {
      return 'yvoffxbphgqbbbib'
    },
    get code () {
      return () => {
        return Math.random().toString(16).substr(2, 6).toUpperCase()
      }
    },
    get expired () {
      return () => {
        return Date.now() + 60 * 1000
      }
    }
  }
}

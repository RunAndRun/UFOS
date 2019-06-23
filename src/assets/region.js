const data = require('./region.json')

let regionObj = {}

data.forEach(item => {
  if (!regionObj[item.p_id]) {
    regionObj[item.p_id] = []
  }
  regionObj[item.p_id].push(item)
})

export default regionObj

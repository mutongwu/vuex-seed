const constantsContext = require.context('./', false, /\.js$/)
const excludeReg = /index\.js/
let routesConfig = {}

constantsContext.keys().forEach((key) => {
  let val = constantsContext(key)['default']
  if (excludeReg.test(key)) {
    // do nothing
  } else {
    routesConfig[val.path] = val
  }
  return routesConfig
})

export default routesConfig

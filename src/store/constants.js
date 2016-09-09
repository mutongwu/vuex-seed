const constantsContext = require.context('./types/', false, /\.js$/)

export const types = constantsContext.keys().reduce((constants, key) => {
  return Object.assign(constants, constantsContext(key))
}, {})


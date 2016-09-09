const modulesContext = require.context('./modules/', false, /\.js$/)

export default modulesContext.keys().reduce((modules, key) => {
  let mod = modulesContext(key)['default']
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = mod // modulesContext(key)
  return modules
}, {})

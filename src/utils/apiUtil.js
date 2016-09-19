import reqwest from 'reqwest'
export default function (config) {
  return new Promise(function (resolve, reject) {
    reqwest(config).then((res) => {
      if (res.code === 200) {
        resolve(res.data)
      } else {
        reject(res)
      }
    })
  })
}

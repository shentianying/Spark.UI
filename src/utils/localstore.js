export function LSGet(key) {
  return localStorage.getItem(key)
}
// 获取 数组或者对象
export function LSGetObject(key) {
  const result = LSGet(key)
  return result ? JSON.parse(result) : null
}
export function LSSet(key, value) {
  return localStorage.setItem(key, value)
}
// 设置对象或者数组
export function LSSetObject(key, value) {
  // if (typeof value === 'object') {
  LSSet(key, JSON.stringify(value))
  // }
}
export function LSRemove(key) {
  return localStorage.removeItem(key)
}
export function LSClear() {
  return localStorage.clear()
}

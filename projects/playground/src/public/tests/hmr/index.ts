import { obj } from './module1'

obj.incJ()

console.log('loading index')
console.log('i', obj.i, 'j', obj.j, 'k', obj.k)

import.meta.hot?.accept()

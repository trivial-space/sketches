import { fn1 } from './module1'
import { fn2 } from './module2'

fn1()
fn2()
console.log('index', import.meta.url)

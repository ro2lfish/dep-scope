import { funB1 } from '../b'
import * as C from '../c'
import { funD1 as renameFunD1 } from '../d'
import { funM1, funM2 } from '../b1/m'

export function funJ1() {
  funB1()
  import('../e')
  C.funC1()
  renameFunD1()
}
export function funJ2() {
  funM1()
}

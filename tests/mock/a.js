import { funB1 } from './b'
import * as C from './c'

import { funD1 as renameFunD1 } from './d'

export function funA1() {
  funB1()
  import('./e')
}
export function funA2() {}

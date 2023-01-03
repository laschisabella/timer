// Sobrescrever tipagem de uma biblioteca existente (no caso, styled-componentes)

import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme

// ao importar (linha 3), apenas sobrescrevemos o que queremos com o código abaixo, mantendo o resto como está.

declare module 'styled-components' {
  // adiciona o ThemeType criado à tipagem do styled components
  export interface DefaultTheme extends ThemeType {}
}

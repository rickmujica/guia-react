import { useSyncExternalStore } from 'react'
import { IS_PRINT } from './print'

const query = window.matchMedia('(prefers-color-scheme: dark)')

function subscribe(onChange: () => void) {
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// useSyncExternalStore en la vida real: el "store" externo es una media query.
export function useColorScheme(): 'light' | 'dark' {
  const isDark = useSyncExternalStore(subscribe, () => query.matches)
  if (IS_PRINT) return 'light'
  return isDark ? 'dark' : 'light'
}

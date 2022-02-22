// Main
import { computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
// Types
import type { ScopeRecord } from 'models/single-scope-composable'

export const useSingleScopeComposableStore = defineStore('SingleScopeComposable', () => {
  // Private

  const _scopes: Record<string, ScopeRecord<unknown>> = {}

  // Getters

  const scopes = computed(() => _scopes)

  // Actions

  function hasScope (name: string) {
    return Object.keys(_scopes).includes(name)
  }

  function setScope<T> (name: string, scope: T) {
    hasScope(name) && (() => { throw new Error(`Scope ${name} already exists`) })()

    const record: ScopeRecord<T> = {
      scope,
      useCount: 0
    }

    _scopes[name] = record
  }

  function increaseScopeUseCount (name: string) {
    !hasScope(name) && (() => { throw new Error(`Scope ${name} unavailable`) })()
    _scopes[name].useCount++
  }

  function decreaseScopeUseCount (name: string) {
    !hasScope(name) && (() => { throw new Error(`Scope ${name} unavailable`) })()
    _scopes[name].useCount--
    _scopes[name].useCount === 0 && delete _scopes[name]
  }

  function retrieveScope<T> (name: string) {
    !hasScope(name) && (() => { throw new Error(`Scope ${name} unavailable`) })()
    return (_scopes[name] as ScopeRecord<T>).scope
  }

  return {
    scopes,
    hasScope,
    setScope,
    increaseScopeUseCount,
    decreaseScopeUseCount,
    retrieveScope
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSingleScopeComposableStore, import.meta.hot))
}

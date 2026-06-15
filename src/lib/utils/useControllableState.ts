import { useCallback, useState } from 'react'

/**
 * Manages state that may be either controlled (a `value` prop is supplied) or
 * uncontrolled (the component owns the state, seeded by `defaultValue`).
 *
 * Mirrors the controlled/uncontrolled contract used across the design system:
 * when `value` is defined the component is controlled and the internal state is
 * ignored; otherwise the hook owns the state and notifies `onChange` on every
 * commit. The setter accepts either a next value or an updater function.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T | (() => T)
  onChange?: (value: T) => void
}): [T, (next: T | ((prev: T) => T)) => void] {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<T>(defaultValue)

  const current = isControlled ? (value as T) : internal

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(current) : next
      if (!isControlled) setInternal(resolved)
      if (!Object.is(resolved, current)) onChange?.(resolved)
    },
    [current, isControlled, onChange]
  )

  return [current, setValue]
}

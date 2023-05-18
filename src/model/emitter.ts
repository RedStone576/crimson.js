export interface TypedEmitter<E extends Record<string, any>> 
{
  on   <T extends keyof E> (event: T, listener: (data: E[T]) => void): this
  once <T extends keyof E> (event: T, listener: (data: E[T]) => void): this
  off  <T extends keyof E> (event: T, listener: (data: E[T]) => void): this
  emit <T extends keyof E> (event: T, args: E[T]): boolean
}

interface EmitterOverload<E extends Record<string, any>>
{
  // fallback to unknown
  on   <T extends Exclude<string, keyof E>>(event: T, listener: (data: unknown) => void): this
  once <T extends Exclude<string, keyof E>>(event: T, listener: (data: unknown) => void): this
  off  <T extends Exclude<string, keyof E>>(event: T, listener: (data: unknown) => void): this
  emit <T extends Exclude<string, keyof E>>(event: T, data: any): boolean
}

export type fallbackEmitter<E extends Record<string, any>> = TypedEmitter<E> & EmitterOverload<E>

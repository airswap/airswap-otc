declare module 'console' {
  const _console: typeof import('console')
  export default _console
}

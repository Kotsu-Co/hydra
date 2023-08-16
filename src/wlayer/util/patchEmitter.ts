export function patchEmitter(emitter: EventEmitter, fn: Function) {
  const oldEmit = emitter.emit;
  emitter.emit = function (event: string, ...args: any[]) {
    fn(event, ...args);
    return oldEmit.apply(emitter, arguments);
  };
}
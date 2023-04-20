import { Result, isErr } from "solzu";

export function unwrap<V, E>(result: Result<V, E>): V {;
  if (isErr(result)) throw Error(typeof result.error === 'string' ? result.error : String(result.error));
  return result.value;
}
// Lee variables de entorno tanto en Netlify Functions (Node) como en Edge Functions (Deno).
export function env(nombre) {
  const deNetlify = globalThis.Netlify?.env?.get?.(nombre);
  if (deNetlify !== undefined && deNetlify !== null && deNetlify !== "") return deNetlify;
  const deProceso = globalThis.process?.env?.[nombre];
  return deProceso === "" ? undefined : deProceso;
}

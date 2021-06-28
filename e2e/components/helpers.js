export function delay(p, ms) {
  return new Promise(ok => setTimeout(ok, ms)).then(() => p);
}

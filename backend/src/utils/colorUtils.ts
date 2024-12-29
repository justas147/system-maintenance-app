export function generateLightHexColor() {
  const base = 200;
  const range = 55;

  const r = Math.floor(Math.random() * range + base);
  const g = Math.floor(Math.random() * range + base);
  const b = Math.floor(Math.random() * range + base);

  // Convert to hex and pad if necessary
  const toHex = (value) => value.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
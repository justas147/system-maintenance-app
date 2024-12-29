export function handleError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}
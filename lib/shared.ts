/* eslint-disable @typescript-eslint/no-explicit-any */
export function getRandomCode(length = 5) {
  const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

export function generateSixDigitCode() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function dateTimePipe(d:any) {
  const date=d?new Date(d):null;
    return date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : '';
}
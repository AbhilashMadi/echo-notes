export function generateOTP(): `${number}` {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function generateUUID() {
  return crypto.randomUUID();
}

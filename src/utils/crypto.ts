import crypto from "node:crypto";

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

interface VerifyHashPasswordProps {
  password: string;
  salt: string;
  hash: string;
}

function verifyHashPassword({ password, hash, salt }: VerifyHashPasswordProps) {
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString("hex");
  return hashedPassword === hash;
}

export { verifyHashPassword, hashPassword };

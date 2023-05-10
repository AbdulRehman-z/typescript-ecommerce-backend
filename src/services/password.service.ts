import crypto from "crypto";

export class Password {
  /**
   *This function takes a plain text password and creates a salt and hash out of it.  Instead of storing
   *the plaintext password in the database, the salt and hash are stored for security
   */

  static genPasswordHash(password: string) {
    const salt = crypto.randomBytes(32).toString("hex");

    const genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    return `${genHash}.${salt}`;
  }

  /**
   * This function uses the crypto library to decrypt the hash using the salt and then compares
   * the decrypted hash/salt with the password that the user provided at login
   */

  static validatePassowrd(storedPassword: string, password: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    return hashVerify === hashedPassword;
  }
}

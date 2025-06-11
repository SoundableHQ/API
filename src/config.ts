const bool = (envValue: string | undefined, defaultValue: boolean): boolean => {
  envValue = envValue?.toLowerCase();

  if (envValue) {
    if (envValue === "true") return true;
    else if (envValue === "false") return false;
  }

  return defaultValue;
};

export default {
  port: Bun.env.PORT || 10500,
  hostname: Bun.env.HOST || "127.0.0.1",
  databasePath: Bun.env.DATABASE_PATH || "soundable.db",

  /**
   * Whether we should allow anyone to
   * create an account within the API.
   */
  allowSignUp: bool(Bun.env.ALLOW_SIGNUP, true),

  /**
   * Secret key that will be used for encryption and hashes.
   * Leaving this to default might lead to a likely vulnerable instance.
   */
  sessionSecretKey: Bun.env.SESSION_SECRET_KEY || "ch4nge-y0ur-k3y!",
};

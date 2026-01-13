function makeFakeSession() {
  const future = Date.now() + 24 * 60 * 60 * 1000; // +1 day
  return {
    accessToken: "fake-token",
    refreshToken: "fake-refresh",
    tokenType: "Bearer",
    expiresAt: future,
  };
}

module.exports = { makeFakeSession };

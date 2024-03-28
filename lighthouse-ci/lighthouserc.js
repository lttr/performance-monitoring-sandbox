module.exports = {
  ci: {
    upload: {
      target: "lhci",
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      token: process.env.LHCI_BUILD_TOKEN,
    },
    server: {
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: "./db.sql",
      },
      deleteOldBuildsCron: {
        schedule: "0 * * * *",
        maxAgeInDays: 90,
      },
    },
  },
};

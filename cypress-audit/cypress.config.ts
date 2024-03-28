import { defineConfig } from "cypress";
import { lighthouse, prepareAudit } from "@cypress-audit/lighthouse";

export default defineConfig({
  // based on https://github.com/cmorten/cypress-web-vitals/blob/main/examples/13.x/cypress.config.js
  video: false,
  screenshotOnRunFailure: false,
  chromeWebSecurity: false,

  // based on https://mfrachet.github.io/cypress-audit/guides/lighthouse/installation.html#the-server-configuration
  e2e: {
    baseUrl: "https://lukastrumm.com",
    setupNodeEvents(on, _) {
      on("before:browser:launch", (_, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on("task", {
        lighthouse: lighthouse(),
      });
    },
  },
});

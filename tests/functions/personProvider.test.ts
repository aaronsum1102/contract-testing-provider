import dotenv from "dotenv";
dotenv.config();

import { createPerson } from "../../src/functions/personProvider";
import {
  MessageProviderPact,
  PactMessageProviderOptions,
} from "@pact-foundation/pact";

describe("Provider test", () => {
  const testTimeout = 20000;
  const baseOpts: Partial<PactMessageProviderOptions> = {
    logLevel: "info",
    provider: "person-provider",
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    publishVerificationResult: process.env.CI == "true",
    providerVersion: process.env.CI == "true" && process.env.CI_VERSION,
    providerVersionTags: process.env.GIT_BRANCH ? [process.env.GIT_BRANCH] : [],
  };

  // For builds triggered by a 'contract content changed' webhook,
  // just verify the changed pact. The URL will bave been passed in
  // from the webhook to the CI job.
  const pactChangedOpts: Partial<PactMessageProviderOptions> = {
    pactUrls: [process.env.PACT_URL],
  };

  // For 'normal' provider builds, fetch `master` pacts for this provider
  const fetchPactsDynamicallyOpts: Partial<PactMessageProviderOptions> = {
    consumerVersionSelectors: [{ tag: "master", latest: true }],
    enablePending: true,
    includeWipPactsSince: "2021-04-19",
  };

  const messageProviders: PactMessageProviderOptions["messageProviders"] = {
    "A request for person": () =>
      Promise.resolve(createPerson("test", "asd", 30)),
  };

  const option: PactMessageProviderOptions = {
    ...baseOpts,
    ...(process.env.PACT_URL ? pactChangedOpts : fetchPactsDynamicallyOpts),
    messageProviders,
  };

  it(
    "Sent a person",
    async () => {
      const messageProvider = new MessageProviderPact(option);
      await expect(messageProvider.verify()).resolves.not.toThrow();
    },
    testTimeout
  );
});

/// <reference types="@cypress-audit/lighthouse" />

// According to default Lighthouse config:
// https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;
const throttling = {
	mobileSlow4G: {
		cpuSlowdownMultiplier: 4,
		downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR, // = 1474.5600000000002
		requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR, // = 562.5
		rttMs: 150,
		throughputKbps: 1.6 * 1024, // = 1638.4
		uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR, // = 675
	},
};
const motoGMobileParams = {
	mobile: true,
	width: 412,
	height: 823,
	deviceScaleFactor: 1.75,
	disabled: false,
};

function toBytesPerSecond(kbps: number) {
	return Math.floor((kbps * 1024) / 8);
}

// https://mfrachet.github.io/cypress-audit/guides/lighthouse/good-to-know.html#lighthouse-scores-may-be-different-between-local-run-and-cypress-audit

const customThresholds = {
	performance: 75,
	accessibility: 75,
	"best-practices": 75,
	seo: 75,
};

const mobileConfig = {
	formFactor: "mobile",
	screenEmulation: motoGMobileParams,
	throttling: throttling.mobileSlow4G,
};

it("Audits with cypress-audit", () => {
	cy.visit("/");
	cy.lighthouse(customThresholds, mobileConfig);
});

const throttleNetwork = () => {
	cy.log("** Throttle network **")
		.then(() => {
			return Cypress.automation("remote:debugger:protocol", {
				command: "Network.enable",
			});
		})
		.then(() => {
			return Cypress.automation("remote:debugger:protocol", {
				command: "Emulation.setCPUThrottlingRate",
				params: {
					rate: throttling.mobileSlow4G.cpuSlowdownMultiplier,
				},
			});
		})
		.then(() => {
			return Cypress.automation("remote:debugger:protocol", {
				// Docs for Network.emulateNetworkConditions
				// https://chromedevtools.github.io/devtools-protocol/tot/Network/?ref=cypress-io.ghost.io#method-emulateNetworkConditions
				command: "Network.emulateNetworkConditions",
				params: {
					offline: false,
					latency: throttling.mobileSlow4G.requestLatencyMs,
					// https://github.com/GoogleChrome/lighthouse/blob/1d2a380d3c15e5848381fc1dd625837c5dc28ff6/core/lib/emulation.js#L121
					downloadThroughput: toBytesPerSecond(
						throttling.mobileSlow4G.downloadThroughputKbps,
					),
					uploadThroughput: toBytesPerSecond(
						throttling.mobileSlow4G.uploadThroughputKbps,
					),
				},
			});
		});
};

const vitalsThresholds = {
	good: {
		lcp: 2500,
		fid: 100,
		cls: 0.1,
		fcp: 1800,
		ttfb: 600,
		inp: 200,
	},
	needsImprovement: {
		lcp: 4000,
		fid: 300,
		cls: 0.25,
		fcp: 3000,
		ttfb: 1000, // not specified on web.dev
		inp: 500,
	},
};

describe("Audits with cypress-web-vitals", () => {
	beforeEach(() => {
		throttleNetwork();
		cy.viewport("samsung-s10");
	});

	it("should pass the audits for a page load", () => {
		cy.vitals({
			url: Cypress.config().baseUrl,
			thresholds: vitalsThresholds.needsImprovement,
		});
	});

	it("should pass the audits for a customer journey", () => {
		cy.startVitalsCapture({
			url: Cypress.config().baseUrl,
			thresholds: vitalsThresholds.needsImprovement,
		});

		cy.findByRole("link", { name: "About" }).realClick();

		cy.reportVitals();
	});
});

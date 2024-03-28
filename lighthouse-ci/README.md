# Synthetic performance check

A performance report produced by Google's Lighthouse tool.

Runnable in CI on every commit.

Intended to be run periodically against a locally started server or in CI.

## Before running

Set LHCI_TARGET_URL environment variable.

```
pnpm install
```

## How to run in CI

Set LHCI_SERVER_URL environment variable.

```
pnpm run lhci:run
```

## How to run with local Lighthouse server

_Local server is useful when you want to check a series of performance
improvements done locally._

Change LHCI_TARGET_URL environment variable to localhost.
Set LHCI_SERVER_URL environment variable to local LHCI server.

Set up a project in Lighthouse server.

```
pnpm run lhci:server
pnpm run lhci:wizard
```

Change LHCI_BUILD_TOKEN environment variable.

While the Lighthouse server is running, collect results and upload them to the server.

```
pnpm run lhci:run
```

Enjoy results after opening the Lighthouse server UI.

## Notes

### Running both mobile and desktop preset

There is no straightforward way to do it according to [this Github issue](https://github.com/GoogleChrome/lighthouse-ci/issues/138).

Workaround:

- run the `collect` step first for both presets
- use `additive=true` so that the reports are not deleted before the `collect`
  step
- use a differentiating query parameter for both presets to make 2 distinct URLs
- run the `upload` step after reports for both presets are collected

## Documentation

- https://github.com/GoogleChrome/lighthouse-ci

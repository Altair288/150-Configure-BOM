# Super BOM Configurator

Super BOM Configurator is an enterprise product-configuration frontend built with Next.js App Router, React, TypeScript and UI5 Web Components. The current release is a local mock-REST demo that keeps API, state, domain rules and UI boundaries ready for a future backend.

## Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to Dashboard.

Useful routes:

- `/dashboard` - workspace metrics and product portfolio
- `/products` - configurable product cards
- `/bom` - Super BOM overview
- `/bom/bom-vehicle-001` - tree, table and properties explorer
- `/configurator/vehicle-001` - three-column product configurator
- `/features` - feature and option catalog
- `/variants` - saved configuration variants
- `/rules` - compatibility and auto-inclusion rules
- `/api/health` - service health response

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

The E2E command starts the Next development server automatically. The first local E2E run may require `npx playwright install chromium`.

## Architecture

```text
App Router pages
  -> feature hooks / mock API
  -> Zustand stores and TanStack Query
  -> pure BOM and configuration engines
  -> UI5 Web Components React wrappers
```

- `types/` contains explicit domain contracts.
- `mocks/` contains the local product, BOM, feature and rule data.
- `features/` owns API boundaries, hooks and configuration logic.
- `stores/` keeps app, BOM and configurator state separate.
- `components/` contains reusable UI5-oriented surfaces.
- `tests/unit/` covers the pure configuration engine.
- `tests/e2e/` covers dashboard navigation, BOM inspection and configuration publishing.

## Version Baseline

- Node.js: `v24.5.0`
- Next.js: `16.3.4`
- React: `19.2.8`
- TypeScript: `6.0.3`
- UI5 Web Components: `2.26.0`
- `@ui5/webcomponents-react`: `2.26.0`
- TanStack Query: `5.102.8`
- Zustand: `5.0.15`
- Vitest: `5.0.0`
- Playwright: `1.62.1`

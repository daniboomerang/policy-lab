# Saifuro calls go through one typed client, answered by a mock transport

Every read and write the console needs from Saifuro is written as the **real call**: `GET /agents`, `GET /mandates`, `GET /decisions`, `GET /usage`, `POST /mandates`, `POST /mandates/{id}/revoke`, with Saifuro's paths, parameters and bodies, through one client in `src/saifuro/client.ts` (`openapi-fetch`, typed by the generated schema of ADR-0002). The client's transport is **`mockFetch`**, a router in `src/saifuro/mock/` that answers each path with sample data in the exact response shape. Nothing leaves the server. Pages are server components that call the client, so every screen is rendered on the server with its data (SSR). This amends [ADR-0001](0001-no-live-saifuro-calls-sample-data-labelled.md): still no call reaches Saifuro, but the code that would make one now exists and is exercised.

## Considered options

- **Load the sample file directly in each page.** Rejected: the console's data access would look nothing like a Saifuro integration, and going live would mean rewriting every page's reads.
- **A mock server that answers the OpenAPI** (a separate process, or our own route handlers called over HTTP). Rejected: a second process to run, and a server component fetching its own app's routes needs an absolute URL at build time and adds a network hop for nothing.
- **Mock Service Worker on the server.** Rejected: it patches the global `fetch`, so a stray real call could be intercepted in one environment and sent in another.
- **One typed client with an injected mock transport.** Chosen: the compiler checks every path, parameter and body against Saifuro's schema; the transport is a plain function passed to the client, never a global patch; and going live is replacing that one argument.

## Consequences

- `src/saifuro/client.ts` is the only file that names Saifuro's base URL, and it passes `mockFetch`, never the global `fetch`. A test asserts that, and that `mockFetch` answers an unknown path with Saifuro's 404 error shape rather than passing it on. Going live is a deliberate code change reviewed in a PR, never an environment variable, so a stray setting can't make the demo call Saifuro. No Saifuro key exists (ADR-0001).
- **SSR:** routes are server components that read through the client, then map responses to view models with the engine (ADR-0004). The draft editor and the simulation stay client components: the server sends the 30 days of decisions with the page, and the engine replays them in the browser on every change.
- **Writes are per visitor.** A publish runs as a server action through the same client. `mockFetch` applies it to the visitor's demo state: the seed data plus the visitor's own publishes, kept in an httpOnly cookie, so each viewer sees their own history grow and nobody sees anyone else's. The cookie holds only the publish operations (policy, version, terms, note), capped at the last 10; "Reset demo" clears it.
- The JSON view shows the exact request bodies the client sent to `mockFetch`, labelled "Not sent: this demo is not connected to Saifuro".
- The mock answers only the calls the console makes; each handler's response is typed by the schema, so a handler that drifts from Saifuro's shape fails the type check.

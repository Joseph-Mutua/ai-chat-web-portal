# AI Chat Web Portal

The **AI Chat Web Portal** should be created in a new Next.js project using TypeScript. The portal will allow users to
log in and interact with the AI chat service via a RESTful API.

The OpenAPI specification of the API is in `api.json`. You may use the API at api.iamwarpspeed.com, logging
in with the account you created on the warpSpeed app. If your work requires additions to the API, these should
be mocked in your implementation so they can be implemented later, but that will most likely not be the case.

The code in this repo is an excerpt from the mobile app codebase, which you can refer to for current styles,
color schemes, and UI components. If it's feasible to reuse any UI components via `react-native-web` that would
be a bonus, but you are free to style it as you see fit. If new components are created and for styling outside
of `react-native-web`, please use Tailwind CSS.

Prefer modern Next.js features such as the App Router and Server Components where appropriate, rather than client -side
rendering and libraries such as React Query (although they can be used if justified). Avoid Redux.

Use `pnpm` for package management.

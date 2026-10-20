# React + Vite

## Gallery update

Recognition automatically advances every 3 seconds and loops. It remains in
normal document flow: scroll past whenever you want. Hovering or focusing its
controls does not stop autoplay. Autoplay stops offscreen, in a hidden tab, or for
reduced-motion preferences. The counters and pause/resume buttons are removed
from both galleries. The Thought Leadership counter/pagination/playback strip
is also removed; its existing 3-second rotation continues.

Qualification restores the original stacked deck, including alternating image
positions. It does NOT autoplay. Once the deck is near the top of the viewport,
one mouse-wheel or trackpad gesture starts a complete 2-second transition that
drops the whole front card below the viewport,
raises the next card, and puts the outgoing card behind the deck. A gesture cannot
leave a card halfway down. Trackpad inertia cannot advance several cards. Scroll
up to reverse; at either end, another gesture scrolls the page normally. Touch
swipes and previous/next controls also work. Reduced motion switches cards directly.

The full-section golden outline remains removed. Keyboard focus stays visible on
the controls. No new dependencies or environment variables are required.

Run `npm ci`, `npm test`, and `npm run build`. Browser frame-rate and native input
behavior still need checking on target devices before deployment.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Contact email setup

The contact form posts to the Vercel serverless function in `api/contact.js`, which sends through Resend. Copy `.env.example` to `.env.local` and set:

- `RESEND_API_KEY`: the Resend API key.
- `CONTACT_RECEIVING_EMAIL`: the inbox that should receive submissions.
- `RESEND_FROM_EMAIL`: a sender address accepted by Resend. Use `Website <onboarding@resend.dev>` for initial testing, or a sender on a domain verified in Resend for production.

For local end-to-end testing, install or run the Vercel CLI and use `vercel dev`; this serves the Vite app and `/api/contact` together. Open the local URL, submit the form, and confirm the message arrives at `CONTACT_RECEIVING_EMAIL`. The visitor's email is set as Reply-To.

For deployment, set the same variables in the hosting platform's environment settings. Never commit `.env.local` or expose `RESEND_API_KEY` in frontend code.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

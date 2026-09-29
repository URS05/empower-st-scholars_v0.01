# Empower ST Scholars

Build a multi-page Next.js 14 app with Tailwind and shadcn/ui for an Indian government scholarship portal for Scheduled Tribe students.

Pages needed:

1. Login page - two role buttons: "Apply as Student" and "Login as Officer". No real auth, just routes to the right dashboard.

2. Student registration + multi-step application form (4 steps: personal details, academic details, document upload with drag-drop, review and submit)

3. Application status tracker - shows current stage with a stepper (Submitted, Under Scrutiny, Selected, Rejected), any deficiency notices with a resubmit button

4. Scheme selection page - two cards: NFST (research in India) and NOS (masters/PhD abroad)

Design: clean government portal feel, blue and white, Hindi-friendly font size, mobile responsive. Use mock data everywhere. No backend calls.

Avoid using weird purple gradients. Don't use any emojis. I don't want any AI slop
And avoid using grounded edges because it gives off a lot of AI slop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dcdb3ab4-6901-46e1-8bfb-2d1aa74e737b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

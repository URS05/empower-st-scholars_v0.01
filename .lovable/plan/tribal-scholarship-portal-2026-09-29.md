# Tribal Scholarship Portal

## What I’ll build
- A formal blue-and-white government portal with a bilingual-friendly type scale, square-edged controls, and responsive navigation.
- A role-selection login page linking students and officers to their respective mock dashboards.
- Separate pages for scheme selection, a four-step student application, and application status.
- Mock interactions for form navigation, drag-and-drop document selection, review, submission confirmation, and deficiency resubmission.

## Pages
- `/` — role selection and portal notices
- `/student` — student dashboard with application summary and quick links
- `/officer` — officer dashboard with mock scrutiny queue
- `/schemes` — NFST and NOS comparison
- `/apply` — four-step registration and application flow
- `/status` — stage tracker and deficiency notice

## Technical details
- Use the project’s TanStack React routing while matching the requested multi-page experience; this workspace does not support Next.js.
- Use semantic Tailwind design tokens and reusable shadcn-style controls.
- Keep all information local and mocked, with no authentication or backend calls.
- Add unique metadata for every page and verify desktop and mobile layouts.

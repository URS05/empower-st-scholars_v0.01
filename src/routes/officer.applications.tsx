import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/officer/applications")({ component: () => <Outlet /> });

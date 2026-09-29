import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

const links = [
  { to: "/student", label: "Dashboard" },
  { to: "/schemes", label: "Schemes" },
  { to: "/apply", label: "Apply" },
  { to: "/status", label: "Application Status" },
] as const;

export function PortalShell({ children, officer = false }: { children: ReactNode; officer?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { language, setLanguage, text } = useLanguage();
  const officerLinks = [
    { to: "/officer" as const, label: text("Dashboard", "डैशबोर्ड") },
    { to: "/officer/applications" as const, label: text("Applications", "आवेदन") },
    { to: "/officer/schemes" as const, label: text("Scheme Config", "योजना विन्यास") },
  ];
  const activeLinks = officer ? officerLinks : links.map((link) => ({ ...link, label: text(link.label, link.label === "Dashboard" ? "डैशबोर्ड" : link.label === "Schemes" ? "योजनाएं" : link.label === "Apply" ? "आवेदन करें" : "आवेदन स्थिति") }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-gov-blue bg-gov-blue text-primary-foreground">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <span>{text("Government of India", "भारत सरकार")}</span>
          <div className="flex items-center gap-3"><span className="hidden sm:inline">{text("Ministry of Tribal Affairs", "जनजातीय कार्य मंत्रालय")}</span><div className="relative grid grid-cols-2 border border-primary-foreground/60 bg-gov-navy p-0.5" aria-label="Language selector"><span className={`absolute inset-y-0.5 w-[calc(50%-2px)] bg-card transition-transform duration-200 ${language === "hi" ? "translate-x-full" : "translate-x-0"}`}/><button type="button" onClick={() => setLanguage("en")} className={`relative z-10 px-2 py-1 text-[11px] font-semibold ${language === "en" ? "text-primary" : "text-primary-foreground"}`} aria-pressed={language === "en"}>EN</button><button type="button" onClick={() => setLanguage("hi")} className={`relative z-10 px-2 py-1 text-[11px] font-semibold ${language === "hi" ? "text-primary" : "text-primary-foreground"}`} aria-pressed={language === "hi"}>हिंदी</button></div></div>
        </div>
      </div>
      <header className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Scholarship Portal home">
            <div className="grid h-12 w-12 shrink-0 place-items-center border-2 border-primary text-xs font-bold text-primary">भारत</div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-primary sm:text-xl">{text("National Tribal Scholarship Portal", "राष्ट्रीय जनजातीय छात्रवृत्ति पोर्टल")}</p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">राष्ट्रीय जनजातीय छात्रवृत्ति पोर्टल</p>
            </div>
          </Link>
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X /> : <Menu />}
          </Button>
          <nav className={`${open ? "flex" : "hidden"} col-span-2 flex-col gap-1 border-t border-border pt-3 lg:col-span-1 lg:flex lg:flex-row lg:border-0 lg:pt-0`}>
            {activeLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className={`px-3 py-2 text-sm font-medium transition-colors ${pathname === link.to ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/" className="px-3 py-2 text-sm font-medium text-destructive hover:bg-muted">{text("Logout", "लॉग आउट")}</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-gov-navy text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-3 lg:px-8">
          <div><p className="font-semibold">{text("National Tribal Scholarship Portal", "राष्ट्रीय जनजातीय छात्रवृत्ति पोर्टल")}</p><p className="mt-2 text-primary-foreground/75">{text("Ministry of Tribal Affairs, Government of India", "जनजातीय कार्य मंत्रालय, भारत सरकार")}</p></div>
          <div><p className="font-semibold">{text("Helpdesk", "सहायता केंद्र")}</p><p className="mt-2 text-primary-foreground/75">1800-11-2345 · support@tribalscholarships.gov.in</p></div>
          <div><p className="font-semibold">{text("Portal information", "पोर्टल जानकारी")}</p><p className="mt-2 text-primary-foreground/75">{text("Content is demonstrative. Last updated: 29 September 2026", "सामग्री प्रदर्शन के लिए है। अंतिम अपडेट: 29 सितंबर 2026")}</p></div>
        </div>
      </footer>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="border-b border-border bg-secondary"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}<h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p></div></div>;
}

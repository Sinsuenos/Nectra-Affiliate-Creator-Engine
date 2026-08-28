"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" } }) };

const sections = [
  { heading: "Information We Collect", body: `Nectar Engine does not require user accounts. We may receive an email address when you purchase a product or contact support. We also receive limited technical and analytics information needed to operate and improve the website.` },
  { heading: "How We Use Your Information", body: `Email addresses are used for order delivery and support. Technical and analytics information is used to operate, secure, measure, and improve the website and its tools. We do not sell personal information.` },
  { heading: "Generator and Scanner Inputs", body: `Offer text and promotional copy submitted to the Generator or Compliance Scanner are transmitted over HTTPS and processed for the requested operation. API inputs are not intentionally persisted in our application database after the request is completed. Third-party model providers may process inputs under their own terms and retention policies.` },
  { heading: "Pinterest API Data", body: `If you authorize a Pinterest connection, Nectar Engine may access the Pinterest account, Pins, and Boards covered by the permissions you grant so the application can provide publishing and campaign-management functionality. Pinterest data is not sold or used for unrelated purposes. Access can be revoked through your Pinterest account settings. Pinterest also has its own privacy policy and platform terms.` },
  { heading: "Third-Party Services", body: `The site uses hosting, analytics, payment, and model-processing services, which may include Vercel, Google Analytics, OpenRouter, Google Gemini, and Gumroad depending on the feature you use. Those providers operate under their own privacy policies and terms.` },
  { heading: "Cookies and Local Storage", body: `The site may use cookies or local storage for functionality, analytics, preferences, and session state. Browser storage may also be used for free-use counters or other local product state.` },
  { heading: "Commercial Content", body: `Our pages may contain product links, affiliate links, or other commercial links. We aim to describe products and destinations accurately and transparently. Commercial relationships do not change our commitment to honest descriptions.` },
  { heading: "Data Retention", body: `We retain information only as reasonably necessary for the purpose for which it was provided, including order fulfillment, support, security, analytics, and legally required records. API inputs are not intentionally retained in our application database after request processing.` },
  { heading: "Your Rights", body: `Depending on your jurisdiction, you may have rights to access, correct, or request deletion of personal information we hold. Contact us and we will handle reasonable requests according to applicable law.` },
  { heading: "Contact", body: `For privacy questions or requests, email sinaloainspireddreams@gmail.com.` },
];

export default function PrivacyPage() {
  return <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24"><motion.p className="mb-4 font-mono text-base uppercase tracking-widest text-electric" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Legal</motion.p><motion.h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>Privacy Policy</motion.h1><motion.p className="mb-8 text-lg text-muted-foreground">Last updated: August 2026</motion.p><Separator className="mb-10 bg-border/60" /><div className="space-y-10">{sections.map((section, i) => <motion.div key={section.heading} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}><h2 className="mb-3 text-2xl font-bold tracking-tight">{section.heading}</h2><p className="text-lg leading-relaxed text-muted-foreground">{section.body}</p></motion.div>)}</div></section>;
}

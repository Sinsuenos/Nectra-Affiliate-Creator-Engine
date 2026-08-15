"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  SECTIONS                                                           */
/* ------------------------------------------------------------------ */
const sections = [
  {
    heading: "All Sales Final",
    body: `Due to the instant digital delivery of Nectar Engine, all purchases are final. Once access is granted, the full Product is immediately available and cannot be returned. This policy applies to all purchase methods and promotional pricing.`,
  },
  {
    heading: "Technical Issues",
    body: `If you experience a technical issue that prevents you from accessing or using the Product, contact our support team within 48 hours of purchase. Include a description of the issue, the device and browser you are using, and any relevant screenshots. We will investigate and, if the issue is confirmed and cannot be resolved, may issue a replacement access or, at our sole discretion, a refund.`,
  },
  {
    heading: "What Is Not Covered",
    body: `Refunds are not provided for: (a) change of mind after access has been granted; (b) dissatisfaction with generated content output, since all content requires user review and editing; (c) issues caused by third-party platform policy changes after purchase; (d) failure to verify platform compliance before publishing content; (e) account or access issues caused by the user's own technical environment.`,
  },
  {
    heading: "How to Request Support",
    body: `For technical issues within the 48-hour window, use the support contact method provided with your purchase. Include your order confirmation and a clear description of the problem. Response times may vary but we aim to respond within 24 hours.`,
  },
  {
    heading: "Chargebacks",
    body: `Filing a chargeback with your payment provider before contacting support is not recommended and may result in temporary or permanent suspension of access. Please contact us first so we can attempt to resolve the issue.`,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function RefundPolicyPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.p
          className="font-mono text-base tracking-widest uppercase text-electric mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Legal
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Refund Policy
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground leading-relaxed mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last updated: 2025
        </motion.p>

        <Separator className="bg-border/60 mb-10" />

        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-3">
                {section.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

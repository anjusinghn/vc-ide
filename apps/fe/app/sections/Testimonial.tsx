"use client";

import { motion } from "framer-motion";
import WordReveal from "@/app/components/WordReveal";

const testimonialText =
  "We went from spending 6 hours preparing IC memos to having a draft ready before the partner meeting ends. Rixie doesn't replace our judgment — it gives us back the time to actually use it.";

export default function Testimonial() {
  return (
    <section className="min-h-screen py-24 md:py-32 px-8 md:px-28">
      <div className="max-w-3xl mx-auto flex flex-col items-start gap-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-6xl font-serif text-muted-foreground select-none block"
        >
          &ldquo;
        </motion.span>

        <WordReveal
          text={testimonialText}
          className="text-4xl md:text-5xl font-medium leading-[1.2]"

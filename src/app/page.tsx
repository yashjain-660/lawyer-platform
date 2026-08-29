"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Balance, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight"
          >
            Defending Your Rights,<br/>Securing Your Future.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto font-sans text-gray-300"
          >
            Premium legal representation with a multilingual approach. We are committed to achieving the best possible outcomes for our clients.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/contact" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors flex items-center gap-2">
              Free Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/practice-areas" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-md font-semibold text-lg backdrop-blur-sm transition-colors">
              Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Balance, title: "Expert Representation", desc: "Decades of combined experience in complex litigation and corporate law." },
              { icon: Shield, title: "Unwavering Protection", desc: "We vigorously defend your interests in and out of the courtroom." },
              { icon: Clock, title: "24/7 Availability", desc: "Legal emergencies don't wait for business hours, and neither do we." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gray-50 flex items-center justify-center rounded-full mb-6">
                  <feature.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-sans">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

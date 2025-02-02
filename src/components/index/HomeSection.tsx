import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface HomeSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const HomeSection = ({ title, icon: Icon, children }: HomeSectionProps) => {
  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Icon className="h-6 w-6 text-tibetan-orange" />
          <h2 className="text-2xl font-semibold text-tibetan-brown">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
};
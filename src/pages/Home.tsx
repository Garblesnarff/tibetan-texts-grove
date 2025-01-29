import React from "react";
import { Header } from "@/components/index/Header";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Tibetan Texts Grove</h1>
        <p className="text-gray-600">
          Explore our collection of Tibetan Buddhist translations and texts.
        </p>
      </div>
    </div>
  );
}
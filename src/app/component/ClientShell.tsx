"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });
const BehaviorTracker = dynamic(() => import("./BehaviorTracker"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <Chatbot />
      <BehaviorTracker />
    </>
  );
}

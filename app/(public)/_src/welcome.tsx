"use client"
import React from "react";
import { StaggeredText } from "@/components/ui/staggered-text"

const WELCOME_DURATION_IN_MILLISECONDS = 1_500

export function Welcome({ name }: { name: string }) {
  const [showWelcome, setShowWelcome] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, WELCOME_DURATION_IN_MILLISECONDS);

    return () => clearTimeout(timer);
  }, []);


  if (!showWelcome) {
    return null;
  }


  return (
    <div className="fixed w-screen h-screen flex flex-col items-center justify-center z-100 bg-background">
      <StaggeredText
        className="text-6xl font-bold text-center"
        text={name}
        segmentBy="chars"
        delay={WELCOME_DURATION_IN_MILLISECONDS / 30}
        direction="bottom"
      />
    </div>
  )
}

"use client"
import React from "react";
import { StaggeredText } from "./ui/staggered-text"

export const Welcome = () => {
  const timeout = 2000; // 2 seconds

  const [showWelcome, setShowWelcome] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to the main page after the timeout
      setShowWelcome(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);


  if (!showWelcome) {
    return null; // Render nothing if welcome is not shown
  }


  return (
    <div className="fixed w-screen h-screen flex flex-col items-center justify-center z-100 bg-background">
      <StaggeredText
        className="text-6xl font-bold text-center"
        text="Henrique Pessoa"
        segmentBy="chars"
        delay={timeout / 30 }
        direction="bottom"
      />
    </div>
  )
}
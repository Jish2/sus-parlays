"use client";

import { Form } from "@/components/form";
import { YC } from "@/components/yc";
import { Github } from "lucide-react";
import { Countdown } from "@/components/countdown";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[600px] font-mono">
        <h1 className="text-2xl font-bold flex items-center gap-4">
          <YC />
          sus parlays (DAY01)
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm -mt-6">
          winner gets 1 yr of{" "}
          <a
            href="https://cluely.com"
            target="_blank"
            className="underline underline-offset-4"
          >
            cluely
          </a>{" "}
          on <s>roy lee</s> us (please sponsor this roy)
        </p>
        <Countdown />

        <Form />
      </main>
      <footer className="row-start-4 flex gap-[24px] flex-wrap justify-center w-full max-w-[600px] font-mono">
        <h1 className="font-bold">sweepstakes disclaimer</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          select yes or no to place your prediction for each event. one
          individual who gets the most predictions correct (in DAY01 or DAY02)
          will receive $100 value in ai tool subscriptions or one year of Cluely
          (pending approval). winners will be announced at the end of the event.
          proof of yc sus acceptance will be required to claim the prize. good
          luck!
        </p>

        <a
          href="https://github.com/Jish2/sus-parlays"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
        >
          <Github size={16} />
          github
        </a>
      </footer>
    </div>
  );
}

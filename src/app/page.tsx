"use client";

import { Parlay } from "@/components/parlay";
import Verification from "@/components/verification";
import { YC } from "@/components/yc";
import Image from "next/image";
import { useState } from "react";

const data = [
  {
    title: "Garry tweets more than 5 times during day 1",
    subtitle: "From 9:00 am to 5:30 pm, and excluding reposts",
  },
  {
    title: "Gary & partners (Diana Hu, David Lieb) all wear YC merch",
    subtitle: "At one point while they are on stage",
  },
  {
    title: 'Sam says "AGI" > 5 times',
    subtitle: "",
  },
  {
    title: "Someone asks Sam Altman about GPT-5",
    subtitle: "",
  },
  {
    title: "There are sandwiches at lunch",
    subtitle: "Hamburgers included, hotdogs excluded",
  },
  {
    title: "Alphafold or Nobel Prize mentioned",
    subtitle: "",
  },
  {
    title: "Elon is late",
    subtitle: "",
  },
  {
    title: "Elon Musk mentions SpaceX or Neuralink",
    subtitle: "",
  },
];

export default function Home() {
  const [selections, setSelections] = useState(Array(data.length).fill(null));
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(
    Array(data.length).fill(null)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]); // Clear previous errors

    // check if all selections are not null
    if (selections.some((selection) => selection === null)) {
      setErrors((prev) => [...prev, "all selections must be made"]);
    }

    // submit predictions
    setIsSubmitting(false);

    // setIsShow(true);
  };

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
          on us <s>roy lee</s> (pending approval)
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsShow(!isShow)}
              className="px-3 py-2 bg-[#fb651e] text-white rounded-md font-medium
                        hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#fb651e] focus:ring-offset-2
                        dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors text-sm w-fit"
            >
              {isShow ? "hide" : "show"} predictions
            </button>
          </div>

          <div className="w-full flex flex-col gap-4">
            {data.map(({ title, subtitle }, i) => (
              <div key={i} className="flex items-center gap-4">
                {isShow ? (
                  <Parlay
                    title={title}
                    subtitle={subtitle}
                    isShow={isShow}
                    left={10}
                    right={20}
                  />
                ) : (
                  <Parlay
                    title={title}
                    subtitle={subtitle}
                    selection={selections[i]}
                    onClick={(value: boolean) =>
                      setSelections((p) => {
                        const newSelections = [...p];
                        newSelections[i] = value;
                        return newSelections;
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {!isShow && (
            <>
              <Verification
                isVerified={isVerified}
                setIsVerified={setIsVerified}
              />

              {errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 w-full mb-4">
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Please fix the following errors:
                      </h3>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {isVerified && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-[#fb651e] text-white rounded-md hover:bg-[#fb651e]/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      submitting predictions...
                    </div>
                  ) : (
                    "submit predictions"
                  )}
                </button>
              )}
            </>
          )}
        </form>
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
      </footer>
    </div>
  );
}

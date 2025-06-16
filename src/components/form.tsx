"use client";

import { ParlayChoice, ParlayLoad, ParlayView } from "@/components/parlay";
import Verification from "@/components/verification";
import { parlayData } from "@/lib/data";
import { useCallback, useEffect, useState } from "react";

type VoteCountsData = {
  yes: number;
  no: number;
};

export const Form = () => {
  const [selections, setSelections] = useState(
    Array(parlayData.length).fill(null),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [voteCountsData, setVoteCountsData] = useState<VoteCountsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAlreadySubmitted = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-submission");
      const data = await response.json();
      if (data?.data?.length) {
        setIsAlreadySubmitted(true);
        const parsed_selections = JSON.parse(data.data[0].selection);
        setSelections(parsed_selections);
      }

      const voteCountsResponse = await fetch("/api/get-vote-counts");
      const voteCountsData = await voteCountsResponse.json();
      console.log(voteCountsData);
      setVoteCountsData(voteCountsData.result);
      // setIsAlreadySubmitted(data.alreadySubmitted);
    } catch (error) {
      console.error("Error checking already submitted:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAlreadySubmitted();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrors([]); // Clear previous errors
      console.log(selections.some((selection) => selection === null));
      // check if all selections are not null
      if (selections.some((selection) => selection === null)) {
        setErrors((prev) => [...prev, "all selections must be made"]);
      }

      // submit predictions
      setIsSubmitting(false);

      const parsed_selections = selections.map((selection) => {
        if (selection === null) {
          return 0;
        }
        return selection === true ? 1 : 0;
      });

      await fetch("/api/submit-parlay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsed_selections }),
      });

      // reload window
      window.location.reload();
    },
    [selections],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-4">
        {parlayData.map(({ title, subtitle }, i) => (
          <div key={i} className="flex items-center gap-4">
            {isLoading ? (
              <ParlayLoad />
            ) : isAlreadySubmitted ? (
              <ParlayView
                title={title}
                subtitle={subtitle}
                left={voteCountsData[i]?.yes ?? 0}
                right={voteCountsData[i]?.no ?? 0}
              />
            ) : (
              <ParlayChoice
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

      {!isAlreadySubmitted && (
        <>
          <Verification isVerified={isVerified} setIsVerified={setIsVerified} />

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
  );
};

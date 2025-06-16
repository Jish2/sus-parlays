"use client";

export function ParlayLoad() {
  return (
    <div className="p-4 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-neutral-800 transition-colors">
      <div className="pb-0 text-lg font-semibold w-full h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-4" />
      <div className="text-sm text-neutral-500 dark:text-neutral-400 w-full h-12 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse" />
    </div>
  );
}

type ParlayViewProps = {
  title: string;
  subtitle: string;
  left: number;
  right: number;
};

export function ParlayView({ title, subtitle, left, right }: ParlayViewProps) {
  return (
    <div className="p-4 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-neutral-800 transition-colors">
      <h3 className="pb-0 text-lg font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {subtitle}
        </p>
      )}

      <ProgressBar left={left ?? 0} right={right ?? 0} />
    </div>
  );
}

type ParlayChoiceProps = {
  title: string;
  subtitle: string;
  selection: boolean | null;
  onClick: (value: boolean) => void;
};

export function ParlayChoice({
  title,
  subtitle,
  selection,
  onClick,
}: ParlayChoiceProps) {
  return (
    <div className="p-4 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-neutral-800 transition-colors">
      <h3 className="pb-0 text-lg font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {subtitle}
        </p>
      )}

      <div>
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-24
              ${
                selection === true
                  ? "bg-[#fb651e] text-white hover:brightness-95"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            onClick={() => onClick?.(true)}
          >
            Yes
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-24
              ${
                selection === false
                  ? "bg-[#fb651e] text-white hover:brightness-95"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            onClick={() => onClick?.(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ left, right }: { left: number; right: number }) {
  const total = left + right;
  const progress = (left / total) * 100;
  return (
    <div className="w-full h-[38px] rounded-md overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-700 relative mt-4">
      <div className="h-full bg-[#fb651e]" style={{ width: `${progress}%` }} />
      <div className="flex justify-between absolute left-0 w-full h-full px-2 top-1/2 -translate-y-1/2">
        <span className="text-sm text-neutral-100 dark:text-neutral-100 leading-9">
          {left}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-100 leading-9">
          {right}
        </span>
      </div>
    </div>
  );
}

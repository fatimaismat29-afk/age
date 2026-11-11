import React, { useState, useEffect } from 'react';
import { 
  Cake, 
  Calendar, 
  Clock, 
  Sparkles, 
  Share2, 
  Check, 
  Heart, 
  Wind, 
  Moon, 
  Flame, 
  PartyPopper,
  Compass,
  Hourglass,
  CalendarDays
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeCalculationResult, formatReadableDate, formatNumber } from '../utils/ageCalculator.ts';

interface AgeResultsSectionProps {
  result: AgeCalculationResult;
  isLiveTickerActive: boolean;
  onToggleLiveTicker: () => void;
}

export const AgeResultsSection: React.FC<AgeResultsSectionProps> = ({
  result,
  isLiveTickerActive,
  onToggleLiveTicker,
}) => {
  const [copied, setCopied] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(result.totalSeconds);

  // When result changes, sync liveSeconds
  useEffect(() => {
    setLiveSeconds(result.totalSeconds);
  }, [result.totalSeconds]);

  // Live timer tick if active
  useEffect(() => {
    if (!isLiveTickerActive) return;
    const interval = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveTickerActive]);

  const liveMinutes = Math.floor(liveSeconds / 60);
  const liveHours = Math.floor(liveMinutes / 60);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
    });
  };

  const copySummaryToClipboard = async () => {
    const summary = [
      `🎂 Age Calculator Summary`,
      `• Date of Birth: ${formatReadableDate(result.birthDate)} (${result.dayOfWeekBorn})`,
      `• Exact Age: ${result.years} Years, ${result.months} Months, ${result.days} Days`,
      `• Next Birthday: ${formatReadableDate(result.nextBirthday.date)} (${result.nextBirthday.daysRemaining} days remaining, turning ${result.nextBirthday.turningAge})`,
      `• Total Days Alive: ${formatNumber(result.totalDays)} days`,
      `• Total Hours: ${formatNumber(liveHours)} hours`,
      `• Western Zodiac: ${result.zodiac.name} (${result.zodiac.symbol})`,
      `• Chinese Zodiac: ${result.chineseZodiac.animal} (${result.chineseZodiac.symbol})`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Birthday year progress percentage (0 to 100%)
  const daysInBirthdayYear = 365;
  const daysElapsedSinceLastBirthday = Math.max(0, daysInBirthdayYear - result.nextBirthday.daysRemaining);
  const birthdayYearProgress = Math.min(100, Math.round((daysElapsedSinceLastBirthday / daysInBirthdayYear) * 100));

  return (
    <div className="space-y-6">
      {/* Birthday Celebration Banner if today is their birthday! */}
      {result.isBirthdayToday && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 text-white shadow-xl shadow-rose-500/20">
          <div className="relative z-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <PartyPopper className="h-6 w-6 text-yellow-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Happy Birthday! 🎉</h3>
                <p className="text-sm text-white/90">
                  Wishing you an incredible year ahead as you turn {result.years} today!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={triggerConfetti}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-rose-600 shadow-md transition hover:bg-rose-50 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Celebrate!</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Primary Exact Age Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-8 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Primary Result
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Your Exact Age
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Born on <span className="font-semibold text-slate-700 dark:text-slate-300">{result.dayOfWeekBorn}</span>, {formatReadableDate(result.birthDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copySummaryToClipboard}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
              title="Copy age summary to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Share Summary'}</span>
            </button>
            <button
              type="button"
              onClick={triggerConfetti}
              aria-label="Celebrate"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
              title="Celebration confetti"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Triple Primary Metrics: Years, Months, Days */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Years */}
          <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 text-center transition-all hover:shadow-md dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-900">
            <span className="block text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl dark:text-indigo-400 font-mono tabular-nums">
              {result.years}
            </span>
            <span className="mt-1 block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
              {result.years === 1 ? 'Year' : 'Years'}
            </span>
          </div>

          {/* Months */}
          <div className="relative overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-5 text-center transition-all hover:shadow-md dark:border-violet-900/40 dark:from-violet-950/30 dark:to-slate-900">
            <span className="block text-4xl font-extrabold tracking-tight text-violet-600 sm:text-5xl dark:text-violet-400 font-mono tabular-nums">
              {result.months}
            </span>
            <span className="mt-1 block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
              {result.months === 1 ? 'Month' : 'Months'}
            </span>
          </div>

          {/* Days */}
          <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white p-5 text-center transition-all hover:shadow-md dark:border-sky-900/40 dark:from-sky-950/30 dark:to-slate-900">
            <span className="block text-4xl font-extrabold tracking-tight text-sky-600 sm:text-5xl dark:text-sky-400 font-mono tabular-nums">
              {result.days}
            </span>
            <span className="mt-1 block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
              {result.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>

        {/* Narrative sentence */}
        <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-center text-xs font-medium text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
          You are exactly <strong className="text-slate-900 dark:text-white">{result.years} years, {result.months} months, and {result.days} days</strong> old as of {formatReadableDate(result.targetDate)}.
        </div>
      </div>

      {/* 2. Next Birthday Card & Countdown */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-7 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400">
              <Cake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Next Birthday Countdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {result.nextBirthday.dayOfWeek}, {formatReadableDate(result.nextBirthday.date)} · Turning {result.nextBirthday.turningAge}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 self-start rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2 sm:self-auto dark:border-rose-900/40 dark:bg-rose-950/30">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {result.nextBirthday.daysRemaining}
            </span>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
              {result.nextBirthday.daysRemaining === 1 ? 'day remaining' : 'days remaining'}
            </span>
          </div>
        </div>

        {/* Progress bar of current solar year */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Year cycle completed</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono tabular-nums">
              {birthdayYearProgress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 transition-all duration-700"
              style={{ width: `${birthdayYearProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Total Time Units Grid */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-7 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Total Age in Every Unit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cumulative lifetime breakdown across standard calendar and time intervals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLiveTicker}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isLiveTickerActive
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{isLiveTickerActive ? 'Live Ticker: ON' : 'Live Ticker: OFF'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* Total Months */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Months
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumber(result.totalMonths)}
            </span>
          </div>

          {/* Total Weeks */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Weeks
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumber(result.totalWeeks)}
            </span>
          </div>

          {/* Total Days */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Days
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumber(result.totalDays)}
            </span>
          </div>

          {/* Total Hours */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Hours
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumber(liveHours)}
            </span>
          </div>

          {/* Total Minutes */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Minutes
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumber(liveMinutes)}
            </span>
          </div>

          {/* Total Seconds */}
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Seconds
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {formatNumber(liveSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Astrological & Biological Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Zodiac & Signs Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Astrological Signs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Western & Chinese zodiac alignments
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Western Zodiac</span>
                <span className="text-xl">{result.zodiac.symbol}</span>
              </div>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {result.zodiac.name}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>{result.zodiac.element} Element</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">
                {result.zodiac.dateRange}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chinese Zodiac</span>
                <span className="text-xl">{result.chineseZodiac.symbol}</span>
              </div>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {result.chineseZodiac.animal}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>{result.chineseZodiac.element} Year</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">
                Year of the {result.chineseZodiac.animal}
              </span>
            </div>
          </div>
        </div>

        {/* Biological Estimates Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Estimated Biological Stats
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Approximate biological events since birth
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 px-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Heartbeats (~72 bpm)</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                ~{formatNumber(result.lifeStats.heartbeatsApprox)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 px-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-2.5">
                <Wind className="h-4 w-4 text-sky-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Breaths Taken (~16/min)</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                ~{formatNumber(result.lifeStats.breathsApprox)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 px-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-2.5">
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Hours Slept (~8 hrs/day)</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                ~{formatNumber(result.lifeStats.hoursSleptApprox)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Key Life Milestones Timeline */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-7 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Hourglass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Life Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Significant temporal landmarks in your life journey
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {result.milestones.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                m.isPassed
                  ? 'border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </span>
                  {m.isPassed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <CalendarDays className="h-3 w-3" /> Upcoming
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-200/50 pt-2.5 dark:border-slate-700/50">
                <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                  {formatReadableDate(m.targetDate)}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                  {m.isPassed
                    ? `${formatNumber(m.daysRemainingOrPassed)} days ago`
                    : `In ${formatNumber(m.daysRemainingOrPassed)} days`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

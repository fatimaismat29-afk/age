import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar.tsx';
import { DateInputCard } from './components/DateInputCard.tsx';
import { AgeResultsSection } from './components/AgeResultsSection.tsx';
import { calculateDetailedAge, AgeCalculationResult } from './utils/ageCalculator.ts';
import { Calendar, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Today's date in YYYY-MM-DD
  const getTodayISO = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayString = getTodayISO();

  // Input states
  const [birthDateString, setBirthDateString] = useState<string>('');
  const [targetDateString, setTargetDateString] = useState<string>(todayString);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Results state
  const [result, setResult] = useState<AgeCalculationResult | null>(null);
  const [isLiveTickerActive, setIsLiveTickerActive] = useState<boolean>(false);

  // Sync dark theme class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Perform Age Calculation
  const handleCalculate = () => {
    setErrorMessage(null);

    if (!birthDateString) {
      setErrorMessage('Please select or enter your date of birth.');
      return;
    }

    const birthDate = new Date(birthDateString + 'T00:00:00');
    const targetDate = new Date((targetDateString || todayString) + 'T23:59:59');

    if (isNaN(birthDate.getTime())) {
      setErrorMessage('The date entered is invalid. Please check day, month, and year.');
      return;
    }

    // Validation: prevent future dates relative to target date
    if (birthDate.getTime() > targetDate.getTime()) {
      setErrorMessage('Date of birth cannot be later than the target calculation date.');
      return;
    }

    // Realistic historical range validation (max 130 years)
    const currentYear = new Date().getFullYear();
    if (birthDate.getFullYear() < currentYear - 130) {
      setErrorMessage('Please enter a birth year within the last 130 years.');
      return;
    }

    try {
      const calcResult = calculateDetailedAge(birthDate, targetDate);
      setResult(calcResult);

      // Trigger confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899'],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to compute age. Please check your inputs.');
      }
    }
  };

  // Reset all inputs and results
  const handleReset = () => {
    setBirthDateString('');
    setTargetDateString(todayString);
    setResult(null);
    setErrorMessage(null);
    setIsLiveTickerActive(false);
  };

  // Quick Preset Helper
  const handleQuickPreset = (yearOffset: number, month?: number, day?: number) => {
    const d = new Date();
    const targetYear = d.getFullYear() - yearOffset;
    const targetMonth = month ? String(month).padStart(2, '0') : '06';
    const targetDay = day ? String(day).padStart(2, '0') : '15';
    const newDateStr = `${targetYear}-${targetMonth}-${targetDay}`;
    setBirthDateString(newDateStr);
    setErrorMessage(null);
  };

  // Pre-load a sample birthday
  const handleSetSampleDate = () => {
    const sampleYear = new Date().getFullYear() - 25;
    setBirthDateString(`${sampleYear}-04-18`);
    setErrorMessage(null);
    setTimeout(() => {
      const birthDate = new Date(`${sampleYear}-04-18T00:00:00`);
      const targetDate = new Date();
      setResult(calculateDetailedAge(birthDate, targetDate));
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Background Gradient Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/30 blur-3xl dark:from-indigo-950/20 dark:to-violet-950/20" />
        <div className="absolute -right-[15%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-sky-200/40 to-blue-200/30 blur-3xl dark:from-sky-950/20 dark:to-blue-950/20" />
        <div className="absolute bottom-[5%] left-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-rose-200/30 to-amber-200/20 blur-3xl dark:from-rose-950/15 dark:to-amber-950/15" />
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSetSampleDate={handleSetSampleDate}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Title & Subtitle */}
        <div className="text-center sm:py-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Age Calculator
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg dark:text-slate-400">
            Discover your exact age in seconds.
          </p>
        </div>

        {/* Two-Column or Stacked Interactive Area */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Input Form (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <DateInputCard
                birthDateString={birthDateString}
                targetDateString={targetDateString}
                onBirthDateChange={(val) => {
                  setBirthDateString(val);
                  setErrorMessage(null);
                }}
                onTargetDateChange={(val) => {
                  setTargetDateString(val);
                  setErrorMessage(null);
                }}
                onCalculate={handleCalculate}
                onReset={handleReset}
                errorMessage={errorMessage}
                maxDateString={targetDateString || todayString}
                onQuickPreset={handleQuickPreset}
              />

              {/* Quick Feature Highlights under the form */}
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-900/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Precision Features
                </h4>
                <ul className="mt-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Exact leap year & calendar month length calculations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Next birthday countdown and day-of-week detector</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Total months, weeks, days, hours, and live seconds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Western & Chinese Zodiac plus life milestone tracker</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Results or Guide (7 cols on lg) */}
          <div className="lg:col-span-7">
            {result ? (
              <AgeResultsSection
                result={result}
                isLiveTickerActive={isLiveTickerActive}
                onToggleLiveTicker={() => setIsLiveTickerActive((prev) => !prev)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/90 bg-white/60 p-8 text-center backdrop-blur-xs sm:p-12 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Ready to Calculate
                </h3>
                <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select your date of birth in the form to generate your exact age in years, months, and days, along with detailed time units and birthday countdown.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleSetSampleDate}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500 active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>See Example Calculation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helpful Information & Frequently Asked Questions */}
        <section className="mt-16 border-t border-slate-200/80 pt-10 dark:border-slate-800/80">
          <div className="mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              About Age Calculations
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Exact Calendar Math
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike simple approximation methods that divide days by 365.25, this calculator uses exact calendar month days and handles leap years precisely.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Next Birthday Countdown
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes the precise number of remaining days, the day of the week, and your upcoming age. If today is your birthday, celebration mode activates automatically!
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Historical & Future Dates
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Use the &ldquo;Calculate Age As Of&rdquo; option to discover your exact age at any momentous event in the past or in the distant future.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200/80 py-8 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Age Calculator · Accurate Calendar Calculations</p>
        </footer>
      </main>
    </div>
  );
}

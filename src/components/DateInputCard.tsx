import React, { useState } from 'react';
import { Calendar, RotateCcw, Calculator, ArrowRight, AlertCircle, Clock } from 'lucide-react';

interface DateInputCardProps {
  birthDateString: string;
  targetDateString: string;
  onBirthDateChange: (val: string) => void;
  onTargetDateChange: (val: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  errorMessage: string | null;
  maxDateString: string;
  onQuickPreset: (yearOffset: number, month?: number, day?: number) => void;
}

export const DateInputCard: React.FC<DateInputCardProps> = ({
  birthDateString,
  targetDateString,
  onBirthDateChange,
  onTargetDateChange,
  onCalculate,
  onReset,
  errorMessage,
  maxDateString,
  onQuickPreset,
}) => {
  const [showAdvancedTarget, setShowAdvancedTarget] = useState(false);

  // Parse current values into month, day, year for manual fields
  const parseParts = (iso: string) => {
    if (!iso) return { y: '', m: '', d: '' };
    const parts = iso.split('-');
    return {
      y: parts[0] || '',
      m: parts[1] ? String(parseInt(parts[1], 10)) : '',
      d: parts[2] ? String(parseInt(parts[2], 10)) : '',
    };
  };

  const birthParts = parseParts(birthDateString);

  const handleManualPartChange = (field: 'y' | 'm' | 'd', value: string) => {
    const current = parseParts(birthDateString);
    let newY = field === 'y' ? value : current.y;
    let newM = field === 'm' ? value : current.m;
    let newD = field === 'd' ? value : current.d;

    if (newY && newM && newD) {
      const paddedM = newM.padStart(2, '0');
      const paddedD = newD.padStart(2, '0');
      onBirthDateChange(`${newY}-${paddedM}-${paddedD}`);
    } else if (newY.length === 4 && newM && newD) {
      const paddedM = newM.padStart(2, '0');
      const paddedD = newD.padStart(2, '0');
      onBirthDateChange(`${newY}-${paddedM}-${paddedD}`);
    }
  };

  const monthsList = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all sm:p-8 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none">
      {/* Decorative subtle ambient gradient accent */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="relative z-10 space-y-6"
      >
        {/* Date of Birth Picker */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="birthdate-input"
              className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Required
            </span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              id="birthdate-input"
              type="date"
              max={maxDateString}
              value={birthDateString}
              onChange={(e) => onBirthDateChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-xs transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-400/20"
            />
          </div>

          {/* Quick Dropdowns for day / month / year alternative */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="select-birth-day" className="sr-only">Day</label>
              <select
                id="select-birth-day"
                value={birthParts.d}
                onChange={(e) => handleManualPartChange('d', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-birth-month" className="sr-only">Month</label>
              <select
                id="select-birth-month"
                value={birthParts.m}
                onChange={(e) => handleManualPartChange('m', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">Month</option>
                {monthsList.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-birth-year" className="sr-only">Year</label>
              <input
                id="select-birth-year"
                type="number"
                placeholder="Year (e.g. 1998)"
                min="1900"
                max={new Date().getFullYear()}
                value={birthParts.y}
                onChange={(e) => handleManualPartChange('y', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Quick presets for convenience */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Presets:</span>
            <button
              type="button"
              onClick={() => onQuickPreset(20)}
              className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
            >
              20 yrs ago
            </button>
            <button
              type="button"
              onClick={() => onQuickPreset(30)}
              className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
            >
              30 yrs ago
            </button>
            <button
              type="button"
              onClick={() => onBirthDateChange('2000-01-01')}
              className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
            >
              Jan 1, 2000
            </button>
            <button
              type="button"
              onClick={() => onQuickPreset(18)}
              className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
            >
              18 yrs ago
            </button>
          </div>
        </div>

        {/* Optional Target Date Toggle */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-3.5 transition dark:border-slate-800/60 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Calculate Age As Of
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvancedTarget(!showAdvancedTarget)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {showAdvancedTarget ? 'Reset to Today' : 'Change Date (Default: Today)'}
            </button>
          </div>

          {showAdvancedTarget && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                Want to know how old you were on a historical date or will be in the future? Select a custom date below:
              </p>
              <input
                type="date"
                value={targetDateString}
                onChange={(e) => onTargetDateChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 translate-y-0.5 text-rose-600 dark:text-rose-400" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            className="group relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/35 active:scale-[0.98]"
          >
            <Calculator className="h-4 w-4 transition group-hover:scale-110" />
            <span>Calculate Age</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
};

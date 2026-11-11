/**
 * Comprehensive age and date calculation utilities
 * Handles exact calendar math, leap years, time units, next birthday, and life milestones.
 */

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dateRange: string;
}

export interface Milestone {
  title: string;
  targetDate: Date;
  isPassed: boolean;
  daysRemainingOrPassed: number;
  description: string;
}

export interface AgeCalculationResult {
  birthDate: Date;
  targetDate: Date;
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isBirthdayToday: boolean;
  nextBirthday: {
    date: Date;
    daysRemaining: number;
    dayOfWeek: string;
    turningAge: number;
  };
  dayOfWeekBorn: string;
  zodiac: ZodiacSign;
  chineseZodiac: {
    animal: string;
    element: string;
    symbol: string;
  };
  lifeStats: {
    heartbeatsApprox: number;
    breathsApprox: number;
    hoursSleptApprox: number;
  };
  milestones: Milestone[];
}

/**
 * Returns number of days in a specific month of a specific year.
 * month is 1-indexed (1 = January, 12 = December).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get Western Zodiac sign from month and day (1-indexed).
 */
export function getZodiacSign(month: number, day: number): ZodiacSign {
  const signs: (ZodiacSign & { startMonth: number; startDay: number; endMonth: number; endDay: number })[] = [
    { name: 'Capricorn', symbol: '♑', element: 'Earth', dateRange: 'Dec 22 – Jan 19', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: 'Aquarius', symbol: '♒', element: 'Air', dateRange: 'Jan 20 – Feb 18', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: 'Pisces', symbol: '♓', element: 'Water', dateRange: 'Feb 19 – Mar 20', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: 'Aries', symbol: '♈', element: 'Fire', dateRange: 'Mar 21 – Apr 19', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: 'Taurus', symbol: '♉', element: 'Earth', dateRange: 'Apr 20 – May 20', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: 'Gemini', symbol: '♊', element: 'Air', dateRange: 'May 21 – Jun 20', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { name: 'Cancer', symbol: '♋', element: 'Water', dateRange: 'Jun 21 – Jul 22', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { name: 'Leo', symbol: '♌', element: 'Fire', dateRange: 'Jul 23 – Aug 22', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: 'Virgo', symbol: '♍', element: 'Earth', dateRange: 'Aug 23 – Sep 22', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: 'Libra', symbol: '♎', element: 'Air', dateRange: 'Sep 23 – Oct 22', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: 'Scorpio', symbol: '♏', element: 'Water', dateRange: 'Oct 23 – Nov 21', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', dateRange: 'Nov 22 – Dec 21', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ];

  for (const s of signs) {
    if (
      (month === s.startMonth && day >= s.startDay) ||
      (month === s.endMonth && day <= s.endDay)
    ) {
      return { name: s.name, symbol: s.symbol, element: s.element, dateRange: s.dateRange };
    }
  }

  return { name: 'Capricorn', symbol: '♑', element: 'Earth', dateRange: 'Dec 22 – Jan 19' };
}

/**
 * Get Chinese Zodiac animal and element from birth year.
 */
export function getChineseZodiac(year: number): { animal: string; element: string; symbol: string } {
  const animals = [
    { animal: 'Rat', symbol: '🐀' },
    { animal: 'Ox', symbol: '🐂' },
    { animal: 'Tiger', symbol: '🐅' },
    { animal: 'Rabbit', symbol: '🐇' },
    { animal: 'Dragon', symbol: '🐉' },
    { animal: 'Snake', symbol: '🐍' },
    { animal: 'Horse', symbol: '🐎' },
    { animal: 'Goat', symbol: '🐐' },
    { animal: 'Monkey', symbol: '🐒' },
    { animal: 'Rooster', symbol: '🐓' },
    { animal: 'Dog', symbol: '🐕' },
    { animal: 'Pig', symbol: '🐖' },
  ];
  const elements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];

  // Base year 1900 was Rat & Metal
  const animalIndex = ((year - 1900) % 12 + 12) % 12;
  const elementIndex = ((year - 1900) % 10 + 10) % 10;

  return {
    animal: animals[animalIndex].animal,
    symbol: animals[animalIndex].symbol,
    element: elements[elementIndex],
  };
}

/**
 * Primary age calculation function
 */
export function calculateDetailedAge(birthDateInput: Date, targetDateInput: Date = new Date()): AgeCalculationResult {
  // Normalize both dates to midnight local or timestamp accurately
  const birthDate = new Date(
    birthDateInput.getFullYear(),
    birthDateInput.getMonth(),
    birthDateInput.getDate(),
    birthDateInput.getHours(),
    birthDateInput.getMinutes(),
    birthDateInput.getSeconds()
  );

  const targetDate = new Date(
    targetDateInput.getFullYear(),
    targetDateInput.getMonth(),
    targetDateInput.getDate(),
    targetDateInput.getHours(),
    targetDateInput.getMinutes(),
    targetDateInput.getSeconds()
  );

  if (targetDate.getTime() < birthDate.getTime()) {
    throw new Error('Date of birth cannot be in the future relative to the calculation date.');
  }

  let birthYear = birthDate.getFullYear();
  let birthMonth = birthDate.getMonth() + 1; // 1-indexed
  let birthDay = birthDate.getDate();

  let targetYear = targetDate.getFullYear();
  let targetMonth = targetDate.getMonth() + 1; // 1-indexed
  let targetDay = targetDate.getDate();

  // Exact calendar difference calculation:
  // If target day is less than birth day, borrow days from previous month
  if (targetDay < birthDay) {
    // Month prior to targetMonth in targetYear
    const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    const prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    targetDay += daysInPrevMonth;
    targetMonth -= 1;
    if (targetMonth === 0) {
      targetMonth = 12;
      targetYear -= 1;
    }
  }

  if (targetMonth < birthMonth) {
    targetMonth += 12;
    targetYear -= 1;
  }

  const years = targetYear - birthYear;
  const months = targetMonth - birthMonth;
  const days = targetDay - birthDay;

  // Total elapsed time metrics
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next birthday calculation
  let nextBdayYear = targetDate.getFullYear();
  let bdayMonthIndex = birthDate.getMonth();
  let bdayDay = birthDate.getDate();

  // Check Feb 29 leap year birth baby
  if (bdayMonthIndex === 1 && bdayDay === 29 && !isLeapYear(nextBdayYear)) {
    // If not a leap year, standard convention celebrates on Feb 28 or Mar 1; use Feb 28
    bdayDay = 28;
  }

  let nextBday = new Date(nextBdayYear, bdayMonthIndex, bdayDay);
  
  // Set target date at midnight for fair day-based comparison
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const isBirthdayToday = 
    birthDate.getMonth() === targetDate.getMonth() && 
    birthDate.getDate() === targetDate.getDate();

  if (targetMidnight.getTime() > nextBday.getTime()) {
    nextBdayYear += 1;
    let nextYearDay = birthDate.getDate();
    if (bdayMonthIndex === 1 && nextYearDay === 29 && !isLeapYear(nextBdayYear)) {
      nextYearDay = 28;
    }
    nextBday = new Date(nextBdayYear, bdayMonthIndex, nextYearDay);
  }

  const daysRemainingUntilNextBday = Math.ceil(
    (nextBday.getTime() - targetMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birthDate.getDay()];
  const nextBdayDayOfWeek = daysOfWeek[nextBday.getDay()];
  const turningAge = nextBdayYear - birthDate.getFullYear();

  // Zodiac sign
  const zodiac = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
  const chineseZodiac = getChineseZodiac(birthDate.getFullYear());

  // Life milestones
  const day10kDate = new Date(birthDate.getTime() + 10000 * 24 * 60 * 60 * 1000);
  const day20kDate = new Date(birthDate.getTime() + 20000 * 24 * 60 * 60 * 1000);
  const gigasecondDate = new Date(birthDate.getTime() + 1000000000 * 1000);
  const halfBirthdayDate = new Date(
    targetDate.getFullYear(),
    birthDate.getMonth() + 6,
    birthDate.getDate()
  );

  const createMilestone = (title: string, date: Date, description: string): Milestone => {
    const isPassed = targetDate.getTime() >= date.getTime();
    const daysDiff = Math.abs(
      Math.round((date.getTime() - targetMidnight.getTime()) / (1000 * 60 * 60 * 24))
    );
    return {
      title,
      targetDate: date,
      isPassed,
      daysRemainingOrPassed: daysDiff,
      description,
    };
  };

  const milestones: Milestone[] = [
    createMilestone('10,000 Days Alive', day10kDate, 'About 27.4 years of living'),
    createMilestone('1,000,000,000 Seconds Alive', gigasecondDate, 'Your 1-billion-seconds jubilee (~31.7 years)'),
    createMilestone('20,000 Days Alive', day20kDate, 'About 54.8 years of wisdom and experiences'),
    createMilestone('Half-Birthday', halfBirthdayDate, 'Exact 6-month halfway point between birthdays'),
  ];

  // Approx biological counters
  const heartbeatsApprox = Math.round(totalMinutes * 72); // ~72 bpm
  const breathsApprox = Math.round(totalMinutes * 16); // ~16 breaths/min
  const hoursSleptApprox = Math.round(totalDays * 8); // ~8 hours/day

  return {
    birthDate,
    targetDate,
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isBirthdayToday,
    nextBirthday: {
      date: nextBday,
      daysRemaining: isBirthdayToday ? 0 : daysRemainingUntilNextBday,
      dayOfWeek: nextBdayDayOfWeek,
      turningAge,
    },
    dayOfWeekBorn,
    zodiac,
    chineseZodiac,
    lifeStats: {
      heartbeatsApprox,
      breathsApprox,
      hoursSleptApprox,
    },
    milestones,
  };
}

/**
 * Format date nicely in local readable text
 */
export function formatReadableDate(date: Date, includeYear = true): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

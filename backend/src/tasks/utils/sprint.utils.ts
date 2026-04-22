const DAY_IN_MS = 24 * 60 * 60 * 1000;
const SPRINT_DURATION_DAYS = 14;

export interface SprintDateRange {
  startInclusive: Date;
  endExclusive: Date;
}

export interface SprintOption {
  year: number;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  label: string;
  isCurrent: boolean;
}

const formatIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

const formatLabelDate = (date: Date): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);

const startOfUtcDay = (date: Date): Date =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

export const getSprintYearStart = (year: number): Date => {
  const janFirst = new Date(Date.UTC(year, 0, 1));
  const dayOfWeek = janFirst.getUTCDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  return startOfUtcDay(new Date(Date.UTC(year, 0, 1 + offsetToMonday)));
};

export const getSprintYearForDate = (date: Date): number => {
  const normalizedDate = startOfUtcDay(date);
  const calendarYear = normalizedDate.getUTCFullYear();
  const currentSprintYearStart = getSprintYearStart(calendarYear);
  const nextSprintYearStart = getSprintYearStart(calendarYear + 1);

  if (normalizedDate >= nextSprintYearStart) {
    return calendarYear + 1;
  }

  if (normalizedDate >= currentSprintYearStart) {
    return calendarYear;
  }

  return calendarYear - 1;
};

export const getSprintDateRange = (
  year: number,
  sprintNumber: number,
): SprintDateRange => {
  if (sprintNumber < 1) {
    throw new RangeError('Sprint number must be greater than zero');
  }

  const sprintStart = getSprintYearStart(year);
  sprintStart.setUTCDate(
    sprintStart.getUTCDate() + (sprintNumber - 1) * SPRINT_DURATION_DAYS,
  );
  const nextSprintYearStart = getSprintYearStart(year + 1);

  if (sprintStart >= nextSprintYearStart) {
    throw new RangeError('Sprint number is out of range for the selected year');
  }

  const endExclusive = new Date(
    sprintStart.getTime() + SPRINT_DURATION_DAYS * DAY_IN_MS,
  );

  return {
    startInclusive: sprintStart,
    endExclusive,
  };
};

export const getSprintsForYear = (
  year: number,
  now: Date = new Date(),
): SprintOption[] => {
  const firstSprintStart = getSprintYearStart(year);
  const nextSprintYearStart = getSprintYearStart(year + 1);
  const currentDay = startOfUtcDay(now);

  const sprints: SprintOption[] = [];
  let sprintNumber = 1;
  let sprintStart = new Date(firstSprintStart);

  while (sprintStart < nextSprintYearStart) {
    const sprintEnd = new Date(
      sprintStart.getTime() + (SPRINT_DURATION_DAYS - 1) * DAY_IN_MS,
    );
    const endExclusive = new Date(
      sprintStart.getTime() + SPRINT_DURATION_DAYS * DAY_IN_MS,
    );

    sprints.push({
      year,
      sprintNumber,
      startDate: formatIsoDate(sprintStart),
      endDate: formatIsoDate(sprintEnd),
      label: `Спринт ${sprintNumber} (${formatLabelDate(sprintStart)} - ${formatLabelDate(sprintEnd)})`,
      isCurrent: currentDay >= sprintStart && currentDay < endExclusive,
    });

    sprintNumber += 1;
    sprintStart = new Date(
      sprintStart.getTime() + SPRINT_DURATION_DAYS * DAY_IN_MS,
    );
  }

  return sprints;
};

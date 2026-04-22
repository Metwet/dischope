import {
  getSprintDateRange,
  getSprintYearForDate,
  getSprintYearStart,
  getSprintsForYear,
} from './sprint.utils';

describe('sprint.utils', () => {
  it('starts the yearly sprint count on monday of the first week', () => {
    expect(getSprintYearStart(2026).toISOString()).toBe(
      '2025-12-29T00:00:00.000Z',
    );
    expect(getSprintYearStart(2025).toISOString()).toBe(
      '2024-12-30T00:00:00.000Z',
    );
  });

  it('builds exact 14-day sprint ranges', () => {
    const sprintRange = getSprintDateRange(2026, 2);

    expect(sprintRange.startInclusive.toISOString()).toBe(
      '2026-01-12T00:00:00.000Z',
    );
    expect(sprintRange.endExclusive.toISOString()).toBe(
      '2026-01-26T00:00:00.000Z',
    );
  });

  it('marks the active sprint inside the selected year', () => {
    const sprints = getSprintsForYear(
      2026,
      new Date('2026-01-20T12:00:00.000Z'),
    );

    expect(sprints[1]).toMatchObject({
      year: 2026,
      sprintNumber: 2,
      startDate: '2026-01-12',
      endDate: '2026-01-25',
      isCurrent: true,
    });
    expect(sprints[0].isCurrent).toBe(false);
  });

  it('detects sprint year for dates near year boundary', () => {
    expect(getSprintYearForDate(new Date('2025-12-29T12:00:00.000Z'))).toBe(
      2026,
    );
    expect(getSprintYearForDate(new Date('2025-12-28T12:00:00.000Z'))).toBe(
      2025,
    );
  });
});

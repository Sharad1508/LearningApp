import {
  applyCompletions,
  calculateProgress,
  markLessonCompleted,
} from '../src/domain/progress';

const lessons = (...flags) =>
  flags.map((completed, i) => ({
    id: String(i + 1),
    title: `L${i + 1}`,
    completed,
  }));

describe('calculateProgress', () => {
  it('is 0 for a course without lessons', () => {
    expect(calculateProgress([])).toBe(0);
    expect(calculateProgress(undefined)).toBe(0);
  });

  it('rounds to the nearest whole percent', () => {
    expect(calculateProgress(lessons(true, false, false))).toBe(33);
    expect(calculateProgress(lessons(true, true, false))).toBe(67);
  });

  it('is 100 when every lesson is completed', () => {
    expect(calculateProgress(lessons(true, true))).toBe(100);
  });
});

describe('applyCompletions', () => {
  it('overlays locally completed lessons without un-completing server ones', () => {
    const merged = applyCompletions(lessons(true, false, false), ['3']);
    expect(merged.map(l => l.completed)).toEqual([true, false, true]);
    expect(calculateProgress(merged)).toBe(67);
  });

  it('does not mutate the input', () => {
    const original = lessons(false);
    markLessonCompleted(original, '1');
    expect(original[0].completed).toBe(false);
  });
});

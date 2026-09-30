import { AppError, ErrorType } from '../core/errors';

const parseError = () =>
  new AppError(ErrorType.PARSE, 'We received unexpected course data.');

const clampPercent = value => Math.min(100, Math.max(0, Number(value) || 0));

export function mapCourseSummary(dto) {
  if (dto?.id == null || typeof dto.title !== 'string') {
    throw parseError();
  }
  return {
    id: String(dto.id),
    title: dto.title,
    instructor: dto.instructor ?? 'Unknown instructor',
    progress: clampPercent(dto.progress),
    lessonCount: Number(dto.lessons) || 0,
  };
}

export function mapCourseList(dto) {
  if (!Array.isArray(dto)) {
    throw parseError();
  }
  return dto.map(mapCourseSummary);
}

export function mapCourseDetails(dto) {
  if (dto?.id == null || !Array.isArray(dto.lessons)) {
    throw parseError();
  }
  return {
    id: String(dto.id),
    title: dto.title,
    instructor: dto.instructor ?? 'Unknown instructor',
    lessons: dto.lessons.map(lesson => ({
      id: String(lesson.id),
      title: lesson.title,
      completed: Boolean(lesson.completed),
    })),
  };
}

export function mapSession(dto) {
  if (!dto?.token || !dto.user?.email) {
    throw new AppError(ErrorType.PARSE);
  }
  return {
    token: dto.token,
    user: { email: dto.user.email, name: dto.user.name ?? dto.user.email },
  };
}

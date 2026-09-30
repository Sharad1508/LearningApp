import { mapCourseDetails, mapCourseList } from '../mappers';

export function createCourseApi(client) {
  return {
    fetchCourses: async () => mapCourseList(await client.get('/courses.json')),
    fetchCourseDetails: async courseId =>
      mapCourseDetails(await client.get(`/courses/${courseId}.json`)),
  };
}

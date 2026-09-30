export const config = {
  // Set to the raw URL of mock-api/ (e.g. https://raw.githubusercontent.com/<user>/LearningDashboard/main/mock-api)
  // to hit a real HTTP endpoint. When null, the bundled mock server is used.
  apiBaseUrl: null,
  requestTimeoutMs: 10000,
  mockLatencyMs: 800,
  // 'normal' | 'empty' | 'error' — lets the dashboard's empty and failure states be demoed.
  mockScenario: 'normal',
};

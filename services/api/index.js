import Reports from './reports/index.js';

const base_url = "http://localhost:1258";
export default {
  report: new Reports(base_url),
};

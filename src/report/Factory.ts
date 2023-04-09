import Test from '../Test';
import ConsoleReport from './reporters/Console';
import JUnitReport from './reporters/JUnit';

const reportMap = {
  console: ConsoleReport,
  junit: JUnitReport,
};

type Keys = keyof typeof reportMap;

export const ReporterList = Object.keys(reportMap);

/**
 * Get a reporter instance by it's name
 *
 * @param name The name of the reporter
 * @param data Test results
 * @returns Reporter instance
 */
const ReportFactory = (name: Keys, data: Test[]) => new reportMap[name](data);

export default ReportFactory;

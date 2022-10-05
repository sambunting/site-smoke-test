import Test from "../Test";
import ConsoleReport from "./reporters/Console";
import JUnitReport from "./reporters/JUnit";

const reporters: {[ key: string]: any } = {
  'console': ConsoleReport,
  'junit': JUnitReport,
}

export const ReporterList = Object.keys(reporters);

/**
 * Get a reporter instance by it's name
 *
 * @param name The name of the reporter
 * @param data Test results
 * @returns Reporter instance
 */
const ReportFactory = (name: string, data: Test[]) => new reporters[name](data);

export default ReportFactory;

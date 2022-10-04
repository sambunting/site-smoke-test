import Test from "../Test";
import ConsoleReport from "./reporters/Console";

const reporters: {[ key: string]: any } = {
  'console': ConsoleReport,
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

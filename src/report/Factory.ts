import Test from "../Test";
import ConsoleReport from "./reporters/Console";

const reporters: {[ key: string]: any } = {
  'console': ConsoleReport,
}

export const ReporterList = Object.keys(reporters);

const ReportFactory = (name: string, data: Test[]) => new reporters[name](data);

export default ReportFactory;

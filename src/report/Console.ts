import Test from "../test";
import BaseReport from "./BaseReport";

class ConsoleReport extends BaseReport {
  constructor(data: Test[]) {
    super('console', data);
  }

  execute = () => {
    this.overview();
    this.detail();
  }

  overview = () => {
    this.counts.pass && console.log(`${this.counts.pass} passes`);
    this.counts.fail && console.log(`${this.counts.fail} failures`);
    console.log('');
  }

  detail = () => {
    this.data.forEach(({ result, url, duration, errors }) => {
      console.log(`${result.toUpperCase()} - ${url} ${duration}ms`)

      if (errors.length !== 0) {
        console.log(`       Discovered ${errors.length} errors`);

        errors.forEach(({ text }, index) => {
          console.log(`       ${index + 1}. ${text}`);
        })
      }
    })
  }
}

export default ConsoleReport;

import Test from "../../Test";
import BaseReport from "../BaseReport";
import chalk from "chalk";

class ConsoleReport extends BaseReport {
  constructor(data: Test[]) {
    super('console', data);
  }

  execute = () => {
    this.overview();
    this.detail();
  }

  overview = () => {
    this.counts.pass && console.log(chalk.green.bold(`${this.counts.pass} passes`));
    this.counts.fail && console.log(chalk.red.bold(`${this.counts.fail} failures`));
    console.log('');
  }

  detail = () => {
    this.data.forEach(({ result, url, duration, errors }) => {
      const formatResult = result === 'fail' ?
        chalk.bgRed.white(result.toUpperCase()) :
        chalk.bgGreen.white(result.toUpperCase())

      console.log(`${formatResult} - ${url} ${chalk.yellow(`${duration}ms`)}`)

      if (errors.length !== 0) {
        console.log(chalk.red(`       Discovered ${errors.length} errors`));

        errors.forEach(({ text }, index) => {
          console.log(chalk.red(`       ${index + 1}. ${text}`));
        })
      }
    })
  }
}

export default ConsoleReport;

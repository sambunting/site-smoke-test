/* eslint-disable no-console */
import chalk from 'chalk';
import Test from '../../Test';
import BaseReport from '../BaseReport';

/**
 * Class for the console report which displays results in the terminal/console
 */
class ConsoleReport extends BaseReport {
  constructor(data: Test[]) {
    super('console', data);
  }

  /**
   * Execute the report
   */
  execute = () => {
    this.overview();
    this.detail();
  };

  /**
   * Create an overview which would display the overall totals for passes and failures
   */
  overview = () => {
    if (this.counts.pass) console.log(chalk.green.bold(`${this.counts.pass} passes`));
    if (this.counts.fail) console.log(chalk.red.bold(`${this.counts.fail} failures`));
    console.log('');
  };

  /**
   * Log out each test, and then log out any errors that have been caught.
   */
  detail = () => {
    this.data.forEach(({
      result, url, duration, errors,
    }) => {
      const formatResult = result === 'fail'
        ? chalk.bgRed.white(result.toUpperCase())
        : chalk.bgGreen.white(result.toUpperCase());

      console.log(`${formatResult} - ${url} ${chalk.yellow(`${duration}ms`)}`);

      if (errors.length !== 0) {
        console.log(chalk.red(`       Discovered ${errors.length} errors`));

        errors.forEach(({ text }, index) => {
          console.log(chalk.red(`       ${index + 1}. ${text}`));
        });
      }
    });
  };
}

export default ConsoleReport;

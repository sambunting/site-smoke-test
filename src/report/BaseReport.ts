import Test from "../Test";

/**
 * Base report class that initialises all reporters 
 */
class BaseReport {
  /**
   * The name of the reporter
   */
  public name: string;
  /**
   * Test data used to generate the reporter
   */
  protected data: Test[];
  /**
   * Bool on if all tests has passed or not
   */
  public overallPass: boolean;
  /**
   * Totals generated from tests
   */
  public counts: { 
    /**
     * The number of tests that have passed
     */
    pass: number,
    /**
     * The number of tests that have failed
     */
    fail: number
  };

  constructor(name: string, data: Test[]) {
    this.name = name;
    this.data = data;

    this.counts = {
      pass: this.data.filter((x) => x.result === 'pass').length,
      fail: this.data.filter((x) => x.result === 'fail').length,
    };

    this.overallPass = this.counts.fail === 0;
  }
}

export default BaseReport;

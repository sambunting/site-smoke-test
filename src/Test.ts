type TestResult = 'pass' | 'fail';

interface TestOptions {
  /**
   * The URL of the page to test
   */
  url: string
}

interface Error {
  /**
   * Message/text of the error
   */
  text: string
}

class Test {
  /**
   * The URL of the page to test
   */
  public url: string;

  /**
   * The result of the test
   */
  public result: TestResult = 'pass';

  /**
   * Array of errors caught in the console of the page
   */
  public errors: Error[] = [];

  /**
   * The timestamp the test started
   */
  public startTime: number = Date.now();

  /**
   * The timestamp the test ended
   */
  public endTime: number | null = null;

  /**
   * The duration of the test - how long the test took in milliseconds
   */
  public duration: number | null = null;

  constructor(options: TestOptions) {
    this.url = options.url;
  }

  /**
   * Fail the test
   */
  fail() {
    this.result = 'fail';
  }

  /**
   * Pass the test
   */
  pass() {
    this.result = 'pass';
  }

  /**
   * Add an error to the test
   *
   * @param error Error to add
   */
  addError = (error: Error) => {
    // If there are any errors, the test would be a failure
    this.fail();

    this.errors.push(error);
  };

  /**
   * Method to be called when the test is completed
   */
  complete = () => {
    this.endTime = Date.now();

    // Calculate the duration - how long the test ran.
    this.duration = (this.endTime - this.startTime);
  };
}

export default Test;

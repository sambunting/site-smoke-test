type TestResult = 'pass' | 'fail'

interface TestOptions {
  url: string
}  

interface Error {
  text: string
}

class Test {
  public url: string;
  public result: TestResult = 'pass';
  private errors: Error[] = [];
  public startTime: number = Date.now()
  public endTime: number | null = null;
  public duration: number | null = null;

  constructor(options: TestOptions) {
    this.url = options.url;
  }

  /**
   * Add an error to the test
   *
   * @param error Error to add
   */
  addError = (error: Error) => {
    // If there are any errors, the test would be a failure
    this.result = 'fail';

    this.errors.push(error);
  }

  /**
   * Method to be called when the test is completed
   */
  complete = () => {
    this.endTime = Date.now();

    // Calculate the duration - how long the test ran.
    this.duration = (this.endTime - this.startTime);
  }
}

export default Test;

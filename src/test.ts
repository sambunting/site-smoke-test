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

  constructor(options: TestOptions) {
    this.url = options.url;
  }

  addError = (error: Error) => {
    // If there are any errors, the test would be a failure
    this.result = 'fail';

    this.errors.push(error);
  }
}

export default Test;

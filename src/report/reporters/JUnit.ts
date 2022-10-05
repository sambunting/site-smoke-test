import Test from "../../Test";
import BaseReport from "../BaseReport";

class JUnitReport extends BaseReport {
  constructor(data: Test[]) {
    super('junit', data)
  }
  
  execute(): void {
    this.generate();
  }

  /**
   * Using the test data, create an XML structure which matches a JUnit report file
   */
  generate() {
    const returnValue: any = {
      testsuite: {
        '@@name': 'Site Smoke Test',
        '@@tests': this.data.length,
        '@@failures': this.counts.fail,
        testcase: []
      }
    }

    this.data.forEach((test) => {
      const testObject: any = {
        '@@name': test.url,
        '@@classname': test.url
      };

      if (test.errors.length > 0) {
        testObject.error = {
          '@@message': test.errors[0].text,
          '#text': test.errors[0].text
        }
      }

      returnValue.testsuite.testcase.push(testObject);
    })

    console.log('Writing JUnit report to test-results.xml');

    this.toXMLFile(returnValue, process.cwd() + '/test-results.xml');
  }
}

export default JUnitReport;

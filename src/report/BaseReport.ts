import { XMLBuilder } from 'fast-xml-parser';
import fs from 'fs';

import Test from "../Test";

/**
 * Base report class that initialises all reporters 
 */
abstract class BaseReport implements IBaseReport {
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

  /**
   * Write an object to an XML file.
   * 
   * For attributes, prepend '@@' to properties
   * For the inner-text content, use '#text' as the property
   *
   * @param data Javascript object to convert to an XML file
   * @param filePath The path and name of the file to export the content to.
   */
  toXMLFile(data: any, filePath: any) {
    const builder = new XMLBuilder({ ignoreAttributes: false, format: true, attributeNamePrefix: '@@' });
    let XMLData = builder.build(data);

    fs.writeFileSync(filePath, XMLData);
    // console.log(sampleXMLData);
  }

  /**
   * Method that is called to generate the report
   */
  abstract execute(): void;
}

export default BaseReport;

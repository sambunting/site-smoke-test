import Test from "../Test";

class BaseReport {
  public name: string;
  protected data: Test[];
  public overallPass: boolean;
  public counts: { pass: number, fail: number };

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

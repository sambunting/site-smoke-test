interface IBaseReport {
  /**
   * Method to be called when the report is ready to be created
   */
  execute: () => void
}

export default IBaseReport;

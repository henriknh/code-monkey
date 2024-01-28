import * as vscode from "vscode";

const MINUTE = 60000;
const PERIOD_LENGTH = 5000;

export class APM {
  private actionsDuringPeriod = 0;

  constructor() {
    vscode.workspace.onDidChangeTextDocument(() => this.increment());
  }

  increment() {
    this.actionsDuringPeriod++;
    setTimeout(() => this.actionsDuringPeriod--, PERIOD_LENGTH);
  }

  getApm() {
    return this.actionsDuringPeriod * (MINUTE / PERIOD_LENGTH);
  }
}

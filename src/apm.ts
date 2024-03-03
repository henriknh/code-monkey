import * as vscode from "vscode";

const MINUTE = 60000;
const RECENT_PERIOD = 5000;

export class APM {
  private actionsPerMinute = 0;
  private actionsPerPeriod = 0;
  private lastActionTimeStamp = 0;

  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.contentChanges?.[0].text.length === 1) {
          this.increment();
        }
      })
    );
  }

  increment() {
    this.actionsPerMinute++;
    this.actionsPerPeriod++;
    this.lastActionTimeStamp = performance.now();
    setTimeout(() => this.actionsPerMinute--, MINUTE);
    setTimeout(() => this.actionsPerPeriod--, RECENT_PERIOD);
  }

  getActionsPerMinute() {
    return this.actionsPerMinute;
  }

  getActionsPerPeriod() {
    return this.actionsPerPeriod;
  }

  timeSinceLastAction() {
    return performance.now() - this.lastActionTimeStamp;
  }
}

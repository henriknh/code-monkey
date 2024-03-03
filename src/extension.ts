import * as vscode from "vscode";
import { APM } from "./apm";
import { CodeMonkeyPanel } from "./code-monkey-panel";
import { StatusBarItem } from "./status-bar-item";

export function activate(context: vscode.ExtensionContext) {
  console.log("LFW: Codes for bananas is loading...");

  const apm = new APM(context);
  new StatusBarItem(context, apm);
  const codeMonkeyPanel = new CodeMonkeyPanel(context);

  setInterval(() => {
    codeMonkeyPanel.view!.webview.postMessage({
      actionsPerMinute: apm.getActionsPerMinute(),
      actionsPerPeriod: apm.getActionsPerPeriod(),
      timeSinceLastAction: apm.timeSinceLastAction(),
    });
  }, 50);

  console.log("LFW: Codes for bananas is now active!");
}

export function deactivate() {}

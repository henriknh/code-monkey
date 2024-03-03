import * as vscode from "vscode";
import { APM } from "./apm";

const UPDATE_INTERVAL = 100;

export class StatusBarItem {
  statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );

  interval: NodeJS.Timeout | undefined;

  constructor(context: vscode.ExtensionContext, public apm: APM) {
    this.statusBarItem.tooltip = "Actions per minute";

    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(
        (e: vscode.ConfigurationChangeEvent): void => this.reload()
      )
    );

    setTimeout(() => this.reload());

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "lfw-codes-for-bananas.toggleStatusBarItem",
        () => this.toggle()
      )
    );
  }

  private reload() {
    this.isEnabled ? this.show() : this.hide();
  }

  get isEnabled() {
    return vscode.workspace
      .getConfiguration("lfw-codes-for-bananas")
      .get<boolean>("showAPM", true);
  }

  toggle() {
    if (this.isEnabled) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.update();
    this.statusBarItem.show();
    clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), UPDATE_INTERVAL);
    vscode.workspace
      .getConfiguration("lfw-codes-for-bananas")
      .set("showAPM", true);
  }

  hide() {
    this.statusBarItem.hide();
    clearInterval(this.interval);
    vscode.workspace
      .getConfiguration("lfw-codes-for-bananas")
      .set("showAPM", false);
  }

  update() {
    this.statusBarItem.text = `$(record-keys) ${this.apm.getActionsPerMinute()}`;
  }
}

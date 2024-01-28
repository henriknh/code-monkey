import * as vscode from "vscode";
import { APM } from "./apm";

const UPDATE_INTERVAL = 100;

export class StatusBarItem {
  visible = true;

  statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );

  interval: NodeJS.Timeout | undefined;

  constructor(context: vscode.ExtensionContext, public apm: APM) {
    this.statusBarItem.tooltip = "Actions per minute";
    this.show();

    context.subscriptions.push(
      vscode.commands.registerCommand("code-monkey.toggleStatusBarItem", () => {
        this.toggle();
      })
    );
  }

  private toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  private show() {
    this.update();
    this.statusBarItem.show();
    clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), UPDATE_INTERVAL);
    this.visible = true;
  }

  private hide() {
    this.statusBarItem.hide();
    clearInterval(this.interval);
    this.interval = undefined;
    this.visible = false;
  }

  update() {
    this.statusBarItem.text = `$(record-keys) ${this.apm.getApm()}`;
  }
}

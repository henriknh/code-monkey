import * as vscode from "vscode";

export class CodeMonkeyPanel {
  provider: CodeMonkeyViewProvider;

  constructor(context: vscode.ExtensionContext) {
    this.provider = new CodeMonkeyViewProvider(context.extensionUri);
    const disposableWebviewViewProvider =
      vscode.window.registerWebviewViewProvider(
        CodeMonkeyViewProvider.viewType,
        this.provider
      );
    context.subscriptions.push(disposableWebviewViewProvider);

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "lfw-codes-for-bananas.hireCodeMonkey",
        () => vscode.commands.executeCommand("code-monkey-workspace.focus")
      )
    );
  }

  get view() {
    return this.provider._view;
  }
}

export class CodeMonkeyViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "code-monkey-workspace";

  _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent();

    webviewView.webview.onDidReceiveMessage((data) => {
      console.log("onDidReceiveMessage", data);
    });
  }

  getWebviewContent() {
    const resourcePath = this._view!.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources")
    );
    const styleUri = vscode.Uri.joinPath(resourcePath, "style.css");
    const scriptUri = vscode.Uri.joinPath(resourcePath, "script.js");
    const bananaUri = vscode.Uri.joinPath(resourcePath, "icons", "banana.png");
    const deskUri = vscode.Uri.joinPath(resourcePath, "monkeys", "desk.png");
    const armLeftUri = vscode.Uri.joinPath(
      resourcePath,
      "monkeys",
      "arm_left.png"
    );
    const armRightUri = vscode.Uri.joinPath(
      resourcePath,
      "monkeys",
      "arm_right.png"
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <head>
        <link href="${styleUri}" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Roboto Slab' rel='stylesheet'>
      </head>
      <body>
        <!--<div class="top" style="display: 'none';">
          <div id="pomodoro" style="display: 'flex';">
            <div class="minutes">
              <div id="pomodoro-first-minute" class="digit">2</div>
              <div id="pomodoro-second-minute" class="digit">5</div>
            </div>
            <div class="divider">:</div>
            <div class="seconds">
              <div id="pomodoro-first-second" class="digit">0</div>
              <div id="pomodoro-second-second" class="digit">0</div>
            </div>
          </div>
  
          <div id="bananas" style="display: 'none';">
            <img class="img-banana" src="${bananaUri}" />
            <div id="banana-count">123</div>
          </div>
        </div>
  
        <div id="pause" style="display: 'none';">
          <div>BANANA PAUSE</div>
  
          <div class="pause-timer">
            <div class="minutes">
              <div id="pause-first-minute" class="digit">2</div>
              <div id="pause-second-minute" class="digit">5</div>
            </div>
            <div class="divider">:</div>
            <div class="seconds">
              <div id="pause-first-second" class="digit">0</div>
              <div id="pause-second-second" class="digit">0</div>
            </div>
          </div>
  
          <div class="bananas">
            <img class="banana" src="${bananaUri}" />
          </div>
        </div>-->
  
        <div class="bottom">
          <div class="container">
            <img class="img-desk" src="${deskUri}" />
            <div id="monkey-arm-left" class="monkey-arm" style="transform: translateY(100px);">
              <img id="arm-animation-left" class="arm-animation" src="${armLeftUri}" />
            </div>
            <div id="monkey-arm-right" class="monkey-arm" style="transform: translateY(100px);">
              <img id="arm-animation-right" class="arm-animation" src="${armRightUri}" />
            </div>
          </div>
        </div>
  
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

import fs = require('fs');
import path = require('path');
import {
  TextDocumentContentProvider,
  Uri,
} from 'vscode';

export class HTMLPreview implements TextDocumentContentProvider {
  public html: string = '';
  private port: number;
  public constructor(public uri: Uri = Uri.parse('sqltools://')) {
  }
  public provideTextDocumentContent(uri: Uri): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body, iframe {
      width: 100%;
      height: 100%;
    }
    body, iframe {
      margin: 0;
      overflow: hidden;
    }
    iframe {
      display: block;
      position: absolute;
      visibility: visible;
    }
  </style>
</head>
<body>
  <iframe
    frameborder="0"
    sandbox='allow-scripts allow-top-navigation allow-same-origin allow-forms'
    id="sql-tools-api"
    src="http://localhost:${this.port}/#${uri.fragment}"
  >
  </iframe>
  <script type="text/javascript">
    var vscodeClass = document.getElementsByTagName('body')[0].className
    var vscodeDefault = document.getElementById('_defaultStyles')
    var iframe = document.getElementById('sql-tools-api')
    iframe.onload = function () {
      iframe = (iframe = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument).document;
      var head = iframe.getElementsByTagName('head')[0]
      head.insertBefore(vscodeDefault, head.childNodes[0])
      iframe.getElementsByTagName('body')[0].className = vscodeClass + ' iframe-loaded'
    }
  </script>
</body>
</html>
`;
  }

  public setPort(port: number) {
    this.port = port;
  }
}

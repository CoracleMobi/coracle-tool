'use babel';

import path from 'path';

Shell = require('shell')

let _webviewElement = null;

const _handlerKeyboardEvent = function() {
  _webviewElement.addEventListener('keydown', (event) => {
    let needSent = true;
    let keyCodeAccelerator;

    if (event.keyCode === 8) {
      keyCodeAccelerator = 'Backspace';
    } else {
      needSent = false;
    }

    needSent && _webviewElement.sendInputEvent({
        type: 'keyDown',
        keyCode: keyCodeAccelerator
    });
  });
};

export default class WebView{
  constructor(props) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('co-webview-container');

    // Create webview element
    _webviewElement = document.createElement('webview');
    _webviewElement.style.height = '100%';
    console.log(path.resolve('./coracle-webview-preload.js').split(path.sep).join(path.posix.sep))
    console.log(path.join(__dirname,'coracle-webview-preload.js'));
    _webviewElement.setAttribute('preload', path.join(__dirname,'coracle-webview-preload.js'));
    _webviewElement.src = props.uri;
    this.element.appendChild(_webviewElement);

    _handlerKeyboardEvent();

  }

  setUri(uri){
    _webviewElement.src = uri;
  }

  // Tear down any state and detach
  destroy() {
    var pane = atom.workspace.getActivePane();
    pane.destroyItem(this);
    // 如果当前窗口容器中只有文档视图，那么把容器都销毁掉
    if (pane.getItems().length === 0) {
        pane.destroy();
    }
  }

  getWebVieElement(){
    return _webviewElement;
  }

  getTitle() {
    const urlSrc = _webviewElement.src.split('/').pop();
   if(urlSrc === 'login'){
        return '登录页';
   } else if (urlSrc === 'welcome.html') {
        return '欢迎页';
   } else if (urlSrc === 'project.html') {
        return '创建应用'
   } else if (urlSrc === 'sync.html') {
        return '同步应用'
   } else if (urlSrc === 'compile'){
        return '云编译'
   }
    return 'webview';
  }

  addIpcMessageListener(channel, handler) {
    _webviewElement.addEventListener('ipc-message', (event) => {
      if (event.channel ===  channel) {
        handler.apply(_webviewElement, event.args);
      }
    });
  }

}

'use babel';

import CompletionProvider from './completion-provider';

const pxPattern = /\d+px/gm;
const remPattern = /(\d+\.\d+|\.\d+)rem/gm;

class Px2rem {
  config = {
    baseSize: {
      title: 'Default Base Size',
      description: 'This will change the base size to convert px to rem.',
      type: 'integer',
      default: 37.5,
      minimum: 1,
    },
    ellipsis:{
        default: 3
    }
  };

  activate() {
    const _this = this;

    atom.commands.add('atom-workspace', 'px2rem:convert', function () {
      _this.convert();
    });
    atom.commands.add('atom-workspace', 'px2rem:recovery', function () {
      _this.recovery();
    });

    this.completionProvider = new CompletionProvider();
  }

  deactivate() {
    delete this.completionProvider;
    this.completionProvider = null;
  }

  provide() {
    return this.completionProvider;
  }

  recovery() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    let pxNum;
    let remNum;
    let size = atom.config.get('px2rem.baseSize');

    editor.scan(remPattern, function (obj) {
      remNum = parseFloat(obj.match[0].replace(/\s+/g), '');
      pxNum = Math.round(remNum * size);
      obj.replace(pxNum + 'px');
    });
  }

  convert() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    let pxNum;
    let remNum;

    editor.scan(pxPattern, function (obj) {
      pxNum = parseFloat(obj.match[0].replace(/\s+/g), '');

      // 1px 不转换为 rem
      if (pxNum <= 1) {
        return false;
      }

      remNum = pxNum / atom.config.get('px2rem.baseSize');
      remNum = parseFloat(remNum.toFixed(3));
      obj.replace(remNum + 'rem');
    });
  }

}

export default new Px2rem();

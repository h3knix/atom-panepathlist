'use babel';

import { CompositeDisposable } from 'atom';
const moment = require('moment');

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'panepathlist:generatelist': () => this.generatelist()
      ,'panepathlist:openlist': () => this.openlist()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  generatelist() {
    let paths = [];
    let editors = atom.workspace.getTextEditors();
    for(let t of editors){
      if ( t.getPath ) {
        let p = t.getPath();
        if ( p ) {
          p = atom.project.relativizePath(p);
          if ( p && p.length > 1 ) p = p[1];
          if ( p )
          paths.push(p);
        }
      }
    }
    atom.workspace.open().then((new_editor)=>{
      if ( new_editor ) {
        if ( paths.length ) new_editor.setText(paths.join("\n"));
        else new_editor.setText('No paths');
      }
    });
  },

  openlist() {
    let editor = atom.workspace.getActiveTextEditor();
    if ( editor ) {
      let max = 100;
      let line_count = editor.getScreenLineCount();
      if ( line_count > 0 ) {
        if ( line_count > max ) {
          line_count = max;
          alert('Only opening max of '+ max +' files');
        }
        for(let i = 0; i < line_count; i++){
          let p = editor.lineTextForScreenRow(i);
          console.log(p);
          p = p +'';p = p.trim();
          if ( p !== '' ) {
            atom.workspace.open(p);
          }
        }
      }

    }
  }

};

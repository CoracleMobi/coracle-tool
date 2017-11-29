'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';


export default class CoracleSVN {
  constructor(items) {
    this.items = items;
    this.emitter = new Emitter();
    etch.initialize(this);
    this.initProjects();
  }

  render(){
      return (
        <div className='svn'>
          <TextEditor mini ref='search' />
          <ul className='listView' ref='list'>
          </ul>
        </div>
      )
  }

  update () {}

  getElement(){
    return this.element;
  }

  initProjects(){
    for(const projects of this.items){
      const li = document.createElement('li');
      li.innerHTML = projects.projectName;
      li.onclick = this.didSelectItemAction.bind(this,projects);
      this.refs.list.appendChild(li);
    }
  }

  didSelectItem(callback){
    this.emitter.on('didSelectItem',callback);
  }

  didSelectItemAction(projects){
    this.emitter.emit('didSelectItem',projects);
  }

}

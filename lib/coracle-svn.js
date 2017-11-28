'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';


export default class CoracleSVN {
  constructor() {

  }

  render(){
      return (
        <div className='svn'>
          <TextEditor mini ref='search' />
          <ul className='list'>
            <li class="mobile_item"><a>ايفون ٧ بلس</a></li>
            <li class="mobile_item"><a>ايفون 6s</a></li>
            <li class="mobile_item"><a>ايفون 5s</a></li>
            <li class="mobile_item"><a>سامسونج s7</a></li>
            <li class="mobile_item"><a>ايفون ٧اس</a></li>
            <li class="mobile_item"><a>سامسونج j7</a></li>
            <li class="mobile_item"><a>سامسونج s4</a></li>
            <li class="mobile_item"><a>ايفون ٧اس</a></li>
          </ul>
        </div>
      )
  }

  update () {}

  getElement(){
    return this.element;
  }



}

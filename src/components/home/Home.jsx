import React from 'react';
import { Post } from '../post/Post';
import { Story } from '../story/Story';
import { Users } from '../users/Users';
import { StickyNotes } from '../stickynotes/StickyNotes';
import { Test } from '../../test/Test';
import { CopyToClipboard } from '../copytoclipboard/CopyToClipboard';


export const Home = props => {
  return (
    <div className='home'>
      {/* <CopyToClipboard /> */}
      {/* <Test /> */}
      <Story />
      {/* <StickyNotes /> */}
      <div className="content" style={{ display: "flex" }}>
        <div className="div">
          <Post />
        </div>
        <div className="suggested-for-user">
          <Users />
        </div>
      </div>
    </div>
  )
}



import React from 'react';
import ReactDOM from 'react-dom';
import State from './State';
import './index.css';

ReactDOM.render(
  <State
    init={ me => {
      me.state = { count: 0 };
      me.handleClick = o=> me.setState({ count: me.state.count + 1 });
    }}
  >
    { me => <div>
      <button onClick={me.handleClick}>
        click
      </button>
      {me.state.count}
    </div>}
  </State>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import State from './State';
import './index.css';

import { observable, action, extendObservable, computed, autorun, createTransformer } from 'mobx';
import { observer, Observer } from 'mobx-react';


const listItemStore = {
  selected: false,
  name: 'untitled',
  toggle: action.bound(function(){
    this.selected = !this.selected;
  })
};

const ListItem = observer(class ListItem extends React.Component {
  static defaultProps = {
    observed: observable(listItemStore)
  }

  render(){ //console.log('item', this.observedStore.name, this.observedStore.selected)
    return <div onClick={this.props.observed.toggle}
      style={{ background: this.props.observed.selected? 'pink': 'gray' }}
    >
      {this.props.observed.name}
    </div>;
  }

  componentDidUpdate(prevProps){
    console.log('hm', prevProps.observed === this.props.observed)
  }
});

/*class ListStore {
  constructor() {
    extendObservable(this, {
      items: [
        { id: 1, name: 'bay' },
        { id: 2, name: 'zoo' }
      ],
      selectedItemId: null,
      listItems: computed(function(){
        const self = this;
        return this.items.map(
          item => ({
            id: item.id,
            name: item.name,
            selected: item.id === this.selectedItemId,
            toggle: action.bound(function(){
              self.selectedItemId = item.id;
            })
          })
        );
      })
    })
  }
  getListItem = createTransformer(index => {
    console.log('le items', this.items);
    this.items[index];
  });
}*/

const listStore = observable({
  items: [
    { id: 1, name: 'bay' },
    { id: 2, name: 'zoo' }
  ],
  selectedItemId: null,
  get listItems(){
    const self = this;
    return this.items.map(
      item => ({
        id: item.id,
        name: item.name,
        selected: item.id === this.selectedItemId,
        toggle: o=>{
          this.selectedItemId = item.id;
        }
      })
    );
  },
});



const getListItems = createTransformer(
  store => store.items.map(
    item => ({
      id: item.id,
      name: item.name,
      selected: item.id === store.selectedItemId,
      toggle: action.bound(function(){
        store.selectedItemId = item.id === store.selectedItemId? null: item.id;
      })
    })
  )
);
  /*toggle: action.bound(function(){
    store.selectedItemId = item.id;
    console.log(store.selectedItemId, item.id)
  })
  /*getItem: createTransformer(index){
    const item = item[]
    return {
      name: item.name,
      selected: item.id === store.selectedItemId,
      toggle: action.bound(function(){
        store.selectedItemId = item.id;
        console.log(store.selectedItemId, item.id)
      })
    };
  }*/


//const renderItem =

const List = observer(class List extends React.Component {
  static defaultProps = {
    observed: observable(listStore)
  }

  componentDidMount(){
    autorun(o=>{
      console.log(getListItems(this.props.observed)[0]);
    });
  }

  render(){
    return <div>
      {getListItems(this.props.observed).map(
        (listItem, i) => <ListItem key={listItem.id}
          observed={listItem}
        />
      )}

      <ListItem />

      {this.props.observed.selectedItemId}
    </div>;
  }
});

const pageStore = {
  pageIndex: 0,
  changePage: action.bound(function(){
    this.pageIndex = this.pageIndex? 0: 1;
  }),
  listStore
}

const Page = ({ store = observable(pageStore) }) => <Observer>
  {o=> <div>
    {store.pageIndex === 0? <div>yup yup</div>: <List store={store.listStore} />}
    <button onClick={store.changePage}>Change Page</button>
    {store.pageIndex}
  </div>}
</Observer>;


ReactDOM.render(
  <Page />,
  document.getElementById('root')
);


/*
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
*/

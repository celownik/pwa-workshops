import React, { Fragment, Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import List from './List';
import EmptyPage from './EmptyPage';
import TabBar from './TabBar';
import ItemShow from './ItemShow';
import Toast from './Toast';
import { AnimatedSwitch } from './AnimatedSwitch';

class App extends Component {
  state = {
    wines: [],
  };

  componentDidMount() {
    this.getData();
    this.updateOnlineStatus();
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  };

  updateOnlineStatus = () => {
    this.setState({isOnline: navigator.onLine });
  };

  getData = () => {
    fetch('https://api-wine.herokuapp.com/api/v1/wines')
      .then(res => res.json())
      .then(data => {
        this.setState({ wines: data });
      })

  };

  renderContent() {
    if (!this.state.wines.length) {
      return <div />;
    }

    return (
      <Fragment>
        <AnimatedSwitch>
          <Route exact path="/" component={() => <List items={this.state.wines} />} />
          <Route path="/wine/:id" component={() => <ItemShow items={this.state.wines} />} />
          <Route path="/wishlist" component={EmptyPage} />
          <Route path="/cellar" component={EmptyPage} />
          <Route path="/articles" component={EmptyPage} />
          <Route path="/profile" component={EmptyPage} />
        </AnimatedSwitch>
        <TabBar />
      </Fragment>
    );
  }

  render() {
    return (
      <Router>
        <Fragment>
          {!this.state.isOnline ? <Toast text="offline" /> : null}

          {this.renderContent()}

        </Fragment>
      </Router>
    );
  }
}

export default App;

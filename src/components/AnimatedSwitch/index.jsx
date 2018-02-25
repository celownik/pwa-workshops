import React from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Switch, withRouter } from "react-router-dom";
import './style.scss';


export const AnimatedSwitch = withRouter(({ children, location }) => (
  <TransitionGroup>
    <CSSTransition
      key={location.key}
      classNames="fade"
      timeout={500}
    >
      <Switch location={location}>
        {children}
      </Switch>
    </CSSTransition>
  </TransitionGroup>
));

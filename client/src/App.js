import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import PushAsset from './pages/PushAsset';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/new-asset' component={PushAsset} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

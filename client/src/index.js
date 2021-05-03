import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks';

import App from './App';
import './index.css';
// import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// serviceWorker.unregister();

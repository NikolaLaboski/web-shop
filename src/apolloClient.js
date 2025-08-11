// src/apolloClient.js 
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://scandi-shop-backend-production.up.railway.app/graphql', // без '/'
  cache: new InMemoryCache(),
});


export default client;

// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = '/graphql'; 

export default new ApolloClient({
  link: new HttpLink({ uri, credentials: 'include' }),
  cache: new InMemoryCache(),
});

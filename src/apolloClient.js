import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost/backend/graphql/index.php',
  cache: new InMemoryCache(),
});

export default client;

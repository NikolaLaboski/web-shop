// src/apolloClient.js 
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri =
  import.meta.env.VITE_API_URL ||                  
  'http://localhost/backend/graphql/index.php';    


const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});

export default client;

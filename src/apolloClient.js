import { ApolloClient, InMemoryCache } from '@apollo/client';

let uri = '/graphql'; // default преку Netlify proxy

if (typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    uri.startsWith('http:')) {
  uri = '/graphql';
}

console.log('Apollo URI =', uri); 
export default new ApolloClient({ uri, cache: new InMemoryCache() });
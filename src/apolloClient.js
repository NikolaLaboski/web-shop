import { ApolloClient, InMemoryCache } from '@apollo/client';

const uri = import.meta.env.VITE_API_URL ?? '/graphql'; // default: proxy преку Netlify
export default new ApolloClient({ uri, cache: new InMemoryCache() });

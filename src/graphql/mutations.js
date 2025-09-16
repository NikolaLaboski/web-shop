// src/graphql/mutations.js
import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation Place($items: [OrderItemInput!]!) {
    createOrder(items: $items)
  }
`;

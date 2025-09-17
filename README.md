
# Web Shop – Full-Stack Solution

## Overview
A full-stack e-commerce application built with:
- **Backend**: PHP (Carcass) + GraphQL
- **Frontend**: React (Vite, Apollo Client)
- **Database**: MySQL

The project demonstrates a clean architecture, use of OOP principles (inheritance, abstraction, polymorphism), and a frontend implementation aligned with Figma designs.


## Backend

### OOP & Polymorphism
- `ProductInterface` defines the contract for all product types.
- `AbstractProduct` implements shared logic.
- Specialized classes (`TechProduct`, `ClothingProduct`, `AccessoryProduct`) override behavior.
- **Polymorphism**: Higher layers operate against `ProductInterface`, independent of concrete product type.

### GraphQL Schema
- **Queries**
  - `products: [Product!]!`
  - `product(id: String!): Product`
- **Mutation**
  - `createOrder(items: [OrderItemInput!]!): Boolean!`
- **Types**
  - `Product`, `AttributeSet`, `Price`, `OrderItemInput`

### Example Mutation
```graphql
mutation Place($items: [OrderItemInput!]!) {
  createOrder(items: $items)
}
Frontend
Functionality
Product Page

Image gallery with thumbnails

Attribute selection (size, capacity, color)

Sanitized product descriptions (HTML rendering with DOMPurify)

Cart Overlay

Add/remove items, quantity updates

Highlight selected attributes

Place order (calls GraphQL mutation, clears cart, closes overlay)

Category Page

Responsive grid (3-column → 2-column → 1-column)

Out-of-stock badge with dimmed image

Hover "Add to Cart" button with correct z-index

Styling aligned with Figma (spacing, font sizes, proportions)

Key Fixes
Removed redundant checkout step → orders placed directly from cart overlay.

Attribute highlighting fixed for size, capacity, and color.

Category page restyled per Figma feedback.

Add-to-cart button visibility corrected (hover effect works as intended).

Database
Tables: products, attributes, attribute_items, prices, orders, order_items

Fix: order_items.product_id changed to VARCHAR to support string IDs like apple-iphone-12-pro.

Deployment
Backend: Railway (PHP, MySQL addon)

Frontend: Netlify (Vite build + redirects to Railway /graphql)

QA Checklist
Attribute highlighting in cart

Category page styling aligned with Figma

Product description renders HTML markup

Order mutation implemented and functional

Cart clears after order placement

Extra checkout step removed

OOP principles (inheritance, polymorphism) demonstrated
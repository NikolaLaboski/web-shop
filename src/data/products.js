const products = [
  {
    id: 1,
    name: "T-Shirt Basic",
    category: "Apparel",
    price: 19.99,
    image: "/images/tshirt.jpg",
    inStock: true,
    attributes: {
      size: ["S", "M", "L"],
      color: ["Red", "Green", "Blue"],
    },
    description: "A basic t-shirt for everyday comfort.",
  },
  {
    id: 2,
    name: "Sneakers Pro",
    category: "Footwear",
    price: 79.99,
    image: "/images/sneakers.jpg",
    inStock: false,
    attributes: {
      size: ["38", "39", "40", "41"],
      color: ["Black", "White"],
    },
    description: "Durable sneakers ideal for running and training.",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 59.99,
    image: "/images/headphones.jpg",
    inStock: true,
    attributes: {
      color: ["Black", "Silver"],
    },
    description: "Enjoy music wirelessly with noise-cancelling tech.",
  },
  {
    id: 4,
    name: "Backpack Urban",
    category: "Accessories",
    price: 34.99,
    image: "/images/backpack.jpg",
    inStock: true,
    attributes: {
      color: ["Gray", "Navy", "Beige"],
    },
    description: "Sleek backpack with multiple compartments.",
  },
  {
    id: 5,
    name: "Classic Watch",
    category: "Accessories",
    price: 99.99,
    image: "/images/watch.jpg",
    inStock: false,
    attributes: {
      color: ["Black", "Brown"],
    },
    description: "Stylish and timeless analog watch for all outfits.",
  },
];

export default products;

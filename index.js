const express = require('express');
const cors = require('cors');
const path = require('path');
const products = require('./db');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

function getImages(productName) {
  return Array(5)
    .fill(0)
    .map((name, index) => `http://localhost:${PORT}/images/${productName}-${index + 1}.jpg`);
}

// API GET /product
app.get('/product', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = {
    currentPage: page,
    totalItems: products.length,
    totalPages: Math.ceil(products.length / limit),
    data: products.map(item => ({ ...item, images: getImages(item.name.split(' ')[0].toLocaleLowerCase()) })).slice(startIndex, endIndex),
  };

  res.json(result);
});

// API GET /product/:id
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({
    ...product,
    images: getImages(product.name.split(' ')[0].toLocaleLowerCase()),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

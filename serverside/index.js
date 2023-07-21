import express from 'express';
import { connect, Schema, model } from 'mongoose';
// import { get } from 'axios';
import { load } from 'cheerio';
import {dbConnection} from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection

dbConnection()

const productSchema = new Schema({
  title: String,
  image: String,
  rating: String,
  price: String,
  finalPrice: String,
  source: String,
});

const Product = model('Product', productSchema);

// Scraping function for Flipkart
const scrapeFlipkart = async () => {
  try {
    const response = await get('https://www.flipkart.com');
    const $ = load(response.data);

    // Extract product details
    const products = [];
    $('.product').each((index, element) => {
      const title = $(element).find('.title').text();
      const image = $(element).find('.image').attr('src');
      const rating = $(element).find('.rating').text();
      const price = $(element).find('.price').text();
      const finalPrice = $(element).find('.final-price').text();

      products.push({
        title,
        image,
        rating,
        price,
        finalPrice,
        source: 'flipkart',
      });
    });

    // Save products to the database
    await Product.insertMany(products);
  } catch (error) {
    console.error('Error scraping Flipkart:', error);
  }
};

setInterval(() => {
  scrapeFlipkart();
 }, 12 * 60 * 60 * 1000);

const scrapeAmazon = async () => {
  try {
    const response = await get('https://www.amazon.com');
    const $ = load(response.data);

    const products = [];
    $('.product').each((index, element) => {
      const title = $(element).find('.title').text();
      const image = $(element).find('.image').attr('src');
      const rating = $(element).find('.rating').text();
      const price = $(element).find('.price').text();
      const finalPrice = $(element).find('.final-price').text();

      products.push({
        title,
        image,
        rating,
        price,
        finalPrice,
        source: 'amazon',
      });
    });

    await Product.insertMany(products);
  } catch (error) {
    console.error('Error scraping Amazon:', error);
  }
};

setInterval(() => {
  scrapeAmazon();
  }, 12 * 60 * 60 * 1000);
  
  
  const scrapeSnapdeal = async () => {
  try {
    const response = await get('https://www.snapdeal.com');
    const $ = load(response.data);

    const products = [];
    $('.product').each((index, element) => {
      const title = $(element).find('.title').text();
      const image = $(element).find('.image').attr('src');
      const rating = $(element).find('.rating').text();
      const price = $(element).find('.price').text();
      const finalPrice = $(element).find('.final-price').text();

      products.push({
        title,
        image,
        rating,
        price,
        finalPrice,
        source: 'snapdeal',
      });
    });

    await Product.insertMany(products);
  } catch (error) {
    console.error('Error scraping Snapdeal:', error);
  }
};

setInterval(() => {
  scrapeSnapdeal();
  }, 12 * 60 * 60 * 1000);


// API endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }

    const products = await Product.find(query).limit(10);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

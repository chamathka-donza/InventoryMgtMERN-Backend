const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const locationRoutes = require('./routes/locationRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

dotenv.config(); // Load enviroment variables

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/vendors', vendorRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
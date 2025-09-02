const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
const scansRoutes = require('./routes/scans');


app.use('/api/auth', authRoutes);
app.use('/api/scans', scansRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
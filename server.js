import { connect } from 'mongoose';
import express from 'express';
const app = express()

const PORT = 3000;
connect('mongodb://localhost:27017/GO')
  .then(() => {console.log('Connected to MongoDB ✅');})
  .then(() => {app.listen(PORT, () => {console.log(`App is running on port ${PORT}`);});})
.catch((err) => {console.error('Error connecting to MongoDB: ', err);});

export default app;
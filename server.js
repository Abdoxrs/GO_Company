import { connect } from 'mongoose';
import express from 'express';
const app = express()

connect('mongodb://localhost:27017/GO')
  .then(() => {console.log('Connected to MongoDB ✅');})
.catch((err) => {console.error('Error connecting to MongoDB: ', err);});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
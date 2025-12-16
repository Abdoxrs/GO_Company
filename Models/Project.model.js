import mongoose, { mongo } from 'mongoose'

const projectSchema = new mongoose.Schema({
  name :{
    type : String,
    required : true
  },
  location:{
    type : String
  }
})

projectSchema.index({number:1});

export default mongoose.model('project', projectSchema);
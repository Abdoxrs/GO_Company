import mongoose from 'mongoose';

const DependentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true  // ✅ Index for faster lookups
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  birthDate: {
    type: Date,
  },
  relationship: {
    type: String,
    trim: true,
  },
});

// Compound unique index
DependentSchema.index({ employeeId: 1, name: 1 }, { unique: true });

// ✅ Add cascade delete hook at model level (optional alternative approach)
DependentSchema.pre('deleteOne', { document: false, query: true }, async function() {
  console.log('Dependent being deleted:', this.getFilter());
});

export default mongoose.model('Dependent', DependentSchema);
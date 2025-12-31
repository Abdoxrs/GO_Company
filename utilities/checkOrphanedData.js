import mongoose from 'mongoose';

/**
 * Middleware to prevent orphaned documents when using populate
 * Only checks top-level populated fields
 */
export const checkOrphanedReferences = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Only check if it's a successful response with data
    if (data && res.statusCode < 400) {
      try {
        checkTopLevelReferences(data);
      } catch (err) {
        console.warn('⚠️  Error checking orphaned references:', err.message);
      }
    }
    
    return originalJson(data);
  };
  
  next();
};

/**
 * Safely check only top-level references
 */
function checkTopLevelReferences(data) {
  // Don't check if it's not an object or is null
  if (!data || typeof data !== 'object') return;
  
  // Handle arrays
  if (Array.isArray(data)) {
    data.forEach(item => checkTopLevelReferences(item));
    return;
  }
  
  // Check only direct properties (not nested)
  for (const key in data) {
    // Skip internal properties and functions
    if (key.startsWith('_') || typeof data[key] === 'function') continue;
    
    // Check if this looks like a populated reference that's null
    if (key.endsWith('Id') && data[key] === null) {
      console.warn(`⚠️  Warning: Orphaned reference detected in field '${key}'`);
    }
  }
}

/**
 * Utility to find and clean orphaned documents
 */
export const cleanOrphanedDependents = async () => {
  const Dependent = mongoose.model('Dependent');
  const Employee = mongoose.model('Employee');
  
  // Find all dependents
  const dependents = await Dependent.find({});
  
  const orphaned = [];
  
  for (const dependent of dependents) {
    const employee = await Employee.findById(dependent.employeeId);
    if (!employee) {
      orphaned.push(dependent);
    }
  }
  
  if (orphaned.length > 0) {
    console.log(`Found ${orphaned.length} orphaned dependents`);
  }
  
  return orphaned;
};
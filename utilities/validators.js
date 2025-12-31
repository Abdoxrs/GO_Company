import mongoose from 'mongoose';
import ApiError from './ApiError.js';

/**
 * Validates that a document exists in the database
 * @param {Model} Model - Mongoose model to check
 * @param {ObjectId} id - Document ID to validate
 * @param {string} entityName - Name for error message
 */
export const validateDocumentExists = async (Model, id, entityName = 'Document') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${entityName} ID format`, 400);
  }
  
  const exists = await Model.findById(id);
  if (!exists) {
    throw new ApiError(`${entityName} not found`, 404);
  }
  
  return exists;
};

/**
 * Validates that multiple documents exist
 * @param {Model} Model - Mongoose model to check
 * @param {Array<ObjectId>} ids - Array of document IDs
 * @param {string} entityName - Name for error message
 */
export const validateDocumentsExist = async (Model, ids, entityName = 'Documents') => {
  const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid ${entityName} ID format: ${invalidIds.join(', ')}`, 400);
  }
  
  const documents = await Model.find({ _id: { $in: ids } });
  
  if (documents.length !== ids.length) {
    const foundIds = documents.map(doc => doc._id.toString());
    const missingIds = ids.filter(id => !foundIds.includes(id.toString()));
    throw new ApiError(`${entityName} not found: ${missingIds.join(', ')}`, 404);
  }
  
  return documents;
};
import Dependent from '../Models/dependents.model.js';
import Employee from '../Models/employees.model.js';
import ApiFeatures from '../utilities/ApiFeatures.js';
import { validateDocumentExists } from '../utilities/validators.js';

const createDependent = async (data) => {
  // ✅ Validate that employee exists before creating dependent
  await validateDocumentExists(Employee, data.employeeId, 'Employee');
  
  return Dependent.create(data);
};

const getDependents = (queryParams) => {
  const query = Dependent.find({}).populate('employeeId', 'ssn name');
  const apiFeature = new ApiFeatures(query, queryParams);
  apiFeature.paginate();
  apiFeature.sort();
  apiFeature.projection();
  return apiFeature.dbQuery;
};

const getDependentById = (id) => Dependent.findById(id).populate('employeeId', 'ssn name');

const updateDependent = async (id, updated) => {
  // ✅ If updating employeeId, validate new employee exists
  if (updated.employeeId) {
    await validateDocumentExists(Employee, updated.employeeId, 'Employee');
  }
  
  return Dependent.findByIdAndUpdate(id, updated, { 
    new: true, 
    runValidators: true 
  }).populate('employeeId', 'ssn name');
};

const deleteDependentById = (id) => Dependent.findByIdAndDelete(id);

// ✅ New: Delete all dependents for a specific employee
const deleteDependentsByEmployeeId = (employeeId) => {
  return Dependent.deleteMany({ employeeId });
};

export {
  createDependent,
  getDependents,
  getDependentById,
  updateDependent,
  deleteDependentById,
  deleteDependentsByEmployeeId
};
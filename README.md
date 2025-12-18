# Employee Management System API

A RESTful API built with Node.js, Express, and MongoDB for managing employees, departments, projects, and dependents.

## 🚀 Features

- **CRUD Operations** for all resources (Employees, Departments, Projects, Dependents)
- **Pagination** - Navigate through large datasets
- **Sorting** - Order results by multiple fields
- **Field Projection** - Select specific fields to return
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Consistent error responses
- **Database Indexes** - Optimized queries

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/GO
```

4. Start MongoDB:
```bash
mongod
```

5. Run the application:
```bash
# Development mode (with auto-restart)
npm run start:dev

# Production mode
npm run start:prod
```

## 📚 API Endpoints

### Employees
- `POST /employees` - Create a new employee
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Departments
- `POST /departments` - Create a new department
- `GET /departments` - Get all departments
- `GET /departments/:id` - Get department by ID
- `PATCH /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Projects
- `POST /projects` - Create a new project
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Dependents
- `POST /dependents` - Create a new dependent
- `GET /dependents` - Get all dependents
- `GET /dependents/:id` - Get dependent by ID
- `PATCH /dependents/:id` - Update dependent
- `DELETE /dependents/:id` - Delete dependent

## 🔍 Query Parameters

### Pagination
```
GET /employees?pageNumber=1&pageSize=10
```
- `pageNumber` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)

### Sorting
```
GET /employees?sort=salary,-bdate
```
Allowed sort combinations:
- `salary,bdate`
- `-salary,-bdate`
- `salary,-bdate`
- `-salary,bdate`

Use `-` prefix for descending order.

### Field Projection
```
GET /employees?project=name,salary,sex
```
Returns only the specified fields.

## 📝 Request Examples

### Create Employee
```bash
POST /employees
Content-Type: application/json

{
  "ssn": "123-45-6789",
  "name": {
    "fname": "John",
    "minit": "M",
    "lname": "Doe"
  },
  "bdate": "1990-01-15",
  "address": "123 Main St, City",
  "sex": "Male",
  "salary": 50000
}
```

### Create Department
```bash
POST /departments
Content-Type: application/json

{
  "number": 1,
  "name": "Research",
  "locations": ["Cairo", "Alexandria"]
}
```

### Create Project
```bash
POST /projects
Content-Type: application/json

{
  "number": 1,
  "name": "E-Commerce Platform",
  "location": "Cairo"
}
```

### Create Dependent
```bash
POST /dependents
Content-Type: application/json

{
  "employeeId": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "sex": "Female",
  "birthDate": "2015-03-20",
  "relationship": "Daughter"
}
```

## 🔐 Data Validation

### Employee Constraints
- `ssn` - Required, unique, trimmed
- `name.fname` - Required
- `name.lname` - Required
- `name.minit` - Optional, max 1 character
- `sex` - Must be "Male" or "Female"
- `salary` - Required, minimum 0

### Department Constraints
- `number` - Required, unique
- `name` - Required
- `locations` - Array of strings

### Project Constraints
- `number` - Required, unique
- `name` - Required
- `location` - Optional

### Dependent Constraints
- `employeeId` - Required, must reference existing employee
- `name` - Required
- `sex` - Must be "Male" or "Female"
- Unique combination of (employeeId, name)

## ⚠️ Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Duplicate key (409)
- `BAD_REQUEST` - Invalid request format
- `INTERNAL_ERROR` - Server error (500)

## 🗂️ Project Structure

```
project/
├── src/
│   ├── Controllers/
│   │   ├── Emps.controller.js
│   │   ├── Deps.controller.js
│   │   ├── Projs.controller.js
│   │   └── Departments.controller.js
│   ├── Models/
│   │   ├── Emps.model.js
│   │   ├── Deps.model.js
│   │   ├── Project.model.js
│   │   └── Dependent.model.js
│   ├── Routers/
│   │   ├── Emps.router.js
│   │   ├── Deps.router.js
│   │   ├── Projs.router.js
│   │   └── Dependents.router.js
│   ├── middlewares/
│   │   └── middleware.js
│   └── utilities/
│       └── ApiFeatures.js
├── App.js
├── server.js
└── package.json
```

## 🐛 Known Issues & Fixes

### Fixed Issues:
1. ✅ Typo in `Deps.controller.js` - Changed `req.pody` to `req.query`
2. ✅ Missing `number` field in Project model
3. ✅ Missing routes for Projects and Dependents in App.js
4. ✅ Added global error handler
5. ✅ Added 404 handler

## 🧪 Testing

You can test the API using:
- **Postman** - Import the endpoints and test
- **cURL** - Command line testing
- **Thunder Client** - VS Code extension

Example cURL:
```bash
# Get all employees
curl http://localhost:3000/employees

# Create employee
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -d '{"ssn":"123-45-6789","name":{"fname":"John","lname":"Doe"},"salary":50000,"sex":"Male"}'
```

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: Make sure MongoDB is running before starting the application.

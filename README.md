# Lost & Found Management System

A full-stack web application that helps users report lost and found items, browse available items, submit claims, and manage their reports. An admin panel is included to manage users, items, reports, and claims.

## Features

### User

* User registration and login
* JWT-based authentication
* Report lost items
* Report found items
* Browse lost and found items
* Search and filter items
* View item details
* Submit claims for found items
* View personal reports
* View personal claims
* Track claim status

### Admin

* Admin authentication and authorization
* View registered users
* Block and unblock users
* View lost and found reports
* Manage reported items
* View and manage claims
* Approve or reject claims
* Dashboard with platform statistics

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt.js

### Database

* PostgreSQL

### Tools

* Git & GitHub
* Thunder Client
* VS Code

## Project Structure

```text
lost_and_found/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── route/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── Admin/
│   ├── Auth/
│   ├── User/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── .gitignore
└── README.md
```

## Main User Flow

```text
Register
   ↓
Login
   ↓
User Dashboard
   ↓
Report Lost / Found Item
   ↓
Browse Items
   ↓
View Item Details
   ↓
Submit Claim
   ↓
Admin Reviews Claim
   ↓
Approve / Reject
```

## Admin Flow

```text
Admin Login
   ↓
Admin Dashboard
   ├── Manage Users
   ├── Manage Reports
   ├── Manage Items
   └── Manage Claims
```

## API Modules

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Items

```text
POST   /api/items
GET    /api/items
GET    /api/items/:id
GET    /api/items/my-items
PUT    /api/items/:id
DELETE /api/items/:id
```

### Claims

```text
POST /api/claims
GET  /api/claims/my-claims
GET  /api/claims
PUT  /api/claims/:id
```

### Users

```text
GET /api/users
PUT /api/users/:id/status
```

## Authentication

The application uses JWT authentication to protect private routes.

Passwords are securely hashed using bcrypt before being stored in the database.

Admin-only routes are protected using role-based authorization.

## Database

The application uses PostgreSQL with tables for:

* Users
* Items
* Claims

Relationships between users, items, and claims are maintained using foreign keys.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/tanuthormise-crypto/lost_found.git
cd lost_found
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=lost_found
DB_PASSWORD=your_database_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

### 4. Start the backend

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Open the frontend

Open:

```text
frontend/index.html
```

in your browser.

## Testing

API endpoints were tested using Thunder Client.

The project includes testing for:

* User registration
* User login
* Authentication
* Admin authorization
* Item creation
* Item retrieval
* Item update
* Item deletion
* Searching and filtering
* Claim submission
* Claim approval/rejection
* User blocking/unblocking

## Security

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Blocked-user validation
* Environment variables for sensitive configuration

## Future Improvements

* Image upload for lost and found items
* Email notifications
* Advanced item search
* Location-based search
* Deployment with a cloud database
* Real-time notifications

## Author

**Tanuja Prakash Thormise**

BCS Student | Full-Stack Web Development

## Project

**Lost & Found Management System**

Built using HTML, CSS, JavaScript, Bootstrap, Node.js, Express.js and PostgreSQL.

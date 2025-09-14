# Zen Dojo Server

A Node.js/Express server for managing Zen Dojo classes, users, and payments with proper MVC architecture and Mongoose ODM.

## Project Structure

```
zen-dojo-server/
├── config/
│   └── database.js          # Mongoose database connection and configuration
├── controllers/
│   ├── userController.js    # User business logic
│   ├── classController.js   # Class management logic
│   └── paymentController.js # Payment and Stripe integration
├── models/
│   ├── User.js             # User Mongoose model
│   ├── Class.js            # Class Mongoose model
│   └── Payment.js          # Payment Mongoose model
├── schemas/
│   ├── userSchema.js       # User Mongoose schema with validation
│   ├── classSchema.js      # Class Mongoose schema with validation
│   └── paymentSchema.js    # Payment Mongoose schema with validation
├── routes/
│   ├── userRoutes.js       # User API routes
│   ├── classRoutes.js      # Class API routes
│   ├── paymentRoutes.js    # Payment API routes
│   └── index.js            # Main routes file
├── middleware/
│   └── index.js            # Common middleware setup
├── .env                    # Environment variables
├── index.js                # Main application entry point
└── package.json            # Dependencies and scripts
```

## Features

- **User Management**: Create, read, update, and delete users with validation
- **Class Management**: Handle pending, approved, selected, and enrolled classes
- **Payment Processing**: Stripe integration for secure payments
- **MVC Architecture**: Clean separation of concerns
- **Mongoose ODM**: Robust data modeling with validation and middleware
- **Schema Validation**: Built-in data validation and type checking
- **Environment Configuration**: Secure configuration management
- **Error Handling**: Comprehensive error handling and logging
- **Soft Deletes**: Data preservation with soft delete functionality
- **Virtual Fields**: Computed properties and data transformation

## API Endpoints

### User Routes
- `GET /gettingUserInfo` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /updateUserInfo/:id` - Update user information
- `PUT /updateUserStatus/:id` - Update user status
- `DELETE /users/:id` - Delete user

### Class Routes
- `POST /pending_classes` - Create pending class
- `GET /getting_pending_classes` - Get all pending classes
- `DELETE /delete_class_from_pending_class/:id` - Delete pending class
- `POST /approve_class` - Approve a class
- `GET /getting_approved_classes` - Get all approved classes
- `DELETE /denied_from_approved_class/:id` - Delete approved class
- `POST /selected_class` - Select a class
- `GET /getting_selected_class` - Get all selected classes
- `DELETE /delete_class/:id` - Delete selected class
- `GET /getEnrolledClasses` - Get all enrolled classes

### Payment Routes
- `POST /process_payment` - Process payment and create enrollment
- `POST /create_payment_intent` - Create Stripe payment intent
- `GET /payments` - Get all payments
- `GET /payments/email/:email` - Get payments by email
- `PUT /payments/:paymentId/status` - Update payment status
- `GET /verify_payment/:paymentIntentId` - Verify payment with Stripe

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CORS_ORIGIN=*
```

## Database Collections (Mongoose Models)

- **Users** - User information with email validation and status management
- **Classes** - Class information with status tracking (pending, approved, selected, completed)
- **Payments** - Payment records with Stripe integration and refund support

### Schema Features:
- **Validation**: Built-in field validation with custom error messages
- **Indexes**: Optimized database queries with proper indexing
- **Virtuals**: Computed fields like `seatsRemaining` and `netAmount`
- **Methods**: Instance methods for common operations
- **Statics**: Class methods for complex queries
- **Middleware**: Pre/post hooks for data processing

## Architecture Benefits

1. **Separation of Concerns**: Models handle data, controllers handle business logic, routes handle HTTP requests
2. **Mongoose ODM**: Robust data modeling with built-in validation, middleware, and query building
3. **Schema Validation**: Automatic data validation with custom error messages
4. **Type Safety**: Strong typing and validation at the database level
5. **Maintainability**: Easy to modify and extend individual components
6. **Testability**: Each layer can be tested independently
7. **Scalability**: Easy to add new features without affecting existing code
8. **Code Reusability**: Models and controllers can be reused across different routes
9. **Error Handling**: Centralized error handling and logging with Mongoose validation errors
10. **Configuration Management**: Environment-based configuration for different deployment stages
11. **Data Integrity**: Built-in constraints and validation ensure data consistency
12. **Performance**: Optimized queries with indexes and population

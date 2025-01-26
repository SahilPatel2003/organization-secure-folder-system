# Organization Drive Backend - Role-Based Folder Management System

This repository hosts the backend for a secure, role-based file and folder management system. It provides functionality for admins to manage folder hierarchies, assign roles with permissions, and ensure robust access control for organizational users.

## Features

### User and Admin Management
- **Admin Registration**: Admins register and invite users via email with permissions included.
- **User Login**: Users can log in only after accepting the invite; self-registration is not allowed.
- **Multi-Admin Support**: Each organization can have multiple admins and users.
- **Block Users**: Admins can block users, restricting them from performing any actions.
- **Forgot Password**: Secure password reset with email token expiration and time-limited link.

### Folder and File Management
- **Folder Hierarchy**: Admins can create folder hierarchies and add files to folders.
- **Role-Based Permissions**: Admins define roles with permissions (read, create, move, delete).
- **Permission Enforcement**: Middleware checks for valid permissions before any action.
- **Permission Adjustments**: If a folder is moved and permissions are lost for the parent folder, permissions for the moved folder are revoked.
- **Default Read Access**: All users have read access to any folder by default.

### File Uploads and Downloads
- **File Links**: Users can upload a file link during creation and download the file as needed.

### Middleware and Validations
- **Permission Checks**: Middleware ensures users have the required permissions for every action.
- **Validations**: Built-in validation using `joi` for secure input handling.

### Testing and Architecture
- **Clean Code Architecture**: Designed for maintainability and scalability.
- **Test Coverage**: Comprehensive test cases written using `cucumber`, `chai`, and `sinon`.
- **Database Migrations**: Migration folder for creating tables.

### Security
- **Session Timeout**: Session limits for logged-in users and admins.
- **Token Expiration**: Reset password tokens expire after a single use.

## Technology Stack
- **Backend**: Node.js with HTTP
- **Testing**: Cucumber, Chai, Sinon
- **Validation**: Joi
- **Database**: PostgreSQL (with migrations)

## Getting Started

### Prerequisites
- Node.js installed on your machine
- PostgreSQL database set up


## Employee-Registrstion with Node and firebase
- This application was made to keep track of employees in a company
- It utilises Firebase to keep track of the employees 
- A admin to manage other admins 

## LogIn Credentials

    username: 'admin',
    password: 'admin123',
These credentials are the the Top/ Super Admin

## Installation
rounded-systems/employee-register
- npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom axios 
- npm install moment
moment is used for date format
rounded-systems/server
- npm install express nodemon
- npm install nodemon -D

## Run react & node
- npm run dev

## Requirements
## Search Function:
- Users can search for employees by ID.

## Add Function:
- Users can add a new employee with the following details:
- Name
- Email Address
- Phone Number
- Image
- Position
- ID

## Delete Function: 
- Users can delete existing employees.

## Update Function: 
- Users can edit existing employee details.

## General Requirements for Both Applications:
- Implemented CRUD (Create, Read, Update, Delete) operations for bookmarks/employees.
- The app is responsive.
Provide a sketch or mockup using any platform you are comfortable with, such as Figma, free-hand on paper, etc.
![alt text](image.png)

## Objective:
- The objective of this project is to introduce Node.js to an earlier project, mainly the employee app done for React.js. - Node.js will be used for the backend and to save data.

## Features:
- Server side running on Node.js
- Client side running on React.js

## Firebase
- Firebase admin for data and file storage
- A page to add new employees
- A page to view all existing employees
- The details for the employee consist of the following
- Name and surname
- Age
- ID number
- PhotoRole in company
- A feature to update existing employees
- A feature to delete existing employees
- A feature to search for employee by their ID
- A page for the admin to login using email and password
- A page for the admin to add other admins
- A page for the admin to remove admin rights from the other added admins
- A page for the logged in admin to view their profile details
- Name and surname
- Age
- ID number
- Photo
- Role in company (by default main admin is sysadmin)

## Persistence:
- The firebase admin SDK should be used to persist data in between sessions and from different devices.
- Firestore for data
- Storage for files
- Auth for manage user sessions

## Testing:
- Test the application thoroughly to ensure that all features work as expected 

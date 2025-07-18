# 📇 Contact Manager Web App

A full-stack Contact Manager web application that allows users to securely add, view, edit, and delete their contacts. Each contact can include details like photo, phone number, email, address, birthday, gender, relation, city, and country.

## 🚀 Features

- User registration and login with session-based authentication
- Add, view, edit, and delete contacts
- Upload contact photos
- View detailed info for each contact
- Fake data generation with Faker for testing
- Responsive design using Bootstrap

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Other Tools**: 
  - `multer` for photo upload
  - `express-session` for session management
  - `method-override` for supporting PUT/DELETE requests
  - `@faker-js/faker` for seeding fake contacts


## 📂 Folder Structure

  project-root/
│
├── models/ # Mongoose schemas (Contact, User)
├── public/ # Static assets (CSS, images, uploads)
│ └── uploads/ # Uploaded photos
├── views/ # EJS templates
├── server.js # Main server file
├── package.json
├── .gitignore
└── README.md


## 📸 Screenshots

_Add screenshots of your app here if desired (e.g., home page, add contact page, contact detail view)._

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suleman-badar/Contact-App.git
cd contact-App
2. Install Dependencies
``bash

npm install
3. Start MongoDB
Make sure MongoDB is running locally. By default, it connects to:

mongodb://127.0.0.1:27017/contactsDB
If needed, update the connection string in server.js.

4. Run the App
node server.js

Then open your browser and go to:
http://localhost:8080

🧪 Seeding Fake Data
When the app starts, it automatically seeds 20 fake contacts using @faker-js/faker.


✅ To Do / Improvements
Add OTP verification for user signup/login

Add password hashing for better security

Enable search and filter functionality

Implement pagination for large contact lists

🧑‍💻 Author
Suleman Butt
Built using the MERN stack (without React) for learning and portfolio building.

📄 License
This project is open-source and free to use.

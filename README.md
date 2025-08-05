#  Contact Manager Web App

A full-stack Contact Management Web App built using Node.js, Express, MongoDB, and EJS. It allows users to manage personal contacts with features such as image uploads, contact grouping via folders, editing, deletion, and detailed views.

##  Features

 Add, edit, and delete contacts

 Create folders to organize contacts

 Upload profile pictures (Cloudinary integration)

 View individual contact details

 Update contact information

 Delete single or multiple contacts

 Folder-based contact filtering

 Full backend with Express & MongoDB



## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Other Tools**: 
  - `cloudinary` for photo upload
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
├── cloudinaryConfig.js
└── .env
└── README.md


##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suleman-badar/Contact-App.git
cd contact-App
2. Install Dependencies
npm install

3. Create a .env file in the root directory and add:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_secret

4. Run the App
node server.js

Then open your browser and go to:
http://localhost:8080


# To Do / Improvements
Add OTP verification for user signup/login

Folder sharing or collaboration

Implement pagination for large contact lists

# Author
Suleman Butt
Built using the MERN stack (without React) for learning and portfolio building.

# License
This project is open-source and free to use.

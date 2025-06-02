## Capstone Project


**RoadMap For Capstone Project**

 ## Overview

This website Evento primarily serves as a platform for showcasing events or shows happening at universities or other locations. The main highlight of this app, in my opinion, is the feature that allows users to see the interests of their friends or other people regarding the events they prefer or are interested in.
Additionally, you can view events curated specifically for you based on your previous interests or inquiries. The platform also lets you filter events by location, whether within your university or elsewhere.
Moreover, the website includes a community setup where users can express their interests in events or share reviews about them.




## Phase 1: Planning and Setup						[week 1- week 2]

Requirement Gathering:
Define core features: event browsing, searching, filtering, booking, user profiles, admin panel, etc.
Create wireframes or mockups of the UI.

Tech Stack:
Frontend: React.js
Backend: Node.js with Express.js
Database: MongoDB
State Management: Redux (optional)
Authentication: JWT

Environment Setup:
Install Node.js, MongoDB, and code editor (e.g., VS Code).
Initialize the project using npm init and set up the folder structure.



## Phase 2: Backend Development				[week 1 - week 2 ]

Initialize the Backend:
Create an Express.js server.
Set up basic routes and middlewares.
Connect to MongoDB using Mongoose.

Build RESTful APIs:
Users: Register, login, and profile management.
Events: Create, read, update, delete (CRUD) for events.
Bookings: API to book events and view bookings.

Authentication:
Use JWT for secure user authentication.
Set up middleware to protect routes.

Validation and Error Handling:
Use libraries like express-validator to validate user inputs.
Implement global error handling.




## Phase 3: Frontend Development				[week 3 - week 6]
Set Up React:
Create a new React app using create-react-app or Vite.
Set up folder structure for components, pages, and assets.

Create UI Components:
Reusable components like Navbar, Footer, Event Cards, Buttons, Modals.

Pages:
Home: Event categories, search bar, trending events.
Explore: Event listing with filters.
Event Details: Detailed view of an event with booking options.
Profile: User information and bookings.

Integrate APIs:
Use Axios or Fetch to connect the frontend to the backend APIs.
Handle loading states and error messages.

State Management:
Use Context API or Redux to manage global state (e.g., user authentication).



## Phase 4: Deployment						[week 6 - week 7]

Backend:
Host the Node.js server and MongoDB on platforms like cloudflare, or Render.
Use services like MongoDB Atlas for the database.

Frontend:
Deploy the React app on Vercel or Netlify.

Environment Variables:
Store sensitive information (e.g., database URI, JWT secret) securely using .env files.



## Phase 5: Testing and Optimization				[week 7 - week 8]

Testing:
Unit tests for components and APIs.
End-to-end testing for the full user flow.

Optimization:
Optimize images and code splitting for frontend performance.
Indexing and query optimization for MongoDB.

Bug Fixing:
Test with multiple users to identify bugs and gather feedback.



## Backend Deploy Link 
## for new pr
    **https://s62-james-capstone-evento.onrender.com** 


## Frontend Deploy Link
    **https://evennto.netlify.app/**
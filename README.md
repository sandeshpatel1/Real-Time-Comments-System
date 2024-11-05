Backend Setup
Database Setup
Create a MySQL Database:

Open your MySQL command line or a GUI tool (like MySQL Workbench).
Run the following command to create a new database:
sql
Copy code
CREATE DATABASE comments_db;
Create a Table for Comments:

Switch to your newly created database:
sql
Copy code
USE comments_db;
Create a table to store comments:
sql
Copy code
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
Configure Environment Variables:

Create a .env file in your backend directory with the following variables:
env
Copy code
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=comments_db
SOCKET_PORT=4000
Replace your_mysql_username and your_mysql_password with your MySQL credentials.
Running the Backend
Install Backend Dependencies:

Navigate to your backend directory:
bash
Copy code
cd path/to/your/backend
Install the required dependencies:
bash
Copy code
npm install
Run the Backend Server:

Start the server:
bash
Copy code
npm start
The server will run on http://localhost:4000.
Frontend Setup
Running the Frontend
Install Frontend Dependencies:

Usage
Open your browser and go to http://localhost:3000.
If you haven't set a username, you will be redirected to the login page. Enter a username to proceed.
You can now submit comments, and they will appear in real-time for all users connected to the same page.
Assumptions
The database is assumed to be installed locally and accessible via the provided host and credentials.
The backend server is assumed to be running on port 4000, and the frontend on port 3000. Adjust the configurations if necessary.
Socket.IO is used for real-time updates, and both frontend and backend should be able to communicate over WebSocket.
It is assumed that the user has a basic understanding of using MySQL and managing environment variables.
Ensure that CORS policies are properly configured on the backend if you are accessing it from different origins.
Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussion.

License
This project is licensed under the MIT License.

sql
Copy code

### Notes
1. **Database Credentials**: Ensure you replace placeholder values like `your_mysql_username` and `your_mysql_password` with actual values when configuring the environment variables.
2. **Assumptions**: Modify any assumptions to fit your specific project context.
3. **Instructions**: Make sure the paths to your backend and frontend directories are accurate.
4. **Running Instructions**: The commands to start the backend and frontend assume a standard Node.js setup; adjust if your setup differs.

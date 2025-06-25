# 🏥 Hospital Appointment Booking System

This project is a web-based Hospital Appointment Booking System designed to streamline the appointment process between patients and doctors. It includes user-friendly interfaces for login, appointment scheduling, and information about services and medical staff.

## 🚀 Features

- User Login & Logout
- Appointment Booking Form
- Doctor Profiles
- Contact Form
- About Us & Services Pages
- Welcome Page with Appointment Summary
- Responsive and modern UI design
- Backend integration using `server.js`

## 🗂️ Project Structure

```
public/
├── .env                     # Environment configuration (e.g., MongoDB URI)
├── aboutus.html             # About Us page
├── appointment.html         # Appointment booking form
├── contact.html             # Contact Us form
├── doctor1.html             # Doctor profile page
├── hospital logo.jpg        # Logo image
├── index.html               # Landing page (homepage)
├── login-form.html          # Login form
├── logout.html              # Logout logic
├── server.js                # Node.js backend handling appointments
├── services.html            # List of hospital services
├── welcome.html             # Welcome page after login/appointment
```

## 🛠️ Technologies Used

- HTML5, CSS3, JavaScript
- Node.js with Express (server.js)
- MongoDB (configured in `.env`)
- Bootstrap (for styling and responsiveness)

## 🧪 How to Run the Project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd public
```

### 2. Install Dependencies

Make sure you have Node.js installed. Then run:

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the `public` folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 4. Start the Server

```bash
node server.js
```

### 5. Open in Browser

Visit `http://localhost:5003` to use the system.

## 📧 Contact

For support or feedback, please contact: ** contact@hospital.com**

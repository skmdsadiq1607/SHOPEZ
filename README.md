# Google Drive Folder Link
[ShopEZ Google Drive Folder](https://drive.google.com/drive/u/5/folders/1IPXMZ00el6i0gN8FOdz_S8F7f8bAjL6C)

---

# ShopEZ E-Commerce Application

ShopEZ is a full-stack MERN (MongoDB, Express, React, Node.js) online shopping application featuring a premium, responsive e-commerce catalog layout (INR ₹ pricing), interactive cart management, variant selectors, secure checkout simulation, and a robust Seller Admin Dashboard with total sales analytics and listing managers.

## Setup Instructions

### 1. Root & Concurrently Scripts
Install concurrently at the root directory:
```bash
npm install
```
This automatically runs `postinstall` to download backend dependencies.

### 2. Seeding Products & Admin
Seed your MongoDB database with the 20 products and default administrator profile:
```bash
cd backend
npm run seed
```

### 3. Run Locally (Concurrent Backend & Frontend Dev)
From the root directory:
```bash
npm start
```
This launches:
* Backend API on `http://localhost:5000`
* Frontend client on `http://localhost:5173`

---

## Admin Credentials
* **Email:** `admin@shopez.com`
* **Password:** `admin123`

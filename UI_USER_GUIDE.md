# FarmXChain - Complete UI User Guide

**Platform URL:** http://localhost:5173

---

## 🎯 Quick Start Guide

### Step 1: Access the Platform
1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You'll see the landing page with "Login" and "Register" options

---

## 👤 User Registration & Login

### Register a New Account

1. **Click "Register"** on the landing page
2. **Fill in the registration form:**
   - Name: Your full name
   - Email: Valid email address
   - Password: Secure password
   - **Select Role:** FARMER, DISTRIBUTOR, RETAILER, CONSUMER, or ADMIN
3. **Click "Register"**
4. You'll be redirected to login page

### Login to Your Account

1. **Click "Login"** on the landing page
2. **Enter credentials:**
   - Email
   - Password
3. **Click "Login"**
4. You'll be redirected to your role-specific dashboard

---

## 🌾 FARMER User Journey

### After Login (First Time)

**Dashboard:** `/dashboard`

#### Step 1: Complete Your Farmer Profile
1. **Click "Farm Identity"** in the navbar
2. **Fill in your farm details:**
   - Farm Name
   - Phone Number
   - Location
   - State & District
   - Land Area (with unit: Acres/Hectares)
   - Primary Crop
   - Soil Type
   - Bank Details (optional):
     - Bank Name
     - Account Number
     - IFSC Code
3. **Click "Save Profile"**
4. **Wait for admin approval** (status shows "Pending Approval")

#### Step 2: List Your Crops (After Approval)
1. **Navigate to Dashboard** → Click "List New Crop"
2. **Fill in crop details:**
   - Crop Name (e.g., "Wheat", "Rice", "Tomatoes")
   - Quantity (in kg)
   - Price per kg (₹)
   - Harvest Date
   - Location
   - Quality Grade (A, B, C)
   - Description
3. **Click "List Crop"**
4. Your crop is now **registered on blockchain** and visible in marketplace

#### Step 3: Manage Your Crops
1. **Click "My Crops"** in navbar
2. **View all your listed crops:**
   - Available crops (for sale)
   - Sold crops
   - Crop details
3. **Actions available:**
   - Edit crop details
   - Mark as unavailable
   - Delete crop

#### Step 4: Manage Orders (Sales)
1. **Click "Sales"** in navbar (or `/sales`)
2. **View incoming orders:**
   - Pending orders (waiting for your acceptance)
   - Accepted orders
   - Completed orders
3. **Accept an order:**
   - Click "Accept" on pending order
   - Order status changes to "ACCEPTED"
4. **Complete an order:**
   - Click "Complete" after delivery
   - Ownership transfers on blockchain

#### Step 5: View Your Analytics
1. **Click "Analytics"** in navbar
2. **View your performance:**
   - Total Income (₹)
   - Total Orders
   - Average per Order
   - Sales by Crop Type (Bar Chart)
   - Sales Distribution (Pie Chart)
3. **Click "Refresh Analytics"** to update data

#### Step 6: Create Shipment (Optional)
1. After accepting an order
2. Navigate to order details
3. Click "Create Shipment"
4. Track shipment status

---

## 🚚 DISTRIBUTOR User Journey

### After Login

**Dashboard:** `/dashboard`

#### Step 1: Browse Marketplace
1. **Click "Marketplace"** in navbar
2. **View available crops from farmers:**
   - Crop name, quantity, price
   - Farmer details
   - Quality grade
   - Location
3. **Filter crops:**
   - By crop type
   - By price range
   - By location

#### Step 2: Purchase Crops from Farmers
1. **Click on a crop** to view details
2. **Enter quantity** to purchase
3. **Click "Place Order"**
4. **Wait for farmer to accept**
5. Order status: PENDING → ACCEPTED → COMPLETED

#### Step 3: List Crops for Retailers
1. After receiving crops from farmers
2. **Navigate to Dashboard** → "List Crop"
3. **List crops for retailers:**
   - Set your selling price
   - Add markup
   - Specify quantity available
4. **Click "List Crop"**

#### Step 4: Manage Your Orders
1. **As Buyer:**
   - Click "Orders" → "My Purchases"
   - View orders from farmers
   - Track delivery status
2. **As Seller:**
   - Click "Sales"
   - View orders from retailers
   - Accept/Complete orders

#### Step 5: View Analytics
1. **Click "Analytics"** (if available for your role)
2. View:
   - Purchase analytics
   - Sales analytics
   - Profit margins

#### Step 6: Track Shipments
1. Navigate to order details
2. View shipment tracking information
3. See real-time location and status

---

## 🏪 RETAILER User Journey

### After Login

**Dashboard:** `/dashboard`

#### Step 1: Browse Marketplace
1. **Click "Marketplace"** in navbar
2. **View crops from distributors:**
   - Filtered by your role (only distributor listings)
3. **Select crops** to purchase

#### Step 2: Purchase from Distributors
1. **Click on crop** to view details
2. **Enter quantity**
3. **Click "Place Order"**
4. **Wait for distributor acceptance**

#### Step 3: List Crops for Consumers
1. After receiving crops from distributors
2. **List crops for consumers:**
   - Set retail price
   - Specify quantity
3. **Click "List Crop"**

#### Step 4: Manage Orders
1. **As Buyer:**
   - View purchases from distributors
   - Track delivery
2. **As Seller:**
   - View orders from consumers
   - Accept/Complete orders

#### Step 5: View Analytics
1. Check sales performance
2. View profit margins
3. Track inventory

---

## 🛒 CONSUMER User Journey

### After Login

**Dashboard:** `/dashboard`

#### Step 1: Browse Marketplace
1. **Click "Marketplace"** in navbar
2. **View crops from retailers:**
   - Fresh produce
   - Prices
   - Quality information

#### Step 2: Purchase Products
1. **Select a crop** to purchase
2. **Enter quantity**
3. **Click "Place Order"**
4. **Wait for retailer acceptance**

#### Step 3: Track Your Orders
1. **Click "Orders"** in navbar
2. **View order status:**
   - Pending
   - Accepted
   - In Transit
   - Delivered

#### Step 4: Verify Product Journey (QR Code)
1. **Scan QR code** on product packaging (or enter crop ID)
2. **Navigate to:** `/trace/{cropId}`
3. **View complete journey:**
   - Farm origin
   - Harvest date
   - All ownership transfers
   - Blockchain verification ✓
   - Transaction history
4. **See QR code** for sharing

#### Step 5: View Product Traceability
1. Click on any crop in your orders
2. View "Product Journey"
3. See:
   - Farmer details
   - Distributor chain
   - Retailer information
   - Blockchain verification badge
   - Temperature/humidity logs (if available)

---

## 👨‍💼 ADMIN User Journey

### After Login

**Admin Dashboard:** `/admin-dashboard`

#### Step 1: Verify Farmers
1. **Click "Audits"** in navbar (or `/farmer-verification`)
2. **View pending farmer registrations:**
   - Farmer name
   - Farm details
   - Land area
   - Documents
3. **Review each farmer:**
   - Check farm details
   - Verify documents
4. **Actions:**
   - Click "Approve" to verify farmer
   - Click "Reject" if details are incorrect
5. **Approved farmers** can now list crops

#### Step 2: Manage Users
1. **Click "User Logic"** in navbar (or `/user-management`)
2. **View all users:**
   - Name, email, role
   - Account status
3. **Actions:**
   - Enable/Disable users
   - View user details
   - Filter by role

#### Step 3: View Platform Analytics
1. **Click "Analytics"** in navbar (or `/admin/analytics`)
2. **View comprehensive metrics:**
   - Total Users
   - Total Farmers
   - Total Orders
   - Total Crops
   - **Supply Chain Performance:**
     - Fulfillment Rate
     - Transaction Volume
   - **Demand Trends Chart** (Bar chart)
   - **Pricing Trends Chart** (Bar chart)
3. **Click refresh** to update data

#### Step 4: Manage Disputes
1. **Click "Disputes"** in navbar (or `/admin/disputes`)
2. **View all disputes:**
   - Dispute ID
   - Order ID
   - Reported by
   - Reported against
   - Reason & Description
   - Status (OPEN, UNDER_REVIEW, RESOLVED, CLOSED)
3. **Filter disputes:**
   - Click status buttons (ALL, OPEN, UNDER_REVIEW, RESOLVED, CLOSED)
4. **Resolve a dispute:**
   - Click "Resolve Dispute" button
   - Enter resolution details
   - Click "Submit Resolution"
   - Dispute status changes to RESOLVED

#### Step 5: Generate Reports
1. **Navigate to Admin Dashboard**
2. **Click "Generate Report"** (or use API endpoints)
3. **Select report type:**
   - User Activity Report
   - Transaction Report
   - Supply Chain Report
   - Dispute Report
4. **View generated reports**
5. **Download/Export** (if implemented)

#### Step 6: Monitor System Statistics
1. **Click "Statistics"** in navbar (or `/statistics`)
2. **View platform metrics:**
   - Total users by role
   - Verified vs unverified farmers
   - Order statistics
   - Revenue metrics
3. **Real-time dashboard** with cards and charts

---

## 🔄 Common User Flows

### Flow 1: Farm to Consumer (Complete Supply Chain)

1. **FARMER:**
   - Lists crop (e.g., 100kg Wheat @ ₹30/kg)
   - Crop registered on blockchain

2. **DISTRIBUTOR:**
   - Browses marketplace
   - Orders 100kg Wheat from farmer
   - Farmer accepts order
   - Receives shipment
   - Lists 80kg Wheat @ ₹35/kg for retailers

3. **RETAILER:**
   - Orders 80kg from distributor
   - Distributor accepts
   - Receives shipment
   - Lists 50kg @ ₹40/kg for consumers

4. **CONSUMER:**
   - Orders 5kg from retailer
   - Retailer accepts
   - Receives product
   - Scans QR code to verify journey
   - Sees complete blockchain-verified path

### Flow 2: Dispute Resolution

1. **User (any role):**
   - Has issue with an order
   - Navigates to order details
   - Clicks "Create Dispute"
   - Fills in reason and description
   - Submits dispute

2. **ADMIN:**
   - Receives dispute notification
   - Reviews dispute details
   - Investigates both parties
   - Enters resolution
   - Closes dispute

### Flow 3: Product Verification

1. **Consumer receives product** with QR code
2. **Scans QR code** or visits `/trace/{cropId}`
3. **Views complete journey:**
   - Blockchain verification badge ✓
   - Farmer origin
   - All ownership transfers
   - Transaction dates
   - Current status
4. **Trusts the product** authenticity

---

## 📱 Navigation Reference

### Navbar Links by Role

**FARMER:**
- Overview (Dashboard)
- My Crops
- Analytics ⭐ NEW
- Farm Identity

**DISTRIBUTOR/RETAILER:**
- Overview (Dashboard)
- Marketplace
- Orders
- Sales

**CONSUMER:**
- Overview (Dashboard)
- Marketplace
- Orders

**ADMIN:**
- Overview (Dashboard)
- Audits (Farmer Verification)
- Analytics ⭐ NEW
- Disputes ⭐ NEW
- User Logic (User Management)

---

## 🎨 UI Features

### Modern Design Elements
- ✨ Glassmorphism cards
- 📊 Interactive charts (Recharts)
- 🎯 Color-coded status badges
- 🔄 Real-time data refresh
- 📱 Responsive design
- 🌈 Gradient backgrounds
- ⚡ Smooth animations

### Status Indicators
- 🟢 **Green** - Approved, Completed, Verified
- 🟡 **Yellow** - Pending, Under Review
- 🔴 **Red** - Rejected, Failed, Open Dispute
- 🔵 **Blue** - In Progress, In Transit

---

## 🔐 Security Features

- 🔒 JWT token-based authentication
- 🛡️ Role-based access control
- 🚫 Protected routes (auto-redirect if unauthorized)
- 🔑 Secure password storage (BCrypt)
- ⏱️ Session management

---

## 💡 Pro Tips

1. **Farmers:** Complete your profile immediately for faster approval
2. **All Sellers:** Set competitive prices based on market analytics
3. **Buyers:** Check product journey before purchase for quality assurance
4. **Admins:** Regularly check pending verifications and disputes
5. **Everyone:** Use analytics to make data-driven decisions

---

## 🆘 Troubleshooting

**Can't login?**
- Check email and password
- Ensure account is enabled (contact admin)

**Farmer profile not saving?**
- Fill all required fields
- Check internet connection

**Can't see crops in marketplace?**
- Ensure you're logged in with correct role
- Farmers can only sell to distributors
- Distributors sell to retailers
- Retailers sell to consumers

**Order not appearing?**
- Refresh the page
- Check "Orders" or "Sales" section
- Verify order status

**Analytics not loading?**
- Click refresh button
- Ensure you have transaction history

---

## 📞 Support

For technical issues:
- Check browser console for errors
- Verify backend is running (port 8080)
- Verify frontend is running (port 5173)
- Contact system administrator

---

**Last Updated:** February 6, 2026  
**Version:** 1.0.0  
**Platform:** FarmXChain - Blockchain-Powered Agriculture Supply Chain

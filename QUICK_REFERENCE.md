# FarmXChain - Quick Reference Guide

## 🚀 Quick Start (5 Steps)

### 1️⃣ Open Platform
```
http://localhost:5173
```

### 2️⃣ Register Account
- Click "Register"
- Choose your role: FARMER | DISTRIBUTOR | RETAILER | CONSUMER | ADMIN
- Fill details → Submit

### 3️⃣ Login
- Email + Password
- Auto-redirect to dashboard

### 4️⃣ Complete Profile (Role-specific)
- **FARMER:** Fill farm details → Wait for admin approval
- **Others:** Start using immediately

### 5️⃣ Start Using
- Follow role-specific guide below

---

## 👥 Role-Based Quick Actions

### 🌾 FARMER
```
Login → Farm Identity → List Crops → Manage Sales → View Analytics
```

**Key Pages:**
- `/dashboard` - Overview
- `/dashboard/my-crops` - Manage crops
- `/analytics` - Income & sales charts
- `/sales` - Order management

**Quick Actions:**
1. ✅ Complete farm profile
2. ✅ List your first crop
3. ✅ Accept incoming orders
4. ✅ View your earnings

---

### 🚚 DISTRIBUTOR
```
Login → Browse Marketplace → Buy from Farmers → Sell to Retailers → Track Orders
```

**Key Pages:**
- `/marketplace` - Buy crops
- `/orders` - Your purchases
- `/sales` - Your sales

**Quick Actions:**
1. ✅ Order crops from farmers
2. ✅ Wait for acceptance
3. ✅ Relist for retailers
4. ✅ Manage both sides

---

### 🏪 RETAILER
```
Login → Browse Marketplace → Buy from Distributors → Sell to Consumers → Fulfill Orders
```

**Key Pages:**
- `/marketplace` - Buy from distributors
- `/orders` - Track purchases
- `/sales` - Consumer orders

**Quick Actions:**
1. ✅ Purchase from distributors
2. ✅ List for consumers
3. ✅ Accept consumer orders
4. ✅ Complete deliveries

---

### 🛒 CONSUMER
```
Login → Browse Products → Place Order → Track Delivery → Verify Journey
```

**Key Pages:**
- `/marketplace` - Shop products
- `/orders` - Your orders
- `/trace/{cropId}` - Product verification

**Quick Actions:**
1. ✅ Browse fresh produce
2. ✅ Place orders
3. ✅ Track delivery
4. ✅ Scan QR code to verify origin

---

### 👨‍💼 ADMIN
```
Login → Verify Farmers → Monitor Platform → Resolve Disputes → Generate Reports
```

**Key Pages:**
- `/farmer-verification` - Approve farmers
- `/admin/analytics` - Platform metrics
- `/admin/disputes` - Dispute management
- `/user-management` - User control
- `/statistics` - System stats

**Quick Actions:**
1. ✅ Approve pending farmers
2. ✅ Monitor platform health
3. ✅ Resolve disputes
4. ✅ Generate reports

---

## 🔄 Complete Supply Chain Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FARM TO FORK JOURNEY                      │
└─────────────────────────────────────────────────────────────┘

1. 🌾 FARMER
   └─> Lists Crop (100kg Wheat @ ₹30/kg)
       └─> Blockchain Registration ⛓️

2. 🚚 DISTRIBUTOR  
   └─> Orders from Farmer
       └─> Farmer Accepts
           └─> Ownership Transfer ⛓️
               └─> Relists (80kg @ ₹35/kg)

3. 🏪 RETAILER
   └─> Orders from Distributor
       └─> Distributor Accepts
           └─> Ownership Transfer ⛓️
               └─> Relists (50kg @ ₹40/kg)

4. 🛒 CONSUMER
   └─> Orders from Retailer (5kg) (REQUESTED)
       └─> Retailer Accepts (ACCEPTED)
           └─> Receives Product (SHIPPED -> DELIVERED)
               └─> Scans QR Code 📱
                   └─> Views Complete Journey ✅
```

---

## 📊 Feature Matrix

| Feature | Farmer | Distributor | Retailer | Consumer | Admin |
|---------|--------|-------------|----------|----------|-------|
| List Crops | ✅ | ✅ | ✅ | ❌ | ❌ |
| Buy Crops | ❌ | ✅ | ✅ | ✅ | ❌ |
| Sell Crops | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ | ✅ |
| Track Orders | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verify Products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve Farmers | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Disputes | ❌ | ❌ | ❌ | ❌ | ✅ |
| Generate Reports | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Common Tasks

### Task: List a Crop (Farmer)
```
1. Login as FARMER
2. Click "My Crops" or Dashboard → "List New Crop"
3. Fill form:
   - Crop Name: "Wheat"
   - Quantity: 100
   - Price: 30
   - Harvest Date: Select date
   - Location: "Punjab"
   - Quality: "A"
4. Click "List Crop"
5. ✅ Crop appears in marketplace with blockchain hash
```

### Task: Purchase Crop (Distributor)
```
1. Login as DISTRIBUTOR
2. Click "Marketplace"
3. Browse available crops from farmers
4. Click on desired crop
5. Enter quantity
6. Click "Place Order"
7. Wait for farmer acceptance
8. ✅ Order status: REQUESTED → ACCEPTED → SHIPPED → DELIVERED
```

### Task: Verify Product (Consumer)
```
1. Receive product with QR code
2. Scan QR code OR
3. Visit: http://localhost:5173/trace/{cropId}
4. View complete journey:
   - ✅ Blockchain Verified badge
   - 🌾 Farm origin
   - 📦 All transfers
   - 📅 Dates & prices
5. ✅ Trust verified!
```

### Task: Approve Farmer (Admin)
```
1. Login as ADMIN
2. Click "Audits" in navbar
3. View pending farmers
4. Review farm details:
   - Name, location, land area
   - Crop type, soil type
   - Bank details
5. Click "Approve" or "Reject"
6. ✅ Farmer can now list crops
```

### Task: Resolve Dispute (Admin)
```
1. Login as ADMIN
2. Click "Disputes" in navbar
3. Filter by status (OPEN, UNDER_REVIEW, etc.)
4. Click on dispute to view details
5. Review both parties' information
6. Click "Resolve Dispute"
7. Enter resolution notes
8. Click "Submit Resolution"
9. ✅ Dispute marked as RESOLVED
```

---

## 📱 Page URLs Reference

### Public Pages
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/trace/{cropId}` - Product journey (public)

### Authenticated Pages
- `/dashboard` - Main dashboard (all roles)
- `/marketplace` - Browse crops (buyers)

### Farmer Pages
- `/dashboard/my-crops` - Manage crops
- `/analytics` - Income analytics ⭐
- `/dashboard/profile` - Farm identity
- `/sales` - Sales management

### Buyer Pages (Distributor/Retailer/Consumer)
- `/orders` - Purchase orders
- `/sales` - Sales (if also selling)

### Admin Pages
- `/farmer-verification` - Approve farmers
- `/admin/analytics` - Platform analytics ⭐
- `/admin/disputes` - Dispute management ⭐
- `/user-management` - User control
- `/statistics` - System statistics

---

## 🎨 UI Elements Guide

### Status Badges
- 📝 **REQUESTED** - Order created by buyer
- ✅ **ACCEPTED** - Seller accepted (Blockchain transfer)
- ❌ **REJECTED** - Seller rejected order
- 🚚 **SHIPPED** - Order in transit
- 🏠 **DELIVERED** - Order completed

### Charts (Analytics)
- 📊 **Bar Chart** - Sales by crop, demand trends
- 🥧 **Pie Chart** - Sales distribution
- 📈 **Line Chart** - Pricing trends (if available)

### Cards
- 💰 **Income Card** - Total earnings
- 📦 **Orders Card** - Total orders
- 📊 **Average Card** - Per order average
- 👥 **Users Card** - Platform users

---

## 🔐 Login Credentials (Testing)

### Test Accounts (if seeded)
```
FARMER:
Email: farmer@test.com
Password: password123

DISTRIBUTOR:
Email: distributor@test.com
Password: password123

RETAILER:
Email: retailer@test.com
Password: password123

CONSUMER:
Email: consumer@test.com
Password: password123

ADMIN:
Email: admin@test.com
Password: password123
```

**Note:** Create your own accounts via registration if test accounts don't exist.

---

## ⚡ Keyboard Shortcuts

- `Ctrl + K` - Search (if implemented)
- `Esc` - Close modals
- `Tab` - Navigate form fields
- `Enter` - Submit forms

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check credentials, ensure backend is running |
| No crops in marketplace | Ensure farmers have listed crops |
| Order not appearing | Refresh page, check correct tab (Orders/Sales) |
| Analytics empty | Need transaction history first |
| QR code not showing | Ensure crop has blockchain hash |
| Farmer can't list crops | Must be approved by admin first |

---

## 📞 Support Checklist

Before reporting issues:
- ✅ Backend running on port 8080?
- ✅ Frontend running on port 5173?
- ✅ Logged in with correct role?
- ✅ Profile completed (for farmers)?
- ✅ Browser console errors?
- ✅ Network tab shows API calls?

---

## 🎓 Learning Path

### Beginner (Day 1)
1. Register account
2. Complete profile
3. Explore dashboard
4. View marketplace

### Intermediate (Day 2-3)
1. List/buy first crop
2. Process first order
3. Track shipment
4. View analytics

### Advanced (Week 1)
1. Manage multiple orders
2. Optimize pricing
3. Use analytics for decisions
4. Verify blockchain records

---

**Quick Tip:** Start with the role you're most interested in and follow the step-by-step guide in the main UI_USER_GUIDE.md!

---

**Platform:** FarmXChain v1.0.0  
**Last Updated:** February 6, 2026  
**Status:** ✅ Production Ready

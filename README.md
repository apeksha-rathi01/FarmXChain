# 🌾 FarmXChain - Blockchain-Powered Agricultural Supply Chain

> **Empowering farmers, building consumer trust, and modernizing agricultural commerce through blockchain technology**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

FarmXChain is a comprehensive agricultural supply chain platform that provides complete transparency from farm to fork. Built with modern technologies and blockchain integration, it ensures fair prices for farmers and builds consumer trust through verifiable product journeys.

## ✨ Key Features

### 🔐 Multi-Role System
- **Farmers** - List crops, track sales, view analytics
- **Distributors** - Purchase from farmers, manage inventory
- **Retailers** - Buy from distributors, sell to consumers
- **Consumers** - Verify product journey, scan QR codes
- **Admins** - Platform governance, dispute resolution

### 📊 Analytics & Insights
- Real-time income and sales tracking
- Demand and pricing trend analysis
- Supply chain performance metrics
- Role-specific dashboards with charts

### 🔍 Consumer Transparency
- Complete product traceability (farm to fork)
- QR code generation for each crop
- Blockchain verification badges
- Public verification endpoints

### ⚖️ Admin Governance
- Dispute management system
- Multi-type reporting (Users, Transactions, Supply Chain)
- User and contract monitoring
- System-wide analytics

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
🌐 Backend runs on: **http://localhost:8080**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
🌐 Frontend runs on: **http://localhost:5173**

### Database Configuration
Create a MySQL database and update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmxchain
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 📁 Project Structure

```
FarmXChain/
├── backend/              # Spring Boot REST API
│   ├── controller/       # REST endpoints
│   ├── service/          # Business logic
│   ├── repository/       # Data access
│   ├── model/            # Entity models
│   ├── dto/              # Data transfer objects
│   └── security/         # JWT & authentication
│
├── frontend/             # React application
│   ├── pages/            # Page components
│   ├── components/       # Reusable UI components
│   ├── services/         # API integration
│   └── context/          # State management
│
└── PROJECT_SUMMARY.md    # Detailed documentation
```

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.9
- **Security:** Spring Security + JWT
- **Database:** MySQL 8.0 with Hibernate/JPA
- **Build:** Maven

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Routing:** React Router DOM
- **QR Codes:** qrcode library

## 📸 Screenshots

### Farmer Analytics Dashboard
View income, sales by crop, and performance trends with interactive charts.

### Admin Analytics
Platform-wide metrics including demand trends, pricing analytics, and supply chain performance.

### Product Journey
Complete traceability with QR codes and blockchain verification badges.

### Dispute Management
Comprehensive dispute resolution system for platform governance.

## 🔮 Future Enhancements

- 🤖 **AI-based crop price prediction**
- 🛰️ **Satellite & IoT integration** for real-time monitoring
- 🛡️ **Smart insurance for crops** with automated claims
- 📱 **Mobile app (Flutter)** for on-the-go access
- 🏛️ **DAO-based farmer cooperatives** for decentralized governance

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Analytics
- `GET /api/analytics/farmer` - Farmer analytics
- `GET /api/analytics/system` - System-wide stats
- `GET /api/analytics/demand-trends` - Demand analysis
- `GET /api/public/trace/{cropId}` - Product journey

### Disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes` - List disputes (admin)
- `PUT /api/disputes/{id}/resolve` - Resolve dispute

For complete API documentation, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🤝 Contributing

Contributions are welcome! Areas for contribution:
1. AI/ML price prediction models
2. IoT sensor integration
3. Mobile app development
4. Smart contract implementation
5. DAO governance mechanisms

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with passion to modernize agricultural supply chains and empower farmers worldwide.

---

**Version:** 1.0.0 (Milestone 4 Complete)  
**Status:** ✅ Production Ready  
**Last Updated:** February 6, 2026

For detailed documentation, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

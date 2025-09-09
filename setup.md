# Quick Setup Guide

## 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## 2. Create Environment File
Create a \`.env\` file with the following content:
\`\`\`
PORT=5000
MONGODB_URI=mongodb+srv://w5434676_db_user:yD9AnRc4yL2AfET0@cluster0.voibnl5.mongodb.net/crud_database
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=development
\`\`\`

## 3. MongoDB Setup
✅ **You're using MongoDB Atlas (cloud database) - no local MongoDB installation needed!**

Your database is already configured and ready to use at:
\`mongodb+srv://w5434676_db_user:yD9AnRc4yL2AfET0@cluster0.voibnl5.mongodb.net\`

## 4. Run the Application
\`\`\`bash
# Development mode
npm run dev

# Production mode  
npm start
\`\`\`

## 5. Test the API
Visit: http://localhost:5000/api/health

## Quick Test Commands

### Create a user:
\`\`\`bash
curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"Password123","age":25}'
\`\`\`

### Get all users:
\`\`\`bash
curl http://localhost:5000/api/users
\`\`\`

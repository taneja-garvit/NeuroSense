# NeuroSense Backend - API Testing Guide

## Quick Start

1. **Make sure MongoDB is running** (default: `mongodb://localhost:27017`)

2. **Start the backend server:**
```bash
cd backend
npm run dev
```

Server will run on: `http://localhost:5000`

---

## Testing Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "NeuroSense API is running",
  "timestamp": "2024-12-10T..."
}
```

---

### 2. Get Questionnaire Questions
```bash
curl http://localhost:5000/api/assessment/questions
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1_socialSituations",
      "question": "How anxious do you feel in social situations?",
      "scale": { "min": 1, "max": 5, ... }
    },
    ...
  ]
}
```

---

### 3. User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token** - you'll need it for protected endpoints!

---

### 4. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

### 5. Submit Assessment (Protected - Requires Token)

Replace `YOUR_TOKEN_HERE` with the token from signup/login:

```bash
curl -X POST http://localhost:5000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"questionnaire\":{\"q1_socialSituations\":4,\"q2_avoidance\":3,\"q3_physicalSymptoms\":4,\"q4_negativeThoughts\":5},\"textInput\":\"I feel anxious in social situations\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "questionnaire": { ... },
    "riskScore": 80,
    "riskLevel": "High",
    "insights": [ ... ],
    "sentimentAnalysis": {
      "negative": 65,
      "neutral": 25,
      "positive": 10
    },
    "createdAt": "..."
  }
}
```

---

### 6. Get Assessment History (Protected)
```bash
curl http://localhost:5000/api/assessment/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. Get Recommendations (Protected)
```bash
# Get all recommendations
curl http://localhost:5000/api/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get recommendations for specific risk level
curl http://localhost:5000/api/recommendations/High \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Complete Test Flow

Here's a complete test sequence:

```bash
# 1. Check server health
curl http://localhost:5000/api/health

# 2. Get questions
curl http://localhost:5000/api/assessment/questions

# 3. Create account
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Demo User\",\"email\":\"demo@neurosense.com\",\"password\":\"demo123\"}"

# Copy the token from response, then:

# 4. Submit assessment
curl -X POST http://localhost:5000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"questionnaire\":{\"q1_socialSituations\":4,\"q2_avoidance\":3,\"q3_physicalSymptoms\":4,\"q4_negativeThoughts\":5}}"

# 5. Get recommendations
curl http://localhost:5000/api/recommendations/High \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. View history
curl http://localhost:5000/api/assessment/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Risk Scoring Logic

The backend calculates risk scores based on questionnaire responses:

- Each question is rated 1-5
- Total score = sum of all 4 questions (max 20)
- Risk score = (total / 20) × 100

**Risk Levels:**
- **Low**: 0-39 points
- **Medium**: 40-69 points
- **High**: 70-100 points

**Example:**
- Q1: 4, Q2: 3, Q3: 4, Q4: 5
- Total: 16/20 = 80%
- Risk Level: **High**

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
# Windows (if installed as service)
net start MongoDB

# Or run manually
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` file or kill the process using port 5000

### Token Errors
```
"Not authorized, no token"
```
**Solution:** Make sure to include the Authorization header:
```
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend Integration

To connect the frontend to this backend:

1. Update frontend API calls to use `http://localhost:5000`
2. Store the JWT token after login (localStorage or state management)
3. Include token in Authorization header for protected routes
4. Handle authentication errors (redirect to login on 401)

**Example fetch call:**
```javascript
const response = await fetch('http://localhost:5000/api/assessment/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    questionnaire: {
      q1_socialSituations: 4,
      q2_avoidance: 3,
      q3_physicalSymptoms: 4,
      q4_negativeThoughts: 5
    }
  })
});
```

---

## Database Collections

After running the backend, you'll have these MongoDB collections:

1. **users** - User accounts
2. **assessments** - User assessment submissions
3. **recommendations** - Coping strategies (seeded)

You can view them using MongoDB Compass or CLI:
```bash
mongosh
use neurosense
db.users.find()
db.assessments.find()
db.recommendations.find()
```

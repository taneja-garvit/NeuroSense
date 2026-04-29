# NeuroSense Backend API

Backend API for the NeuroSense mental wellness screening platform.

## Features

- User authentication (JWT-based)
- Mental health questionnaire (4 questions)
- Risk assessment scoring (Low/Medium/High)
- Mock AI insights generation
- Personalized coping strategies
- Assessment history tracking

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Make sure MongoDB is running locally or update `MONGODB_URI` in `.env`

4. Seed recommendations data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Assessment
- `GET /api/assessment/questions` - Get questionnaire questions
- `POST /api/assessment/submit` - Submit assessment (protected)
- `GET /api/assessment/history` - Get user's assessment history (protected)
- `GET /api/assessment/:id` - Get specific assessment (protected)

### Recommendations
- `GET /api/recommendations` - Get all recommendations (protected)
- `GET /api/recommendations/:riskLevel` - Get recommendations by risk level (protected)

### Health Check
- `GET /api/health` - API health check
- `GET /` - API info

## Questionnaire

The assessment includes 4 questions rated on a 1-5 scale:

1. **Social Situations**: How anxious do you feel in social situations?
2. **Avoidance**: How often do you avoid social gatherings?
3. **Physical Symptoms**: Do you experience physical symptoms in social settings?
4. **Negative Thoughts**: How often do you have negative thoughts about social interactions?

## Risk Scoring

- **Score Range**: 0-100
- **Low Risk**: 0-39
- **Medium Risk**: 40-69
- **High Risk**: 70-100

## Example API Usage

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Submit Assessment
```bash
curl -X POST http://localhost:5000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "questionnaire": {
      "q1_socialSituations": 4,
      "q2_avoidance": 3,
      "q3_physicalSymptoms": 4,
      "q4_negativeThoughts": 5
    },
    "textInput": "I feel very anxious when meeting new people"
  }'
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── assessmentController.js
│   └── recommendationController.js
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User schema
│   ├── Assessment.js        # Assessment schema
│   └── Recommendation.js    # Recommendation schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── assessment.js        # Assessment routes
│   └── recommendations.js   # Recommendation routes
├── seeders/
│   └── recommendationSeeder.js
├── utils/
│   └── riskScoring.js       # Risk calculation logic
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── server.js                # Main entry point
```

## Development

```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start production server
npm run seed   # Seed recommendations
```

## Notes

- This is a demo version for college presentation
- AI features (audio/video analysis) are mocked for now
- File uploads are not implemented yet
- Ready for future ML model integration

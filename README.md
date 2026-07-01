# DevPulse

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

🔗 **Live URL:** `https://your-live-url.com`

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor / maintainer)
- Create, view, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Password hashing with bcrypt
- Protected routes with middleware

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| pg | Native PostgreSQL client |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |

---

## Setup

**1. Clone the repository**
```bash
git clone https://github.com/Mohammadashif007/b7a2
cd b7a2
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUND=10
PORT=3000
```

**4. Run the server**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get token |

### Issues
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create new issue |
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete issue |

### Query Parameters (GET /api/issues)
| Param | Values | Default |
|---|---|---|
| sort | newest, oldest | newest |
| type | bug, feature_request | none |
| status | open, in_progress, resolved | none |

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto increment |
| name | VARCHAR(100) | Required |
| email | VARCHAR(100) | Required, unique |
| password | VARCHAR(255) | Hashed, never returned |
| role | VARCHAR(20) | contributor or maintainer, default contributor |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |

### issues
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto increment |
| title | VARCHAR(150) | Required |
| description | TEXT | Required, min 20 chars |
| type | VARCHAR(20) | bug or feature_request |
| status | VARCHAR(20) | open, in_progress, resolved — default open |
| reporter_id | INT | References users.id |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |

---

## Project Structure

```
src/
├── app.ts
├── server.ts
├── db.ts
├── types/
│   └── express.d.ts
├── app/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── utility/
│   └── modules/
│       ├── auth/
│       │   ├── auth.routes.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.interface.ts
│       └── issues/
│           ├── issues.routes.ts
│           ├── issues.controller.ts
│           ├── issues.service.ts
│           └── issues.interface.ts
```

---


# Development Guide

Guidelines and best practices for developing Med-Rank-Flow.

## Development Setup

### Prerequisites

- Python 3.9+ with venv
- Node.js 18+ with npm
- MongoDB (local or Atlas)
- Code editor (VS Code recommended)

### Recommended VS Code Extensions

- Python
- Pylance
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Project Structure

### Backend (`backend/`)

```
backend/
├── core/              # Core configuration and utilities
├── models/           # MongoDB models (Beanie ODM)
├── schemas/          # Pydantic schemas for validation
├── routes/           # FastAPI route handlers
├── services/         # Business logic layer
└── utils/            # Utility scripts
```

### Frontend (`med-rank-flow-admin/` & `med-rank-flow-student/`)

```
src/
├── pages/            # Page components
├── components/       # Reusable UI components
├── services/         # API service layer
├── contexts/         # React contexts
└── types/           # TypeScript type definitions
```

## Code Style

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints
- Document functions with docstrings
- Use async/await for database operations

### TypeScript/React (Frontend)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

## Database Models

### User Model
- `name`: str - User's full name
- `email`: EmailStr - Unique email address
- `password_hash`: str - Bcrypt hashed password
- `role`: Literal["admin", "student"] - User role

### PatientTask Model
- `title`: str - Task title
- `description`: str - Task description
- `patient`: dict - Patient information
- `assigned_student_id`: str - Student ID
- `status`: Literal["pending", "accepted", "rejected", "completed"]
- `quality_score`: Optional[float] - Score 0-5
- `created_at`: datetime
- `completed_at`: Optional[datetime]

## API Development

### Adding New Endpoints

1. Create route handler in `backend/routes/`
2. Add Pydantic schema in `backend/schemas/`
3. Implement business logic in `backend/services/`
4. Register route in `backend/main.py`
5. Update API.md documentation

### Authentication

All protected endpoints use:
```python
from core.dependencies import get_current_admin, get_current_student

@router.get("/endpoint")
async def endpoint(admin: User = Depends(get_current_admin)):
    # Admin-only endpoint
    pass
```

## Frontend Development

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link if needed
4. Update types in `src/types/`

### API Integration

Use the API service layer:
```typescript
import { api } from '@/services/api';

const data = await api.tasks.getAll();
```

## Testing

### Backend Testing

```bash
# Run tests (when implemented)
cd backend
pytest
```

### Frontend Testing

```bash
# Run tests (when implemented)
cd med-rank-flow-admin
npm test
```

## Database Migrations

Currently using direct model updates. For production:
- Consider using migration tools
- Version control schema changes
- Test migrations on staging

## Debugging

### Backend Debugging

- Use FastAPI's automatic docs: http://localhost:8000/docs
- Check logs in terminal output
- Use Python debugger (pdb) for breakpoints

### Frontend Debugging

- Use browser DevTools
- React DevTools extension
- Check Network tab for API calls
- Check Console for errors

## Common Tasks

### Adding a New Feature

1. Update backend models if needed
2. Create API endpoints
3. Update frontend services
4. Create UI components
5. Update documentation

### Adding New Data

Use the seed script or `add_indian_data.py`:
```bash
python3 add_indian_data.py
```

### Database Queries

Use Beanie ODM for queries:
```python
# Find all completed tasks
tasks = await PatientTask.find(
    PatientTask.status == "completed"
).to_list()
```

## Performance Considerations

- Use database indexes for frequently queried fields
- Implement pagination for large lists
- Cache analytics calculations if needed
- Optimize React re-renders with useMemo/useCallback

## Security Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Use parameterized queries (Beanie handles this)
- Implement rate limiting in production

## Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create pull request

## Deployment Checklist

- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build frontend apps
- [ ] Test all endpoints
- [ ] Configure CORS for production
- [ ] Set up SSL certificates
- [ ] Configure monitoring
- [ ] Set up backups

## Troubleshooting

### Common Issues

**Import errors:**
- Check virtual environment is activated
- Verify dependencies are installed

**Database connection:**
- Verify MongoDB is running
- Check connection string format
- Verify network access

**CORS errors:**
- Check CORS configuration
- Verify frontend API URL
- Check browser console

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Beanie ODM Documentation](https://beanie-odm.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)


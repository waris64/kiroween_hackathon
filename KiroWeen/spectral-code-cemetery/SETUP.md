# 🎃 SPECTRAL Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env and add your Google Gemini API key
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Defaults should work for local development
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## Project Structure

```
spectral-code-cemetery/
├── .kiro/                    # Kiro configuration
│   ├── specs/               # Feature specifications
│   ├── steering/            # Code standards and guidelines
│   ├── hooks/               # Agent hooks (to be added)
│   └── mcp/                 # MCP configuration (to be added)
│
├── frontend/                # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/styling
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test files
│   └── package.json
│
└── shared/                  # Shared code
    ├── types/              # TypeScript types
    └── constants/          # Shared constants
```

## Development Workflow

### Using Kiro Specs

The project includes detailed specifications in `.kiro/specs/`:
- `architecture.md` - System architecture
- `git-analyzer.md` - Git analysis service
- `ai-analyzer.md` - AI narrative generation
- `cemetery-ui.md` - UI visualization
- `api-endpoints.md` - API documentation

### Code Standards

Review `.kiro/steering/` for:
- `code-standards.md` - Coding conventions
- `component-patterns.md` - React patterns
- `halloween-theme.md` - Theme guidelines

## Next Steps

1. **Backend Development:**
   - Implement GitAnalyzer service
   - Implement AIAnalyzer service
   - Create API routes and controllers
   - Add validation and error handling

2. **Frontend Development:**
   - Create Cemetery visualization
   - Build Tombstone components
   - Implement Ghost animations
   - Add repository input form

3. **Integration:**
   - Connect frontend to backend API
   - Implement caching
   - Add loading states
   - Handle errors gracefully

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Verify backend is running on port 3000
- Check CORS settings in backend/.env
- Verify VITE_API_URL in frontend/.env

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [Google Gemini API](https://ai.google.dev/docs)
- [Framer Motion](https://www.framer.com/motion)
- [D3.js](https://d3js.org)

## Hackathon Tips

- Focus on core features first
- Use the Halloween theme consistently
- Keep animations smooth but simple
- Cache AI responses to save API calls
- Test with small repositories first
- Have fun and be creative! 🎃

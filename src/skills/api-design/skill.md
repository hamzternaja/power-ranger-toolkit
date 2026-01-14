---
name: api-design
description: Design RESTful APIs with proper routes, validation, error handling, and documentation. Use when building backend services for PSI Engine or other server applications.
---

# 🔗 API Design Skill

## RESTful Conventions

| Method | Path | Action |
|--------|------|--------|
| GET | /agents | List all |
| GET | /agents/:id | Get one |
| POST | /agents | Create |
| PUT | /agents/:id | Update |
| DELETE | /agents/:id | Delete |

---

## Response Format

### Success
```json
{
  "success": true,
  "data": {
    "id": "agent_001",
    "status": "running"
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with id 'xyz' not found",
    "details": {}
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

---

## Express.js Patterns

### Route Structure
```javascript
// routes/agents.js
const router = express.Router();

router.get('/', listAgents);
router.get('/:id', getAgent);
router.post('/', validateAgent, createAgent);
router.put('/:id', validateAgent, updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
```

### Controller
```javascript
async function createAgent(req, res, next) {
  try {
    const agent = await AgentService.create(req.body);
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
}
```

### Error Handler
```javascript
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  res.status(status).json({
    success: false,
    error: {
      code,
      message: err.message,
      ...(process.env.NODE_ENV === 'dev' && { stack: err.stack })
    }
  });
}
```

---

## Validation (Zod)

```javascript
const { z } = require('zod');

const AgentSchema = z.object({
  name: z.string().min(1).max(100),
  task: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

function validateAgent(req, res, next) {
  try {
    req.body = AgentSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: error.message }
    });
  }
}
```

---

## Flask Patterns (Python)

```python
from flask import Flask, jsonify, request

@app.route('/agents', methods=['POST'])
def create_agent():
    data = request.json
    
    # Validate
    if not data.get('name'):
        return jsonify(success=False, error={'code': 'VALIDATION_ERROR'}), 400
    
    # Create
    agent = agent_service.create(data)
    return jsonify(success=True, data=agent), 201

@app.errorhandler(Exception)
def handle_error(error):
    return jsonify(success=False, error={'message': str(error)}), 500
```

---

## PSI Engine API Example

```
GET  /api/agents           → List all agents
POST /api/agents           → Spawn new agent
GET  /api/agents/:id       → Get agent status
POST /api/agents/:id/task  → Assign task
DELETE /api/agents/:id     → Terminate agent

GET  /api/knowledge        → Search knowledge base
POST /api/knowledge        → Add knowledge entry
```

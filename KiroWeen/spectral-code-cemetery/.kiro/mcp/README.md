# 🎃 SPECTRAL MCP Integrations

## Overview

This directory contains Model Context Protocol (MCP) server configurations for the SPECTRAL project. MCP enables Kiro to integrate with external tools and services.

---

## Available MCP Servers

### 1. GitHub Integration (`github-server.json`)

**Status:** ⚠️ Disabled (Configuration only)

**Features:**
- Issue management
- Pull request automation
- Commit tracking
- Release management
- Webhook support

**Setup:**
1. Create GitHub Personal Access Token
2. Add to `.env`: `GITHUB_TOKEN=your_token`
3. Update repository details in `github-server.json`
4. Set `enabled: true`

### 2. Code Analyzer (`code-analyzer/`)

**Status:** ⚠️ Not installed (Template only)

**Features:**
- Complexity analysis
- Code smell detection
- Dependency checking
- Refactoring suggestions

**Setup:**
```bash
cd .kiro/mcp/code-analyzer
npm install
npm start
```

---

## How to Use MCP Servers

### Configuration

MCP servers are configured in Kiro's settings. Add to your workspace `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "code-analyzer": {
      "command": "node",
      "args": [".kiro/mcp/code-analyzer/server.js"],
      "env": {},
      "disabled": false,
      "autoApprove": ["analyze_complexity", "find_code_smells"]
    }
  }
}
```

### Activation

1. **Via Command Palette:**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Search for "MCP"
   - Select "Reconnect MCP Servers"

2. **Via Settings:**
   - Open Kiro settings
   - Navigate to MCP section
   - Enable desired servers

---

## Creating Custom MCP Servers

### Basic Structure

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

class CustomMCPServer {
  constructor() {
    this.server = new Server({
      name: 'custom-server',
      version: '1.0.0',
    }, {
      capabilities: { tools: {} }
    })
    
    this.setupHandlers()
  }
  
  setupHandlers() {
    // Define your tools here
  }
  
  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
  }
}

const server = new CustomMCPServer()
server.run()
```

### Tool Definition

```javascript
{
  name: 'my_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['param1']
  }
}
```

---

## Available Tools

### Code Analyzer Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `analyze_complexity` | Calculate complexity metrics | filePath, metrics |
| `find_code_smells` | Detect anti-patterns | filePath, severity |
| `check_dependencies` | Analyze dependencies | projectPath, checkVulnerabilities |
| `suggest_refactoring` | Suggest improvements | filePath, focusAreas |

---

## Troubleshooting

### Server Not Starting

**Check:**
1. Node.js version (requires 18+)
2. Dependencies installed (`npm install`)
3. Correct file paths in config
4. Server logs for errors

### Tools Not Appearing

**Check:**
1. Server is enabled in config
2. Kiro has been restarted
3. MCP server is running
4. Check Kiro MCP logs

### Permission Errors

**Check:**
1. File permissions on server.js
2. Environment variables set
3. API tokens valid
4. Network connectivity

---

## Best Practices

### 1. Security

- ✅ Store tokens in environment variables
- ✅ Never commit tokens to git
- ✅ Use minimal required permissions
- ✅ Validate all inputs

### 2. Performance

- ✅ Cache results when possible
- ✅ Implement timeouts
- ✅ Handle errors gracefully
- ✅ Log important events

### 3. Maintenance

- ✅ Keep dependencies updated
- ✅ Document tool usage
- ✅ Version your servers
- ✅ Test regularly

---

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Kiro MCP Guide](https://kiro.dev/docs/mcp)

---

## Status

**GitHub Integration:** ⚠️ Configuration only (not activated)  
**Code Analyzer:** ⚠️ Template only (not installed)

**Note:** These are provided as templates and examples. They are not required for the SPECTRAL application to function and are intended for advanced workflow automation.

---

**For Hackathon:** These MCP servers are optional advanced features. The core SPECTRAL application works perfectly without them! 🎃

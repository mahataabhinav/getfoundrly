# Firecrawl MCP Setup Guide

This guide will help you configure Firecrawl MCP in Cursor to enable web scraping and crawling capabilities, including images and videos for creating high-quality personalized content.

## Prerequisites

- Cursor version 0.45.6 or higher (0.48.6+ recommended)
- Firecrawl API key: `fc-9d32b238860244b98faa4f87018fa792`
- If you need a new API key, get it from [Firecrawl API Keys](https://www.firecrawl.dev/app/api-keys)

## Configuration Instructions

### For Cursor v0.48.6 and later

1. **Open Cursor Settings**
   - Go to **Settings** (or press `Cmd+,` on Mac / `Ctrl+,` on Windows/Linux)

2. **Navigate to MCP Servers**
   - Go to **Features** > **MCP Servers**

3. **Add New Global MCP Server**
   - Click **"+ Add new global MCP server"**

4. **Enter Configuration**
   - Copy and paste the following JSON configuration:

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-9d32b238860244b98faa4f87018fa792"
      }
    }
  }
}
```

   - Or reference the configuration file: `.cursor/firecrawl-mcp-config.json`

5. **Save and Refresh**
   - Save the configuration
   - Refresh the MCP server list to see the new tools

### For Cursor v0.45.6

1. **Open Cursor Settings**
   - Go to **Settings** (or press `Cmd+,` on Mac / `Ctrl+,` on Windows/Linux)

2. **Navigate to MCP Servers**
   - Go to **Features** > **MCP Servers**

3. **Add New MCP Server**
   - Click **"+ Add New MCP Server"**

4. **Enter Configuration Details**
   - **Name**: `firecrawl-mcp` (or your preferred name)
   - **Type**: `command`
   - **Command**: 
     ```bash
     env FIRECRAWL_API_KEY=fc-9d32b238860244b98faa4f87018fa792 npx -y firecrawl-mcp
     ```

5. **Windows Users**
   - If you encounter issues on Windows, use this command instead:
     ```cmd
     cmd /c "set FIRECRAWL_API_KEY=fc-9d32b238860244b98faa4f87018fa792 && npx -y firecrawl-mcp"
     ```

6. **Save and Refresh**
   - Save the configuration
   - Refresh the MCP server list

## Using Firecrawl MCP

### Accessing the Composer Agent

1. Open the Composer via **Command+L** (Mac) or **Ctrl+L** (Windows/Linux)
2. Select **"Agent"** next to the submit button
3. Enter your web scraping query

### Example Use Cases

- Scrape website content including text, images, and videos
- Crawl entire websites for content analysis
- Extract structured data from web pages
- Create personalized content based on scraped website data

The Composer Agent will automatically use Firecrawl MCP when appropriate, but you can explicitly request it by describing your web scraping needs.

## Troubleshooting

### MCP Server Not Appearing

- Ensure Cursor is version 0.45.6 or higher
- Check that the configuration JSON is valid
- Try restarting Cursor after adding the configuration
- Verify the API key is correct

### Connection Issues

- Verify your internet connection
- Check that `npx` is available in your PATH
- Ensure the Firecrawl API key is valid and active
- Check Cursor's MCP server logs for error messages

### Windows-Specific Issues

- Use the `cmd /c` format if the standard command doesn't work
- Ensure Node.js and npm are properly installed
- Check that environment variables are being set correctly

## Configuration Reference

The complete configuration is also available in `.cursor/firecrawl-mcp-config.json` for easy reference.

## Additional Resources

- [Firecrawl Documentation](https://docs.firecrawl.dev)
- [Cursor MCP Server Configuration Guide](https://docs.cursor.com)
- [Firecrawl API Keys](https://www.firecrawl.dev/app/api-keys)


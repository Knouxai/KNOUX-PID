<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KNOUX PID™ - Web Intelligence Engine

Advanced project analysis and visualization platform using AI-powered insights. This application analyzes project structures, identifies code quality metrics, and provides intelligent recommendations.

## Features

- **AI-Powered Analysis**: Uses Google's Gemini AI to analyze project structure and provide insights
- **Multi-Mode Analysis**: Different analysis modes for new developers, maintenance, refactoring, and production prep
- **Visual Analytics**: Heatmaps, project DNA visualization, and structured roadmaps
- **File Structure Analysis**: Comprehensive file analysis with status indicators
- **Real-time Processing**: Instant analysis of uploaded project files

## Prerequisites

- Node.js 16+ 
- A Google Gemini API key

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env.local` file in the root directory with your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   Alternative environment variable names supported:
   - `GEMINI_API_KEY`
   - `REACT_APP_GEMINI_API_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `API_KEY`

3. **Run the Application**
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser
2. Upload project files or select a directory
3. Choose your development mode:
   - **New Developer**: Simplifies complexity, highlights entry points
   - **Maintenance**: Targets technical debt and legacy code
   - **Refactor**: Identifies performance improvements
   - **Production Prep**: Security and deployment readiness checks
4. View analysis results including:
   - Project DNA identification
   - Quality metrics and heatmaps
   - Structured file tree
   - Actionable roadmap

## Architecture

The application follows a modular architecture with:

- **Components**: UI components organized by feature
- **Engines**: Business logic for project analysis
- **Types**: TypeScript interfaces and enums
- **Utils**: Shared utilities and configuration

## Configuration

The application uses a centralized configuration system located in `src/utils/config.ts` that handles:

- API key validation and loading
- Environment-specific settings
- Feature flags
- Request timeouts and rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

- **API Key Issues**: Ensure your API key is valid and has proper permissions
- **File Upload Issues**: Large projects may take time to analyze
- **Network Errors**: Check your internet connection and API key validity

## License

This project is licensed under the MIT License.

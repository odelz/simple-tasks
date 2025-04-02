# Vercel Serverless API

This project is a serverless API built using Vercel. It demonstrates how to create a simple API endpoint that responds with a greeting message.

## Project Structure

```
vercel-serverless-api
├── api
│   ├── hello.ts          # API endpoint that returns a greeting
│   └── utils
│       └── index.ts      # Utility functions for the API
├── vercel.json           # Vercel configuration file
├── package.json          # NPM dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd vercel-serverless-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

## Usage

Once deployed, you can access the API endpoint at:
```
https://<your-vercel-project>.vercel.app/api/hello
```

This will return a JSON response with a greeting message.

## Contributing

Feel free to submit issues or pull requests to improve the project!
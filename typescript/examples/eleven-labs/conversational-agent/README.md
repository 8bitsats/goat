# Conversational Agent with Solana Integration

A Next.js application that integrates with Eleven Labs for voice conversations and provides Solana token tracking capabilities.

## Features

- Voice conversations using Eleven Labs
- Solana wallet integration
- Real-time token price tracking using Bird Eye API
- Trending Solana tokens information

## Environment Variables

The following environment variables are required:

```env
NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID=your_eleven_labs_agent_id
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key
```

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file with the required environment variables

3. Run the development server:
```bash
pnpm dev
```

## Deployment to Netlify

1. Push your code to a GitHub repository

2. In Netlify:
   - Create a new site from Git
   - Connect to your GitHub repository
   - Set build command: `pnpm build`
   - Set publish directory: `.next`
   - Add environment variables in site settings

3. Required build settings:
   - Node version: 20.x
   - Package manager: pnpm

4. Environment variables to configure in Netlify:
   - NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID
   - NEXT_PUBLIC_COINGECKO_API_KEY
   - NEXT_PUBLIC_BIRDEYE_API_KEY

## Usage

1. Connect your Solana wallet
2. Click "Start Conversation"
3. Allow microphone access when prompted
4. Start talking with the AI agent
5. Ask about trending Solana tokens

## License

MIT

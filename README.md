# NarrateAI

An AI-powered content research and script generation tool built with Next.js 14, React, and Tailwind CSS.

## Features

- 🤖 **AI-Powered Research**: Automatically gather the latest information and insights on any topic
- 📝 **Script Generation**: Create engaging, well-structured scripts ready for production
- 🔗 **References & Sources**: Get comprehensive source lists and visual suggestions
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)
- **Database**: Supabase (configured)
- **AI Services**: OpenAI (configured)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rishiraj-58/narrateai.git
cd narrateai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Serper API Key (for web search)
SERPER_API_KEY=your_serper_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
narrateai/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── result/            # Results page
├── components/            # Reusable components
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── TopicInput.tsx
├── lib/                   # Utility functions
│   └── api.ts
├── public/                # Static assets
└── ...config files
```

## Usage

1. **Enter a Topic**: On the home page, enter any topic you'd like to create content about
2. **Generate Content**: Click "Generate Script" to start the AI-powered research and generation
3. **View Results**: Review the generated script, references, and suggested images
4. **Download/Share**: Use the action buttons to download or share your content

## API Routes

- `POST /api/generate` - Generate content for a given topic (currently returns mock data)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@narrateai.com or create an issue in this repository.

---

Built with ❤️ using Next.js 14 and Tailwind CSS 
# Voxta 🗨️  
_Open World Chatrooms with Next.js, Postgres, and WebSockets_

## Overview  
**Voxta** brings people together in **public chatrooms** open to everyone, as well as **private rooms** users can create and manage.  
It’s built with **Next.js, PostgreSQL, Prisma, TailwindCSS, and WebSockets**, focusing on real-time messaging and seamless room-based communication.  



---


## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/voxta.git

2. Setup environment variables
Create a .env file in the project root:

DATABASE_URL=your_postgres_url
WS_PORT=4000
NEXT_PUBLIC_WS_PORT=4000

3. Start Postgres
Run PostgreSQL locally (or use Railway/Neon/Supabase).
Run database migrations + seed public rooms:

npx prisma migrate dev --name init
npx prisma db seed

4. Start the app
By default, both Next.js and WS server start together:
npm run dev

5. You can start them separate(optional)
npm run dev:next   # Start Next.js
npm run dev:ws     # Start WebSocket server


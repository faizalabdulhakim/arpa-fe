Arpa Admin Panel is application to manage user, product, category, and order for Arpa E-Commerce. Built with Next.JS v15 with app router.

Styling with Shadcn/ui

# Getting Started
## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (>= 18.18)
- **npm**
- **run [arpa-be](https://github.com/faizalabdulhakim/arpa-be) for APIs (required)**

## Getting Started

First, Clone the Repository

```bash
git clone https://github.com/faizalabdulhakim/arpa-fe.git
```

install depedencies
```
npm install --legacy-peer-deps
```
setting `.env`
```
NEXT_PUBLIC_APP_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
JWT_SECRET="your-secret-key"
```

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
- Login
- Dark Mode
- Responsive design across devices
- Dashboard
- Promote User to Admin
- CRUD Product
- Assign Category to Product
- CRUD Category
- Create Read Update Order

## TODO Features
- Edit User

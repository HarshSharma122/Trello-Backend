Trello Backend

A backend project inspired by Trello, built to understand how a modern backend handles **authentication, authorization, cookies, JWT, protected routes, organizations, boards, lists, and cards**.

The main goal of this project is not just to build APIs, but to understand **how a client and server communicate securely** and how authentication works behind the scenes.

---

## 🚀 What I'm Building

I'm building the backend of a Trello-like application using **Express.js and MongoDB Atlas**.

The main focus of this project is understanding the complete authentication flow:

- How a user signs up and logs in
- How passwords should be protected(Not handled till now)
- How JWT authentication works
- How the server identifies the current user
- How JWT tokens can be stored inside HTTP-only cookies
- How authentication middleware protects private routes
- How authenticated users can create and manage organizations
- How organizations can contain boards
- How boards can contain members, lists, and cards

---

## 🎯 Main Focus: Authentication

The biggest purpose of this project is to understand authentication instead of simply using an authentication library.

### Authentication Flow

```text
Client
   ↓
Sign Up / Sign In
   ↓
Server validates credentials
   ↓
Server creates JWT
   ↓
JWT is stored in HTTP-only Cookie
   ↓
Client automatically sends Cookie
   ↓
Authentication Middleware
   ↓
JWT is verified
   ↓
Current User ID is identified
   ↓
Protected Route
```

### Why Cookies?

Instead of explicitly returning the JWT token in every response and expecting the client to manually manage it, the server stores the JWT inside a cookie.

The cookie is configured to be:

- `httpOnly`
- `sameSite`:"None" || "Secure" || "Lax"
- Limited by an expiration time

This helps me understand how browser-based authentication works in real applications.

---

## Will add this

## 🔐 Password Security

**Passwords should never be stored as plain text. This project will focuses on understanding password hashing and how user passwords can be protected before being stored in the database.**

The authentication system is designed around the idea that the database should not contain users' original passwords.

---

## 🛡️ Authentication Middleware

Protected routes use authentication middleware.

The middleware is responsible for:

1. Reading the authentication cookie
2. Getting the JWT
3. Verifying the JWT
4. Identifying the user
5. Attaching the authenticated user's ID to the request
6. Allowing the request to continue only when authentication is valid

For example:

```text
Client Request
      ↓
Authentication Middleware
      ↓
Is JWT valid?
   ↙       ↘
 No         Yes
 ↓           ↓
401        userId
             ↓
       Protected Route
```

This allows routes to use the currently authenticated user without requiring the client to manually send the user ID with every request.

---

# 🧩 Application Structure

The backend currently focuses on the following flow:

```text
User
 │
 ├── Authentication
 │      ├── Sign Up
 │      └── Sign In
 │
 └── Organization
        │
        └── Board
              │
              ├── Members
              │
              ├── Lists
                    │
                    └── Cards
             
```

---

# 📌 API Routes

## Authentication

### Sign Up

`POST /auth/sign-up`

Creates a new user account.

**Purpose:**

- Create a user
- Validate whether the email already exists
- Protect the password
- Generate a JWT
- Store the JWT inside a cookie

---

### Sign In

`POST /auth/sign-in`

Authenticates an existing user.

**Purpose:**

- Verify user credentials
- Generate a JWT
- Store the JWT inside an HTTP-only cookie
- Establish an authenticated session

---

# 🏢 Organization Routes

## Create Organization

`POST /onboarding/create-org`

**Protected Route**

Creates an organization for the authenticated user.

The organization is associated with the currently authenticated user through the user ID provided by the authentication middleware.

---

## Get Organization List

`GET /org/org-list`

**Protected Route**

Returns the organizations associated with the currently authenticated user.

---

## Delete Organization

`DELETE /org/:orgId`

**Protected Route**

Deletes an organization using its organization ID.

---

# 📋 Board Routes

## Create Board

`POST /create-board`

**Protected Route**

Creates a board inside an organization.

A board is associated with:

- Board name
- Organization ID
- Owner/User ID

---

## Get Board List

`POST /board/list/:orgId`

**Protected Route**

Returns boards associated with a particular organization.

---

# 👥 Board Members

## Add Board Member

`POST /board/member-add`

**Protected Route**

Adds a member to a board using their email address.

---

# 📝 Lists

## Add List

`POST /board/add-list`

**Protected Route**

Creates a new list inside a board.

For example:

```text
Todo
In Progress
Done
```

---

# 🃏 Cards

## Add Card

`POST /board/add-card`

**Protected Route**

Creates a card inside a specific board list.

The card system follows the structure:

```text
Board
  ↓
List
  ↓
Card
```

For example:

```text
Board: Website Project

├── Todo
│    ├── Create homepage
│    └── Design navbar
│
├── In Progress
│    └── Build authentication
│
└── Done
     └── Setup database
```

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication

- JWT
- HTTP Cookies
- Authentication Middleware
- Password Hashing

### Development

- JavaScript
- REST API
- Git
- GitHub

---

# 📚 What I'm Learning From This Project

This project is mainly a learning project focused on understanding backend fundamentals.

Through this project, I'm learning:

- How client-server communication works
- How REST APIs are designed
- How authentication works
- How JWT works
- How JWT is verified
- How cookies work
- How HTTP-only cookies improve token handling
- How authentication middleware works
- How protected routes are implemented
- How passwords should be stored securely
- How MongoDB stores application data
- How Mongoose models interact with MongoDB
- How organizations, boards, lists, and cards can be related
- How backend authorization can be designed

---

# 🔄 Authentication Architecture

The authentication architecture can be summarized as:

```text
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
                    Sign Up / Sign In
                           │
                           ▼
                    ┌─────────────┐
                    │   Express   │
                    │   Server    │
                    └──────┬──────┘
                           │
                     Validate User
                           │
                           ▼
                    ┌─────────────┐
                    │    JWT      │
                    └──────┬──────┘
                           │
                    Store in Cookie
                           │
                           ▼
                    ┌─────────────┐
                    │ HTTP-Only   │
                    │   Cookie    │
                    └──────┬──────┘
                           │
                    Future Requests
                           │
                           ▼
                    ┌─────────────┐
                    │ Auth        │
                    │ Middleware  │
                    └──────┬──────┘
                           │
                     Verify JWT
                           │
                           ▼
                       userId
                           │
                           ▼
                    Protected Route
```

---

# 🧠 Why I Built This

As a developer, I don't want to only know how to use authentication libraries.

I want to understand what happens **under the hood**.

This project gives me an opportunity to understand questions such as:

- How does a server know who is making a request?
- How does JWT authentication work?
- Where should the JWT be stored?
- Why are HTTP-only cookies useful?
- How does middleware protect private routes?
- How does the server identify the current user?
- How should passwords be stored securely?
- How are users connected to organizations and boards?
- How does a backend represent nested application data?

---



🙏 Learning & Inspiration

A greatest shout-out to Harkirat Sir for his teaching and guidance.

I'm currently learning backend development, system concepts through his content and applying those concepts by building projects like this one.

Instead of just watching tutorials, I'm trying to learn → build → break → understand → improve.

A big thank you to Harkirat Sir for creating content that encourages developers to build and understand things deeply.





# 🚧 Project Status

This project is currently **under development**.

I'm continuously adding features and improving the backend architecture while learning more about:

- Authentication
- Authorization
- Security
- Database design
- API architecture
- Backend development

---

# 🔮 Future Improvements

Planned improvements include:

- Better authorization checks
- Improved password validation
- Password hashing with a dedicated hashing algorithm/library
- Better error handling
- Input validation
- Organization-level permissions
- Board-level permissions
- Better member management
- Board member invitation system
- Update and delete operations for lists/cards
- Improved API structure
- API documentation
- Testing
- Production-ready security improvements

---

# 👨‍💻 About This Project

This project is being built as part of my journey to become a stronger **Full-Stack / Backend Developer**.

Rather than only following tutorials, I'm building the backend myself to understand how authentication, databases, middleware, APIs, and application architecture work together.


**The goal is not just to make the API work — the goal is to understand why it works.**



**I am giving the 
# NeedThat or NeedDat

A **social product discovery platform** where brands market products and users share authentic reviews through short-form video content.

The platform combines elements of **TikTok-style feeds**, **Amazon-style product reviews**, and **social engagement** to create a trusted environment for discovering and evaluating products.

---

# Project Vision

Traditional social media platforms mix product marketing with unrelated content. This platform focuses **exclusively on product discovery**, allowing:

- **Brands** to promote products through short-form content
- **Users** to post authentic video reviews
- **Shoppers** to discover products through a personalized feed

The goal is to create a **trustworthy ecosystem** where product discovery is driven by both brands and real users.

---

# Core Features (MVP)

## User Features
- User accounts and profiles
- Bookmark/save products
- Post **video product reviews**
- Rate and comment on products
- Shopping cart with products from multiple brands
- Discover products through a **TikTok-style feed**

## Company Features
- Brand/company accounts
- Product catalog management
- Upload marketing posts
- Product promotion through short-form content

## Product Discovery
- Vertical scrolling video feed
- Product pages with reviews
- AI-based product rating
- Search and category browsing

---

# Key Differentiators

## Authentic User Reviews
Users can post **video reviews** of products, increasing transparency and trust.

## AI Product Ratings
A Python-based AI system analyzes review sentiment to generate **dynamic product ratings**.

## Personalized Product Discovery
The feed recommends products based on:

- watch time
- likes
- bookmarks
- category interests

---

# Tech Stack

## Frontend
- React Native via Expo

## Backend
- Java
- Spring Boot
- REST APIs

## Database
- PostgreSQL

## AI / Data Services
- Python
- FastAPI
- HuggingFace / NLP models

## Media Storage
- Local file storage (MVP)
- Cloud storage planned for production

---

# Example Platform Flow

## Viewing the Feed

1. React frontend requests feed data
2. Spring Boot API retrieves posts from PostgreSQL
3. Backend returns post metadata and video URLs
4. React renders the feed and loads videos directly

---

## Posting a Review

1. User uploads a review video
2. Video is stored in local file storage
3. Metadata is stored in PostgreSQL
4. AI service analyzes review sentiment
5. Product rating updates dynamically

---

# Future Improvements

- Cloud media storage (AWS S3 or Cloudflare R2)
- Advanced recommendation engine
- In-app checkout system
- Brand analytics dashboards
- Fraud detection for fake reviews

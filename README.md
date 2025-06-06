# Kino

Kino is a cinema website built with Next.js.  
Functionality includes:
- List of movies and detailed information about each movie
- Display of upcoming screenings
- Ability to create an account and log in
- Ability to leave reviews on movies (rating and comment)

The project uses a headless CMS as the data source for movies and screenings, along with a custom REST API for reviews.

All movie, review, and screening data is fetched via API from the CMS:  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0

---

## Getting Started

1. Clone the repo:
git clone https://github.com/Dusknery/Kino.git
cd Kino

css
Copy
Edit
2. Install all packages:
npm install

markdown
Copy
Edit
3. Start the server:
npm start

yaml
Copy
Edit
4. Visit [http://localhost:3000](http://localhost:3000)

---

## API

- **GET /api/reviews?movieId=ID** – Fetch reviews for a movie  
- **POST /api/reviews** – Submit a review  
- **GET /api/popular-movies** – Fetch the 5 most popular movies (average rating in the last 30 days)  
- **GET /api/screenings/upcoming** – Fetch up to 10 upcoming screenings within the next 5 days

---

## Organization and Workflow

The project was planned by identifying necessary functionality and dividing the work into smaller parts:  
- Page structure and navigation  
- Movie list and movie detail page  
- Login and registration  
- Reviews and screenings

Version control was managed with GitHub. Pull requests were used for new features, and code review was conducted before merging. Issues were used for planning and task distribution.

---

## Testing Strategy

Functionality was manually tested in the browser.  
All flows were verified: login, registration, submitting reviews, and navigating between movies and screenings.  
Error messages are shown for invalid logins or incorrect input.

---

## Other

Reviews are stored in memory on the server (for demo/school purposes).  
In production, this should be replaced with a database such as MongoDB.

All movie, review, and screening data is fetched via API from the CMS:  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0
# Kino

Detta är ett Node.js-projekt för en filmsida där man kan se filmer, recensioner och kommande visningar. Projektet använder ett headless CMS som datakälla.  
All film-, recensions- och visningsdata hämtas via API från CMS:et:  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0

## Kom igång

1. Klona repot:
   ```
   git clone https://github.com/Dusknery/Kino.git
   cd Kino
   ```
2. Installera alla paket:
   ```
   npm install
   ```
3. Starta servern:
   ```
   npm start
   ```

## Tester

Kör tester med:
```
npm test
```

## API

- **GET /api/reviews?movieId=ID&page=1&pageSize=5** – Hämta recensioner för en film 
- **POST /api/reviews** – Skapa en recension.
- **GET /api/popular-movies** – Hämta de 5 mest populära filmerna (snittbetyg senaste 30 dagar).
- **GET /api/screenings/upcoming** – Hämta max 10 kommande visningar för de närmaste 5 dagarna.

## CMS API

Projektet hämtar data från ett CMS.  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0

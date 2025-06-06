# Kino

Kino är en biografsida byggd med Next.js.  
Funktionaliteten omfattar:
- Lista över filmer och detaljerad information om varje film
- Visning av kommande filmvisningar
- Möjlighet att skapa konto och logga in
- Möjlighet att lämna recensioner på filmer (betyg och kommentar)

Projektet använder ett headless CMS som datakälla för filmer och visningar, samt ett eget REST API för recensioner.

All film-, recensions- och visningsdata hämtas via API från CMS:  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0

---

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
4. Besök [http://localhost:3000](http://localhost:3000)

---

## API

- **GET /api/reviews?movieId=ID** – Hämta recensioner för en film 
- **POST /api/reviews** – Skapa en recension
- **GET /api/popular-movies** – Hämta de 5 mest populära filmerna (snittbetyg senaste 30 dagar)
- **GET /api/screenings/upcoming** – Hämta max 10 kommande visningar för de närmaste 5 dagarna

---

## Organisation och arbetsprocess

Projektet har planerats genom att identifiera nödvändig funktionalitet och dela upp arbetet i mindre delar:  
- Sidstruktur och navigation  
- Filmlista och filmsida  
- Inloggning och registrering  
- Recensioner och visningar

Versionshantering har skett med GitHub. Pull requests har använts för nya funktioner och code review har genomförts innan merge. Issues har använts för planering och fördelning av arbetsuppgifter.

---

## Testningsstrategi

Funktionaliteten har testats manuellt i webbläsaren.  
Samtliga flöden har verifierats: inloggning, registrering, lämna recension, samt navigering mellan filmer och visningar.  
Felmeddelanden visas vid ogiltig inloggning eller felaktig input.

---

## Övrigt

Recensioner sparas i minnet på servern (för demo/school purpose).  
Vid produktion bör detta ersättas med en databas, exempelvis MongoDB.

All film-, recensions- och visningsdata hämtas via API från CMS:  
https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0

# Pametni paketnik - dokumentacija

## Pregled projekta
Ta rešitev vključuje:
- `backend/`: strežnik Node.js z Express in MongoDB, ki upravlja uporabnike, paketnike, odklepanje in zgodovino.
- `frontend/`: React aplikacija za uporabnike in administratorje, ki omogoča prijavo, nadzorno ploščo, dodajanje knjig in odklep paketnikov.

## Namestitev

### 1. Priprava računalnika
Potrebujete:
- Windows ali drug operacijski sistem
- nameščen Node.js (priporočeno vsaj 18.x)
- dostop do strežnika MongoDB (lokalno ali v oblaku)

### 2. Namestitev backend strežnika
1. Odprite terminal v mapi projekta.
2. Preklopite v `backend` mapo:
   ```powershell
   cd backend
   ```
3. Namestite odvisnosti:
   ```powershell
   npm install
   ```
4. Ustvarite datoteko `.env` z vsebino:
   ```text
   MONGO_URI=mongodb://localhost:27017/smart-mailbox
   PORT=5000
   JWT_SECRET=vaš_tajni_ključ
   ```
5. Zaženite strežnik v razvojni načinu:
   ```powershell
   npm run dev
   ```
6. Če uporabljate običajni zagon, uporabite:
   ```powershell
   npm start
   ```

### 3. Namestitev frontend aplikacije
1. Odprite nov terminal ali uporabite isti terminal s prejšnje točke.
2. Preklopite v `frontend` mapo:
   ```powershell
   cd ../frontend
   ```
3. Namestite odvisnosti:
   ```powershell
   npm install
   ```
4. Zaženite front-end aplikacijo:
   ```powershell
   npm start
   ```
5. Odprite brskalnik in pojdite na:
   ```text
   http://localhost:3000
   ```

## Kako deluje
- Frontend aplikacija poganja uporabniški vmesnik.
- Backend strežnik posluša na vratih, kot so določena v `.env`.
- Frontend pošilja zahtevke na API, na primer `http://localhost:5000/api/auth/login`.

## Primeri uporabe
### Primer 1: registracija in prijava uporabnika
1. Odprite `http://localhost:3000`.
2. Kliknite na gumb za prijavo ali register.
3. Vnesite svoje ime, e-pošto in geslo ter pritisnite "Registriraj".
4. Po uspešni registraciji se prijavite z istimi podatki.
5. Po prijavi boste preusmerjeni na nadzorno ploščo (`/dashboard`).

Kaj lahko uporabnik naredi:
- Ogleda seznam knjig.
- Doda imena knjig v paketnik in jih pošlje na strežnik.

### Primer 2: upravljanje paketnikov in zgodovine
1. Prijavite se kot administrator v `http://localhost:3000/login`.
2. Če je vaš račun označen kot admin, uporabite pot `http://localhost:3000/admin`.
3. Na administracijskem zaslonu lahko preverite statistiko, uporabnike in upravljate paketnike.

## Uporabniške zgodbe: Zakaj potrebujemo pametni knjižni paketnik?

##  Reševanje problemov klasične knjižnice (Izposojevalec)

### 1. Težava: Omejen delovni čas
**Kot** zaposlen uporabnik knjižnice **me moti**, da se moji delovni izmeni vedno prekrivajo z delovnim časom knjižnice, zato knjig ne morem prevzeti ali vrniti, **zato bi hotel** pametni paketnik, ki je na voljo 24/7 na dostopni lokaciji.

### 2. Težava: Oddaljenost knjižnice (Lokacijska ovira)
**Kot** prebivalec primestnega naselja **me moti**, da moram za vsako izposojo knjige sesti v avto in se peljati v center mesta, **zato bi hotel**, da je paketnik postavljen v moji soseski, kjer lahko knjigo prevzamem med sprehodom.

### 3. Težava: Strah pred zamudninami in strogimi pravili
**Kot** občasni bralec **me moti** formalen postopek v knjižnici in strah pred visokimi zamudninami, če pozabim na datum, **zato bi hotel** bolj sproščen, avtomatiziran sistem izposoje, ki me samodejno opominja in mi omogoča enostavno podaljšanje preko telefona.

---

##  Reševanje problemov upravljanja (Knjižničar/Skupnost)

### 4. Težava: Visoki stroški osebja za majhne enote
**Kot** upravitelj mestne knjižnice **me moti**, da ne moremo odpreti novih izpost zaradi stroškov najema prostorov in plač osebja, **zato bi hotel** pametni paketnik, ki deluje kot avtonomna "mini knjižnica" brez potrebe po stalni prisotnosti zaposlenih.

### 5. Težava: Slab pregled nad "Free Library" hišicami
**Kot** pobudnik soseske izmenjevalnice knjig **me moti**, da so klasične lesene hišice pogosto polne uničenih knjig ali pa ljudje vse odnesejo in nič ne vrnejo, **zato bi hotel** pametni sistem, ki zahteva registracijo uporabnika in s tem poveča odgovornost do knjižnega gradiva.

### 6. Težava: Težko sledenje popularnosti gradiva
**Kot** kurator zbirke **me moti**, da pri običajnih uličnih knjižnicah nimam pojma, kaj ljudje dejansko berejo, **zato bi hotel** digitalni sistem, ki beleži vsako izposojo in mi pove, kateri žanri so v določeni soseski najbolj iskani.

---

##  Sistemska rešitev kot most

### 7. Težava: Digitalna odklopljenost fizičnih knjig
**Kot** sodoben uporabnik **me moti**, da moram za fizične knjige uporabljati zastarele članske izkaznice in fizične kataloge, **zato bi hotel** rešitev, ki združuje fizično knjigo z digitalno izkušnjo (rezervacija na mobilni aplikaciji, odpiranje s telefonom).
# Gawin & Wojnowska × PiXEL EXPERTS TEAM — interaktywna propozycja współpracy

Interaktywna oferta handlowa i konfigurator usług. Klient czyta propozycję, wybiera potrzebne moduły,
widzi aktualną sumę netto i wysyła wybrany zakres — PiXEL EXPERTS TEAM otrzymuje gotową konfigurację emailem.

**Stos:** React 19 + TypeScript + Tailwind CSS 4 (Vite). Wysyłka emaili: Resend API przez funkcję serwerową
(Vercel Function). Bez dodatkowych bibliotek UI: natywny `<dialog>` i własne ikony SVG.

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env   # uzupełnij zmienne albo ustaw EMAIL_DRY_RUN=true
npm run dev            # http://localhost:5173
```

W trybie `dev` endpoint `/api/send-offer` działa w serwerze Vite (ten sam kod co produkcyjnie).
Przy `EMAIL_DRY_RUN=true` emaile nie są wysyłane, tylko wypisywane w konsoli.

```bash
npm run build      # typecheck + build produkcyjny do dist/
npm run typecheck
```

## Wdrożenie (Vercel)

1. Zaimportuj repozytorium w Vercel (framework wykrywany automatycznie: Vite).
2. W **Settings → Environment Variables** ustaw:

| Zmienna          | Opis                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `RESEND_API_KEY` | Klucz API z [resend.com](https://resend.com/api-keys)                  |
| `EMAIL_FROM`     | Nadawca w zweryfikowanej domenie, np. `PiXEL EXPERTS TEAM <oferta@domena.pl>` |
| `ADMIN_EMAIL`    | Adres, na który trafiają nowe konfiguracje                             |

Klucz API i adres administratora są używane wyłącznie po stronie serwera (`server/sendOffer.ts`)
i nigdy nie trafiają do kodu frontendu.

## Struktura

```
src/data/offer.ts            ← JEDYNE źródło cen, usług, wariantów i grup wykluczających się
src/lib/summary.ts           ← sumy, formatowanie PLN, walidacja wyboru (wspólne dla UI i serwera)
src/state/OfferContext.tsx   ← stan wyboru, logika wariantów, toasty, localStorage
src/components/              ← sekcje propozycji, karty, panel „Twoja oferta”, formularz
server/sendOffer.ts          ← walidacja, treść emaili (tekst + HTML), wysyłka przez Resend
api/send-offer.ts            ← Vercel Function: POST /api/send-offer
```

## Logika biznesowa

- Grupy wykluczające się (`exclusiveGroup`): **branding** (Mini / PRO), **website** (START / PRO),
  **outreach** (MICRO / STANDARD / GROWTH) — wybór wariantu automatycznie zastępuje poprzedni.
- Usługi jednorazowe i miesięczne (`billing`) są sumowane osobno; przy braku pakietu miesięcznego
  wyświetlana jest tylko „Suma netto”.
- „Rekomendowany zestaw” dodaje: strategię, Brand Guide PRO, sesję i Stronę PRO (bez B2B Outreach).
- Wybór jest zapisywany w `localStorage` i przetrwa odświeżenie strony.
- Serwer **nie ufa cenom z przeglądarki** — przyjmuje tylko identyfikatory usług i przelicza ceny
  na podstawie `src/data/offer.ts`.
- Ekran sukcesu pojawia się dopiero po potwierdzeniu wysyłki przez serwer; przy błędzie wybór
  pozostaje nienaruszony.
- Email do klienta (potwierdzenie) jest wysyłany po udanym emailu do administratora; jego ewentualny
  błąd nie unieważnia zgłoszenia.

## Zmiana cen lub zakresu

Edytuj wyłącznie `src/data/offer.ts` — interfejs, sumy, zestaw rekomendowany i treść emaili
zaktualizują się automatycznie.

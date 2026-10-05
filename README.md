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
src/content/proposal.ts      ← CAŁA treść oferty: teksty, etapy, usługi, ceny, emaile
src/content/types.ts         ← typy treści (opis wszystkich pól i bloków)
src/content/translations/    ← tłumaczenia EN / RU (tylko teksty, nakładane na wersję polską)
src/i18n/ui.ts               ← teksty interfejsu i emaili w 3 językach, formatowanie cen
src/theme.css                ← kolory marki
src/lib/offer.ts             ← funkcje pomocnicze nad treścią
src/lib/summary.ts           ← sumy, formatowanie PLN, walidacja wyboru (wspólne dla UI i serwera)
src/state/OfferContext.tsx   ← stan wyboru, warianty, toasty, localStorage
src/components/              ← uniwersalne sekcje (bez tekstów konkretnego klienta)
server/sendOffer.ts          ← walidacja, treść emaili (tekst + HTML), wysyłka przez Resend
api/send-offer.ts            ← Vercel Function: POST /api/send-offer
```

**Szablon:** nowa oferta = kopia repozytorium + edycja `src/content/proposal.ts`
(i opcjonalnie `src/theme.css`). Instrukcja krok po kroku: [TEMPLATE.md](TEMPLATE.md).

## Języki

Polski jest wersją główną; przełącznik PL / EN / RU w nagłówku, link z `?lang=en|ru` otwiera stronę
w danym języku. Potwierdzenie dla klienta wysyłane jest w wybranym języku, email do administratora —
zawsze po polsku (z informacją o języku klienta).

## Logika biznesowa

- Grupy wykluczające się (`exclusiveGroup`): **branding** (Mini / PRO), **website** (Landing page kampanijny / Strona PRO),
  **outreach** (MICRO / STANDARD / GROWTH) — wybór wariantu automatycznie zastępuje poprzedni.
- **Strategia** (`billing: 'hourly'`, 80 zł netto / godz.) ma konfigurator zakresu (`stage.configurator`):
  suwak 0–16 h (krok 0,5 h) i lista elementów sterują sobą nawzajem — suwak dobiera pełne elementy
  w kolejności priorytetu (reszta = „czas dodatkowy”), a zaznaczenie elementów ustawia suwak na sumę ich czasu.
  Gotowe zakresy (4 / 8 / 12 / 16 h) to skróty, nie osobne produkty. Cena = godziny × stawka (przelicza też serwer).
- Usługi jednorazowe i miesięczne (`billing`) są sumowane osobno; przy braku pakietu miesięcznego
  wyświetlana jest tylko „Suma netto”.
- „Rekomendowany zestaw” dodaje: strategię, Brand Guide PRO, sesję i Stronę PRO (bez B2B Outreach).
- Wybór jest zapisywany w `localStorage` i przetrwa odświeżenie strony.
- Serwer **nie ufa cenom z przeglądarki** — przyjmuje tylko identyfikatory usług i przelicza ceny
  na podstawie `src/content/proposal.ts`.
- Ekran sukcesu pojawia się dopiero po potwierdzeniu wysyłki przez serwer; przy błędzie wybór
  pozostaje nienaruszony.
- Email do klienta (potwierdzenie) jest wysyłany po udanym emailu do administratora; jego ewentualny
  błąd nie unieważnia zgłoszenia.

## Zmiana cen lub zakresu

Edytuj wyłącznie `src/content/proposal.ts` — interfejs, sumy, zestaw rekomendowany i treść emaili
zaktualizują się automatycznie.

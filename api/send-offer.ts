/**
 * Vercel Function — POST /api/send-offer
 *
 * Wymagane zmienne środowiskowe (ustawiane w panelu Vercel, nie w kodzie):
 *   RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL
 */
import { handleSendOffer } from '../server/sendOffer.js'

export function POST(request: Request): Promise<Response> {
  return handleSendOffer(request)
}

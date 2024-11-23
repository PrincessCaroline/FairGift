import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'fr'];

export function middleware(request: Request) {
    const response = NextResponse.next();

    const localeCookie = request.headers.get('cookie')?.match(/NEXT_LOCALE=(en|fr)/)?.[1];
    if (!localeCookie) {
        const browserLang = request.headers.get('accept-language')?.split(',')[0]?.slice(0, 2) || 'en';
        const locale = SUPPORTED_LOCALES.includes(browserLang) ? browserLang : 'en';

        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 an
        });
    }

    return response;
}

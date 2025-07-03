'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { ChangeEvent, useTransition } from 'react';

// Define supported locales and their display names
const locales = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <label className="relative" aria-label='language-switcher'>
            <select
                className="language-switcher py-2 px-3 pr-8 text-sm "
                value={locale}
                onChange={onSelectChange}
                disabled={isPending}
                id="language-switcher"
            >
                {locales.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                        {loc.name}
                    </option>
                ))}
            </select>
        </label>
    );
}
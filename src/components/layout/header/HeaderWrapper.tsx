'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import HeaderMain from './Header-main';
import HeaderWhite from './Header-white';
import { HeaderWrapperProps } from '@/interfaces/content';

export default function HeaderWrapper({ data }: HeaderWrapperProps) {
    const headerType = useSelector((state: RootState) => state.header.headerType);

    if (headerType === "dark") {
        return <HeaderMain data={data} />;
    }
    else {
        return <HeaderWhite data={data} />;
    }

}

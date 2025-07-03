import React from 'react'
import Button from '@/components/ui/Button';
import Link from 'next/link';

const notFound = () => {
    return (
        <div className="h-screen flex items-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-[20px] text-7xl text-accent-primary heading-h1-medium">404</h1>
                    <p className="mb-[20px] text-3xl  text-accent-primary heading-h3-medium">Something missing.</p>
                    <p className="mb-[30px] text-lg body1-regular">Sorry, we cant find that page. You will find lots to explore on the home page. </p>
                    <Link href="/">
                        <Button>Back to Homepage</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default notFound
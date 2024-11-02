import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

type headerGenericProps = {
    name: string
    url?: string
}

export default function HeaderGeneric({ name, url }: headerGenericProps) {
    const router = useRouter();

    const goBack = () => {
        console.log("url", url)
        router.push(url ?? "/dashboard");
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <XMarkIcon className="h-6 w-6 text-black cursor-pointer" onClick={goBack} />
            <h1 className="text-lg font-medium  text-gray-800">{name}</h1>
            <div className="w-6" />
        </header>
    )
}
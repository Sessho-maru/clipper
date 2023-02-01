import { RefObject, useEffect, useState } from 'react';

function useMarkerMutable<T extends HTMLInputElement = HTMLInputElement>(elementRef: RefObject<T>): boolean {
    const [value, setValue] = useState<boolean>(false);

    const makeMutable = (): void => {
        if (value === false) {
            setValue(true);
        }
    }

    useEffect(() => {
        const node = elementRef.current;
        if (node) {
            node.addEventListener('dblclick', makeMutable);
            return () => {
                node.removeEventListener('dblclick', makeMutable);
            }
        }
    }, [elementRef]);

    return value;
}

export default useMarkerMutable;
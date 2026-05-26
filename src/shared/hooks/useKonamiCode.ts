import { useEffect, useRef } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export function useKonamiCode(onSuccess: () => void) {
    const inputRef = useRef<string[]>([]);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            const keys = inputRef.current;
            keys.push(e.key)

            if (keys.length > KONAMI_CODE.length) {
                keys.shift()
            }

            const isMatch = KONAMI_CODE.every(
                (key, index) => key.toLowerCase() === keys[index]?.toLowerCase()
            );
            if (isMatch) {
                onSuccess();
                inputRef.current = []
            }
        };
        window.addEventListener('keydown', handleKeydown);

        return () => window.removeEventListener('keydown', handleKeydown)
    }, [onSuccess])
}
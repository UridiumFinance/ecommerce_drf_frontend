import { useEffect, useRef } from "react";

export default function useDebounce<T>(value: T, delay: number, callback: (val: T) => void): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // limpia si existía un timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // programa el callback
    timerRef.current = setTimeout(() => callback(value), delay);

    // cleanup al desmontar / al cambiar value o delay
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, callback]);
}

// Use hook demo
// // 1. Estado del input
//   const [query, setQuery] = useState<string>('');

//   // 2. Llamamos a useDebounce pasándole:
//   //    - el valor a “escuchar” (query)
//   //    - el retardo en milisegundos (ej. 500ms)
//   //    - la función que queremos disparar al terminar el debounce
//   useDebounce<string>(
//     query,
//     500,
//     (debouncedValue) => {
//       // aquí ejecutamos la búsqueda / petición
//       console.log('Buscando:', debouncedValue);
//       // fetch(`/api/search?q=${debouncedValue}`).then(...)
//     }
//   );

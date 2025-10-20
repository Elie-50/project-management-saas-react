import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = {
  error: string | null;
};

function ErrorMessage({ error }: Props) {
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [error]);

  if (!error) return null;

  return (
    <p
      ref={errorRef}
      className="text-red-500 text-md text-center font-semibold"
    >
      {error}
    </p>
  );
}

export default ErrorMessage
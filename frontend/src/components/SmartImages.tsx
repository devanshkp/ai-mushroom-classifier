import { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  placeholderSrc?: string;
  rootMargin?: string;
};

export default function SmartImage({
  src,
  placeholderSrc,
  rootMargin = "300px",
  alt,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const shownSrc = inView ? src : placeholderSrc;

  return (
    <img
      ref={ref}
      src={shownSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={rest.width as any}
      height={rest.height as any}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: inView ? (loaded ? 1 : 0.001) : 1,
        transition: "opacity 200ms ease",
      }}
      {...rest}
    />
  );
}

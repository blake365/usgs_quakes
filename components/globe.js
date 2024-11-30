import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe({markers}) {
  const canvasRef = useRef();

  useEffect(() => {
    let width = 0;
    let phi = 0;

    const onResize = () => {
      if (canvasRef.current) {
        const containerSize = Math.min(
          window.innerWidth * 0.8,
          window.innerHeight * 0.7
        );
        width = Math.min(600, containerSize);
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${width}px`;
      }
    }

    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.9, 0.3, 0.5],
      glowColor: [1, 1, 1],
      markers: markers,
      opacity: 0.8,
      onRender: (state) => {
        state.width = width * 2;
        state.height = width * 2;
        state.phi = phi;
        phi += 0.006;
      }
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [markers]);

  return (
    <div className="flex items-center justify-center w-full p-4">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "600px",
          aspectRatio: "1/1",
          opacity: 0,
          transition: "opacity 1s ease-in-out"
        }}
      />
    </div>
  );
}
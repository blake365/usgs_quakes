import createGlobe from "cobe";
import { useEffect, useRef } from "react";

// https://github.com/shuding/cobe

export default function Globe({markers}) {
  const canvasRef = useRef();

//   console.log(markers)

  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
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
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.006;
      }
    });

    return () => {
      globe.destroy();
    };
  }, [markers]);

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      />
    </div>
  );
}
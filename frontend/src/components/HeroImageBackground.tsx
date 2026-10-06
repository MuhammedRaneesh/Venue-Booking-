import { useState, useEffect } from "react"
import image1 from "@/assets/pexels-reneterp-14203521.jpg"
import image2 from "@/assets/arto-suraj-H4WvwmVdvbs-unsplash.jpg"
import image3 from "@/assets/djfrancisco-perez-XG-bLu2bxaI-unsplash (1).jpg"

const images = [image1 , image2 , image3]

const INTERVAL_MS = 5000

export default function HeroImageBackground() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}
      <div className="absolute inset-0 bg-background/70 mix-blend-multiply" />
      <div className="absolute inset-0 bg-brand-accent/10" />
    </div>
  )
}
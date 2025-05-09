"use client"

import { useEffect } from "react"

export function SplineBackground() {
  useEffect(() => {
    // Dynamically add the Spline Viewer script
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
    document.body.appendChild(script)

    // Create the Spline viewer element
    const viewer = document.createElement("spline-viewer")
    viewer.setAttribute("url", "https://prod.spline.design/FKUZycdabP-LXIG7/scene.splinecode")
    viewer.style.position = "fixed"
    viewer.style.top = "0"
    viewer.style.left = "0"
    viewer.style.width = "100%"
    viewer.style.height = "120%"
    viewer.style.zIndex = "-1"
    viewer.style.transform = "translateY(60px)"
    viewer.style.opacity = "0"
    viewer.style.transition = "opacity 1.5s ease-in-out"
    document.body.appendChild(viewer)

    // Fade in the animation after a short delay
    setTimeout(() => {
      viewer.style.opacity = "1"
    }, 50)

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(viewer)
      document.body.removeChild(script)
    }
  }, [])

  return null
}

'use client'

import { useEffect, useState } from 'react'

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold text-lg">Install App</h3>
      {isIOS ? (
        <div className="text-sm">
          <p className="mb-2">To install this app on your iOS device:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Tap the Share button</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the top right corner</li>
          </ol>
        </div>
      ) : (
        <p className="text-sm">
          Install this app to your home screen for quick and easy access when
          you&apos;re on the go.
        </p>
      )}
    </div>
  )
}

export default InstallPrompt


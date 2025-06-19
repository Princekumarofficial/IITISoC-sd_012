"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Camera, CameraOff, Mic, MicOff, RefreshCw } from "lucide-react"
import { useNotifications } from "./Notification-system"

interface CameraManagerProps {
  onStreamReady?: (stream: MediaStream) => void
  className?: string
}

export function CameraManager({ onStreamReady, className }: CameraManagerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[]
    microphones: MediaDeviceInfo[]
  }>({ cameras: [], microphones: [] })
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt")

  const videoRef = useRef<HTMLVideoElement>(null)
  const { addNotification } = useNotifications()

  // Check permissions
  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName })
      const micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName })

      if (cameraPermission.state === "granted" && micPermission.state === "granted") {
        setPermissionState("granted")
      } else if (cameraPermission.state === "denied" || micPermission.state === "denied") {
        setPermissionState("denied")
      }
       // If granted, auto start
      // if (cameraPermission.state === "granted") {
      //   await startCamera();
      // }

    } catch (err) {
      console.log("Permission API not supported")
    }
  }

  // Get available devices
  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()

      const cameras = deviceList.filter((device) => device.kind === "videoinput")
      const microphones = deviceList.filter((device) => device.kind === "audioinput")

      setDevices({ cameras, microphones })

      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId)
      }
      if (microphones.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(microphones[0].deviceId)
      }
    } catch (err) {
      console.error("Error getting devices:", err)
      setError("Failed to get device list")
    }
  }

  useEffect(() => {
    checkPermissions()
    getDevices()
  }, [])

  // Initialize camera with better error handling
  const startCamera = async () => {
    setIsLoading(true)
    setError(null)

      // if (!selectedCamera || !selectedMicrophone) {
      // setError("Please select both a camera and a microphone first.")
      
      //  addNotification({
      //   type: "error",
      //   title: "Camera Error",
      //   message: "Please select both a camera and a microphone first.",
      // })
      // return
      // }

    try {
      // Stop existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: isVideoEnabled
          ? {
              deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
              facingMode: "user",
            }
          : false,
        audio: isAudioEnabled
          ? {
              deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 44100,
            }
          : false,
      }

      console.log("Requesting media with constraints:", constraints)

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      console.log("Media stream obtained:", mediaStream)
      console.log("Video tracks:", mediaStream.getVideoTracks())
      console.log("Audio tracks:", mediaStream.getAudioTracks())

      setStream(mediaStream)
      setPermissionState("granted")

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error)
        }
      }

      onStreamReady?.(mediaStream)

      addNotification({
        type: "success",
        title: "Camera Ready",
        message: "Your camera and microphone are now active!",
      })

      // Refresh device list after successful connection
      await getDevices()
    } catch (err: any) {
      console.error("Camera error:", err)

      let errorMessage = "Failed to access camera."

      switch (err.name) {
        case "NotAllowedError":
          errorMessage = "Camera access denied. Please allow camera permissions and try again."
          setPermissionState("denied")
          break
        case "NotFoundError":
          errorMessage = "No camera found. Please connect a camera device."
          break
        case "NotReadableError":
          errorMessage = "Camera is being used by another application."
          break
        case "OverconstrainedError":
          errorMessage = "Camera doesn't support the requested settings."
          break
        case "SecurityError":
          errorMessage = "Camera access blocked due to security restrictions."
          break
        case "AbortError":
          errorMessage = "Camera access was aborted."
          break
        default:
          errorMessage = `Camera error: ${err.message || "Unknown error"}`
      }

      setError(errorMessage)
      addNotification({
        type: "error",
        title: "Camera Error",
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
        console.log(`Stopped ${track.kind} track`)
      })
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      addNotification({
        type: "info",
        title: "Camera Stopped",
        message: "Camera and microphone have been turned off",
      })
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
        addNotification({
          type: "info",
          title: videoTrack.enabled ? "Video On" : "Video Off",
          message: videoTrack.enabled ? "Camera is now on" : "Camera is now off",
          duration: 2000,
        })
      }
    } else {
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
        addNotification({
          type: "info",
          title: audioTrack.enabled ? "Microphone On" : "Microphone Off",
          message: audioTrack.enabled ? "Microphone is now on" : "Microphone is now off",
          duration: 2000,
        })
      }
    } else {
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  // Refresh devices
  const refreshDevices = async () => {
    await getDevices()
    addNotification({
      type: "info",
      title: "Devices Refreshed",
      message: "Device list has been updated",
      duration: 2000,
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <Card className={`video-container ${className}`}>
      <div className="relative">
        {stream && isVideoEnabled ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center rounded-lg">
            {isLoading ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Starting camera...</p>
              </div>
            ) : error ? (
              <div className="text-center space-y-4 p-6 max-w-sm">
                <CameraOff className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm font-medium text-red-500">Camera Error</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
                </div>
                <div className="space-y-2">
                  <Button onClick={startCamera} size="sm" className="w-full">
                    Try Again
                  </Button>
                  {permissionState === "denied" && (
                    <p className="text-xs text-muted-foreground">
                      Please enable camera permissions in your browser settings
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Camera className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Camera Ready</p>
                  <p className="text-xs text-muted-foreground">Click to start your camera</p>
                </div>
                <Button onClick={startCamera} className="glow">
                  Start Camera
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Video overlay effects */}
        {stream && isVideoEnabled && <div className="video-overlay" />}

        {/* Controls overlay */}
        {stream && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={isVideoEnabled ? "default" : "destructive"} className="glass">
                  {isVideoEnabled ? <Camera className="w-3 h-3 mr-1" /> : <CameraOff className="w-3 h-3 mr-1" />}
                  Video
                </Badge>
                <Badge variant={isAudioEnabled ? "default" : "destructive"} className="glass">
                  {isAudioEnabled ? <Mic className="w-3 h-3 mr-1" /> : <MicOff className="w-3 h-3 mr-1" />}
                  Audio
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  onClick={toggleVideo}
                  className="glass"
                >
                  {isVideoEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  onClick={toggleAudio}
                  className="glass"
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={stopCamera} className="glass">
                  Stop
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Device selection */}
        {!stream && devices.cameras.length > 0 && (
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger className="glass text-xs">
                  <SelectValue placeholder="Select Camera" />
                </SelectTrigger>
                <SelectContent>
                  {devices.cameras.map((camera) => (
                    <SelectItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={refreshDevices} className="glass">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {devices.microphones.length > 0 && (
              <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                <SelectTrigger className="glass text-xs">
                  <SelectValue placeholder="Select Microphone" />
                </SelectTrigger>
                <SelectContent>
                  {devices.microphones.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

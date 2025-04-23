"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Download, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Client } from "@gradio/client"

export function TryRoom() {
  const [image, setImage] = useState<File | null>(null)
  const [clothing, setClothing] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [clothingPreview, setClothingPreview] = useState<string | null>(null)
  const [height, setHeight] = useState(500)
  const [width, setWidth] = useState(500)
  const [guidanceScale, setGuidanceScale] = useState(2.5)
  const [inferenceSteps, setInferenceSteps] = useState(50)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Cloth Type State
  const [clothType, setClothType] = useState<string>("upper")

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const clothingInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const fileToBlob = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          const byteCharacters = atob((reader.result as string).split(",")[1])
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: file.type })
          resolve(blob)
        } else {
          reject(new Error("Failed to convert file to Blob"))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setGeneratedImage("")
    e.preventDefault()
    if (!image || !clothing) {
      setError("Please upload both images.")
      return
    }
    setLoading(true)
    try {
      const imageBlob = await fileToBlob(image)
      const clothingBlob = await fileToBlob(clothing)

      const client = await Client.connect("https://6fca2a50683292ef5c.gradio.live")

      const result = await client.predict("/viton_interface", {
        person_image: imageBlob,
        cloth_image: clothingBlob,
        output_dir: "output",
        height: height,
        width: width,
        base_model_path: "runwayml/stable-diffusion-inpainting",
        resume_path: "zhengchong/CatVTON",
        mixed_precision: "fp16",
        num_inference_steps: inferenceSteps,
        guidance_scale: guidanceScale,
        seed: 555,
        repaint: false,
        concat_eval_results: true,
        cloth_type: clothType,
      })

      setGeneratedImage(result.data[0].url)
      setError("")
    } catch (error) {
      setError("Failed to generate image")
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = () => imageInputRef.current?.click()
  const handleClothingClick = () => clothingInputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleClothingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setClothing(file)
      setClothingPreview(URL.createObjectURL(file))
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const blob = new Blob([generatedImage], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "generated-image.jpg"
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImageRemove = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleClothingRemove = () => {
    setClothing(null)
    setClothingPreview(null)
  }

  return (
    <>
        <h1 className="text-center p-8 text-2xl font-bold md:text-3xl">Try Room</h1>

    <div className="relative flex flex-col md:flex-row bg-gray-50 mb-24">
      {/* Left Panel - Upload and Settings */}
      <div className="w-full md:w-2/5 p-4 border-b md:border-r shadow-lg rounded-lg mb-6 md:mb-0">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Person Image</h3>
                <div
                  className="relative aspect-[4/5] rounded-lg border-2 border-dashed bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-lg"
                  onClick={handleImageClick}
                >
                  {imagePreview ? (
                    <>
                      <button
                        className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageRemove()
                        }}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">Drop your photo or click to upload</p>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Clothing Image</h3>
                <div
                  className="relative aspect-[4/5] rounded-lg border-2 border-dashed bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-lg"
                  onClick={handleClothingClick}
                >
                  {clothingPreview ? (
                    <>
                      <button
                        className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClothingRemove()
                        }}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                      <img
                        src={clothingPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">Drop clothing or click to upload</p>
                    </div>
                  )}
                  <input
                    ref={clothingInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleClothingChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Generation Settings</h2>
            {/* Cloth Type Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cloth Type</label>
              <select
                value={clothType}
                onChange={(e) => setClothType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
                <option value="overall">Overall</option>
                <option value="inner">Inner</option>
                <option value="outer">Outer</option>
              </select>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height</label>
                  <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width</label>
                  <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Inference Steps</label>
                  <span className="text-sm text-gray-500">{inferenceSteps}</span>
                </div>
                <Slider
                  value={[inferenceSteps]}
                  onValueChange={([value]) => setInferenceSteps(value)}
                  max={150}
                  min={1}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Guidance Scale</label>
                  <span className="text-sm text-gray-500">{guidanceScale}</span>
                </div>
                <Slider
                  value={[guidanceScale]}
                  onValueChange={([value]) => setGuidanceScale(value)}
                  max={10}
                  min={1}
                  step={0.1}
                  defaultValue={2.5}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col gap-4">
            <Button
              className="w-full h-10 text-base relative transition-all duration-200 hover:bg-blue-600 active:scale-95"
              onClick={handleSubmit}
              disabled={loading || !image || !clothing}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        </div>
      </div>

      {/* Right Panel - Result */}
      <div className="w-full md:w-3/5 p-4 bg-white rounded-lg shadow-lg">
        <div className="h-full flex flex-col ">
          <h2 className="text-lg font-semibold mb-4">Result</h2>
          {generatedImage && !loading ? (
  <div className="flex-1 flex flex-col max-h-[70vh]">
    <div className="flex-1 relative rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 overflow-hidden shadow-lg">
      <img
        src={generatedImage || "/placeholder.svg"}
        alt="Generated"
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
    <div className="flex flex-col items-center">
      <Button variant="outline" className="mt-4 w-[30%] bg-blue-600 text-white rounded-xm hover:bg-blue-500" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download Result
      </Button>
    </div>
  </div>
) : (
  <div className={`flex-1 flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 ${loading ? 'animate-pulse' : ''} max-h-[70vh]`}>
    <p className="text-gray-500">Generated image will appear here</p>
  </div>
)}

        </div>
      </div>
    </div>
    </>
  )
}

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  X,
  Download,
  Loader2,
  Settings,
  ImageIcon,
  Shirt,
  Sparkles,
  ChevronRight,
  Check,
  Info,
  ArrowLeft,
  // Share2,
  Zap,
  Sliders,
  Eye,
  RotateCw,
  Undo2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"


// Preset configurations for quick settings
const presets = [
  {
    name: "Standard",
    inferenceSteps: 20,
    guidanceScale: 2.5,
    description: "Balanced quality and speed",
  },
  {
    name: "High Quality",
    inferenceSteps: 40,
    guidanceScale: 3,
    description: "Best quality, slower generation",
  },
  {
    name: "Fast",
    inferenceSteps: 10,
    guidanceScale: 2.0,
    description: "Quicker results, lower quality",
  },
  {
    name: "Creative",
    inferenceSteps: 60,
    guidanceScale: 5.0,
    description: "More creative variations",
  },
]

export function TryRoom() {
  const [image, setImage] = useState<File | null>(null)
  const [clothing, setClothing] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [clothingPreview, setClothingPreview] = useState<string | null>(null)
  const [height, setHeight] = useState(512)
  const [width, setWidth] = useState(512)
  const [personheight, setpersonHeight] = useState(0)
  const [personwidth, setpersonWidth] = useState(0)
  const [guidanceScale, setGuidanceScale] = useState(2.5)
  const [inferenceSteps, setInferenceSteps] = useState(10)
  const [seed, setSeed] = useState("555")
  const [repaint, setRepaint] = useState(false)
  const [concatEvalResults, setConcatEvalResults] = useState(true)
  const [clothType, setClothType] = useState("upper")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [advancedMode, setAdvancedMode] = useState(true)
  const [generationHistory, setGenerationHistory] = useState<Array<{ id: string; image: string; timestamp: Date }>>([])
  const [scaleFactor, setScaleFactor] = useState(1)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const clothingInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()
  const [upscale, setUpscale] = useState(false);


  const API = "https://rvhhmsa3o7chw7s5nuz4j7uxvi0hqukt.lambda-url.eu-north-1.on.aws/"
  const navigate= useNavigate();
  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {   
        navigate("/login");
      }
    }
    checkAuth();
  }, []);
  
  // Apply preset settings
  useEffect(() => {
    if (selectedPreset) {
      const preset = presets.find((p) => p.name === selectedPreset)
      if (preset) {
        setInferenceSteps(preset.inferenceSteps)
        setGuidanceScale(preset.guidanceScale)
        toast({
          title: `Applied ${preset.name} preset`,
          description: preset.description,
        })
      }
    }
  }, [selectedPreset, toast])

  // Simulate progress during generation
  useEffect(() => {
    if (loading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval)
            return 99
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    } else if (progress === 99 && generatedImage) {
      setProgress(100)
    }
  }, [loading, generatedImage])

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


  const getImageDims = (file: Blob) => {
    const img = new Image();
    img.onload = () => {
      let newWidth = img.width;
      let newHeight = img.height;
  
      setpersonWidth(newWidth);
      setpersonHeight(newHeight);
  
      // Upscale if smaller than 300
      if (newWidth < 300 || newHeight < 300) {
        newWidth *= 2;
        newHeight *= 2;
      }
  
      // Downscale proportionally if larger than 1024
      const maxDimension = 768;
      if (newWidth > maxDimension || newHeight > maxDimension) {
        const scale = maxDimension / Math.max(newWidth, newHeight);
        newWidth *= scale;
        newHeight *= scale;
        setpersonHeight(newHeight);
        setpersonWidth(newWidth);
      }
  
      // Final rounding
      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);
  
      setWidth(newWidth);
      setHeight(newHeight);
  
      URL.revokeObjectURL(img.src); // cleanup
    };
    img.src = URL.createObjectURL(file);
  };
  
  

const handleScaleFactor = (value: number) => {
  setScaleFactor(value);
  let newWidth = Math.round(personwidth * value);
  let newHeight = Math.round(personheight * value);
  
  const maxDimension = 768;
  if (newWidth > maxDimension || newHeight > maxDimension) {
    const scale = maxDimension / Math.max(newWidth, newHeight);
    newWidth *= scale;
    newHeight *= scale;
    setWidth(Math.round(newWidth));
    setHeight(Math.round(newHeight));

  }
  // toast({
  //   title: "Scaler Factor Applied",
  //   description: `Width: ${newWidth}px, Height: ${newHeight}px`,
  // });
  }

  const handleSubmit = async () => {
    if (!image || !clothing) {
      toast({
        title: "Missing images",
        description: "Please upload both a person image and a clothing image.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGeneratedImage(null)

    try {
      const imageBlob = await fileToBlob(image)
      const clothingBlob = await fileToBlob(clothing)

      const formData = new FormData()
      // Required input parameters
      formData.append("person_image", imageBlob, "person.jpg")
      formData.append("cloth_image", clothingBlob, "cloth.jpg")
      formData.append("height", height.toString())
      formData.append("width", width.toString())
      formData.append("num_inference_steps", inferenceSteps.toString())
      formData.append("guidance_scale", guidanceScale.toString())
      formData.append("seed", "555")
      formData.append("repaint", repaint ? "true" : "false")
      formData.append("concat_eval_results", concatEvalResults.toString())
      formData.append("cloth_type", clothType)

      // Additional parameters
      formData.append("base_model_path", "runwayml/stable-diffusion-inpainting")
      formData.append("resume_path", "zhengchong/CatVTON")
      formData.append("mixed_precision", "fp16")

      const response = await fetch(API, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        if (upscale) {
          const upscaleForm = new FormData();
          upscaleForm.append('upscale_factor', '2');
          upscaleForm.append('format', 'JPG');
          upscaleForm.append('image', blob); // Upload blob directly!
        
          const upscaleOptions = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'X-Picsart-API-Key': 'eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtZWY4NTdlNjEtYWY2ZC00Zjc1LTkwZTUtNDg3NzViZGE5OGEzIiwiYXVkIjoiNDYwMTI4NjIzMDE0MTAxIiwibmJmIjoxNzQ1NzQ5NjEyLCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDYwMTI4NjIzMDE0MTAxIiwiaWF0IjoxNzQ1NzQ5NjEyLCJqdGkiOiJlODQ3NWVjNi1iMjJhLTQxMzQtYTllNS1iMzAxZmU5M2M5NmMifQ.jSX7Dbexvov4AoFawKVgR0Qsi_OC9p16qHmAwicGDnctufuQnwTatBle8Y7hSDho5bWzlBpYqGDNk8lyFzJBQcmJTJsCSlFlmn1VGPk63wE0vk4RCn7CDVxgOMWJafNLfb3ephnMZpA5_wgkD9ZjUv6i_NaX3-fD61Tkg8HggWy9BePPZiUQ5L8GzX6DE66x12I4UkMVdbjXxAJAc428edmintNy8IRCPw2FMWuUsemj3_V3aEb8n1amE5I7mQhKu4Malnx3lqUFf2TNqM4dpirB_1vb7QIfwi-NFqxlAq29cya8m204zuOcZxT5zGgleVzfAkBELKCWOVJHeJd4lg', // 👈 your API key
            },
            body: upscaleForm,
          };
        
          try {
            const upscaleResponse = await fetch('https://api.picsart.io/tools/1.0/upscale', upscaleOptions);
            const upscaleData = await upscaleResponse.json();
        
            if (upscaleData?.data?.url) {
              console.log("Upscaled image URL:", upscaleData.data.url);
              setGeneratedImage(upscaleData.data.url);
            } else {
              console.error("Upscale failed, using original image.");
              setGeneratedImage(imageUrl);
            }
          } catch (upscaleError) {
            console.error("Upscale API error:", upscaleError);
            setGeneratedImage(imageUrl);
          }
        } else {
          setGeneratedImage(imageUrl);
        }
        // setGeneratedImage(imageUrl)
        setActiveTab("result")

        // Add to history
        const newHistoryItem = {
          id: Date.now().toString(),
          image: imageUrl,
          timestamp: new Date(),
        }
        setGenerationHistory((prev) => [newHistoryItem, ...prev])

        toast({
          title: "Success!",
          description: "Your virtual try-on has been generated.",
        })
      } else {
        const errorText = await response.text()
        toast({
          title: "Generation failed",
          description: errorText || "An error occurred during image generation.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
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
      const imageBlob = new Blob([file], { type: file.type })
      getImageDims(imageBlob);

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
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "virtual-try-on.jpg"
      link.click()
    }
  }

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImage(null)
    setImagePreview(null)
  }

  const handleClothingRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setClothing(null)
    setClothingPreview(null)
  }

  const handleShare = () => {
    if (generatedImage && navigator.share) {
      fetch(generatedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "virtual-try-on.jpg", { type: "image/jpeg" })
          navigator
            .share({
              title: "My Virtual Try-On",
              text: "Check out my virtual try-on!",
              files: [file],
            })
            .catch((err) => {
              console.error("Error sharing:", err)
              toast({
                title: "Sharing failed",
                description: "Could not share the image. Try downloading it instead.",
                variant: "destructive",
              })
            })
        })
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support sharing. Try downloading the image instead.",
      })
    }
  }

  const resetSettings = () => {
    setHeight(512)
    setWidth(512)
    setGuidanceScale(7.5)
    setInferenceSteps(50)
    setSeed("555")
    setRepaint(false)
    setConcatEvalResults(true)
    setClothType("upper")
    setSelectedPreset(null)
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    })
  }

  const nextStep = () => {
    if (!image || !clothing) {
      toast({
        title: "Missing images",
        description: "Please upload both a person image and a clothing image.",
      })
      return
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    if (activeTab === "upload") {
      setActiveTab("settings")
      setCurrentStep(2)
    } else if (activeTab === "settings") {
      setActiveTab("result")
      setCurrentStep(3)
    } else if (activeTab === "result") {
      // Already at last step, maybe do nothing or show a toast
      toast({
        title: "Already at final step",
        description: "You are already viewing the result.",
      })
    }
  }
  

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 2) setActiveTab("upload")
      if (currentStep === 3) setActiveTab("settings")
    }
  }

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000).toString()
    setSeed(newSeed)
    toast({
      title: "Random seed generated",
      description: `New seed: ${newSeed}`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Virtual Try-On Experience
          </motion.h1>
          <motion.p
            className="text-gray-500 text-center max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform your shopping experience with our advanced AI-powered virtual fitting room
          </motion.p>
        </div>

 

        {/* Step Indicator */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center ">
            <div
              className={`shadow-xl  flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div
              className={`shadow-xl  flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > 2 ? <Check className="w-5 h-5" /> : 2}
            </div>
            <div className={`w-12 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div
              className={`shadow-xl  flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className=" w-full">
        <TabsList className="grid grid-cols-3 mb-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-gray-200">
        <TabsTrigger
              value="upload"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:rounded-2xl data-[state=active]:text-blue-700"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:rounded-2xl data-[state=active]:text-blue-700"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="data-[state=active]:rounded-2xl flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Result</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <TabsContent value="upload" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl overflow-hidden bg-white">
                      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 pb-4">
                        <CardTitle className="text-xl text-gray-800 flex items-center">
                          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            1
                          </span>
                          Upload Images
                        </CardTitle>
                        <CardDescription>
                          Upload a person photo and a clothing item to create your virtual try-on
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <span>Person Image</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px]">
                                      Upload a front-facing photo of a person for best results
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </label>
                            <div
                              className={`relative aspect-[3/4] rounded-xl border-2 ${
                                imagePreview ? "border-solid border-blue-200" : "border-dashed border-gray-300"
                              } bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer overflow-hidden group`}
                              onClick={handleImageClick}
                            >
                              {imagePreview ? (
                                <>
                                  <button
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors hover:text-blue-600"
                                    onClick={handleImageRemove}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </button>
                                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Person preview"
                                    className="w-full h-full object-cover"
                                  />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <Upload className="h-6 w-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700 text-center">Upload your photo</p>
                                  <p className="text-xs text-gray-500 text-center mt-1">
                                    Drag and drop or click to browse
                                  </p>
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
                            <p className="text-xs text-gray-500">
                              Required parameter: <code>person_image</code>
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <span>Clothing Image</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px]">Upload a clothing item with a clean background</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </label>
                            <div
                              className={`relative aspect-[3/4] rounded-xl border-2 ${
                                clothingPreview ? "border-solid border-blue-200" : "border-dashed border-gray-300"
                              } bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer overflow-hidden group`}
                              onClick={handleClothingClick}
                            >
                              {clothingPreview ? (
                                <>
                                  <button
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors hover:text-blue-600"
                                    onClick={handleClothingRemove}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </button>
                                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                                  <img
                                    src={clothingPreview || "/placeholder.svg"}
                                    alt="Clothing preview"
                                    className="w-full h-full object-cover"
                                  />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <Shirt className="h-6 w-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700 text-center">Upload clothing</p>
                                  <p className="text-xs text-gray-500 text-center mt-1">
                                    Drag and drop or click to browse
                                  </p>
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
                            <p className="text-xs text-gray-500">
                              Required parameter: <code>cloth_image</code>
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Info className="h-4 w-4 text-blue-600 mr-2" />
                            <h3 className="text-sm font-medium text-blue-800">Clothing Type</h3>
                          </div>
                          <div className="space-y-2">
                            <Select value={clothType} onValueChange={setClothType}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select clothing type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upper">Upper Body</SelectItem>
                                <SelectItem value="lower">Lower Body</SelectItem>
                                <SelectItem value="overall">Overall</SelectItem>
                                <SelectItem value="inner">Inner Layer</SelectItem>
                                <SelectItem value="outer">Outer Layer</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                              Parameter: <code>cloth_type</code> = <code>"{clothType}"</code>
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <Button
                            onClick={nextStep}
                            className=" text-xm shadow-xl  bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:text-white"
                            disabled={!image || !clothing}
                          >
                            Next Step
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl overflow-hidden bg-white">
                      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 pb-4">
                        <CardTitle className="text-xl text-gray-800 flex items-center">
                          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            2
                          </span>
                          Generation Settings
                        </CardTitle>
                        <CardDescription>Configure parameters to control the generation process</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-medium">Quick Presets</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="advanced-mode" className="text-sm text-gray-600">
                              Advanced Mode
                            </Label>
                            <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {presets.map((preset) => (
                            <div
                              key={preset.name}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedPreset === preset.name
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                              onClick={() => setSelectedPreset(preset.name)}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-800">{preset.name}</h4>
                                {selectedPreset === preset.name && <Check className="h-4 w-4 text-blue-600" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-2">
                                <Badge variant="outline" className="bg-blue-50">
                                  Steps: {preset.inferenceSteps}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50">
                                  Guidance: {preset.guidanceScale}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 flex items-center">
                                <span>Image Height</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Output image height in pixels (recommended: 512px)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <Input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(+e.target.value)}
                                className="focus-visible:ring-blue-500"
                                min={256}
                                max={1024}
                                step={8}
                              />
                              <p className="text-xs text-gray-500">
                                Parameter: <code>height</code> = <code>{height}</code>
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 flex items-center">
                                <span>Image Width</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Output image width in pixels (recommended: 512px)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <Input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(+e.target.value)}
                                className="focus-visible:ring-blue-500"
                                min={256}
                                max={1024}
                                step={8}
                              />
                              <p className="text-xs text-gray-500">
                                Parameter: <code>width</code> = <code>{width}</code>
                              </p>
                            </div>
                          </div>
                          

                          <div className="space-y-3">
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      <span>Scale Factor</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 ml-2 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>If image is small, multiply width/height by this factor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>
    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
      {scaleFactor.toFixed(1)}×
    </span>
  </div>
  <Slider
    value={[scaleFactor]}
    onValueChange={([value]) => handleScaleFactor(value)}
    max={1.5}
    min={1}
    step={0.1}
    className="cursor-pointer [&>span:first-child]:bg-blue-100 [&>span:first-child_span]:bg-blue-600"
  />
  <p className="text-xs text-gray-500">
    Will apply when uploaded image size is smaller than 300px.
  </p>
</div>


                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium text-gray-700 flex items-center">
                                <span>Inference Steps</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Higher values produce more detailed results but take longer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {inferenceSteps}
                              </span>
                            </div>
                            <Slider
                              value={[inferenceSteps]}
                              onValueChange={([value]) => setInferenceSteps(value)}
                              max={100}
                              min={10}
                              step={1}
                              className="[&>span:first-child]:bg-blue-100 [&>span:first-child_span]:bg-blue-600"
                            />
                            <p className="text-xs text-gray-500">
                              Parameter: <code>num_inference_steps</code> = <code>{inferenceSteps}</code>
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium text-gray-700 flex items-center">
                                <span>Guidance Scale</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Controls how closely the result follows the prompt</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {guidanceScale.toFixed(1)}
                              </span>
                            </div>
                            <Slider
                              value={[guidanceScale]}
                              onValueChange={([value]) => setGuidanceScale(value)}
                              max={20}
                              min={1}
                              step={0.1}
                              className="[&>span:first-child]:bg-blue-100 [&>span:first-child_span]:bg-blue-600"
                            />
                            <p className="text-xs text-gray-500">
                              Parameter: <code>guidance_scale</code> = <code>{guidanceScale}</code>
                            </p>
                          </div>

                          {advancedMode && (
                            <>
                              <Separator className="my-4" />

                              <div className="space-y-4">
                                <h3 className="text-sm font-medium flex items-center">
                                  <Sliders className="h-4 w-4 mr-2 text-blue-600" />
                                  Advanced Parameters
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Seed</label>
                                    <div className="flex space-x-2">
                                      <Input
                                        type="text"
                                        value={seed}
                                        onChange={(e) => setSeed(e.target.value)}
                                        className="focus-visible:ring-blue-500"
                                      />
                                      <Button
                                        variant="outline"
                                        // size="icon"
                                        onClick={generateRandomSeed}
                                        className="hover:text-blue-600"
                                      >
                                        <RotateCw className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      Parameter: <code>seed</code> = <code>"{seed}"</code>
                                    </p>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-gray-700">Repaint</label>
                                        <p className="text-xs text-gray-500">Enable repainting during generation</p>
                                      </div>
                                      <Switch checked={repaint} onCheckedChange={setRepaint} />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      Parameter: <code>repaint</code> = <code>{repaint ? "true" : "false"}</code>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <label className="text-sm font-medium text-gray-700">Upscale Image</label>
                                    <p className="text-xs text-gray-500">Upscale Image</p>
                                  </div>
                                  <Switch checked={upscale} onCheckedChange={setUpscale} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <label className="text-sm font-medium text-gray-700">Concatenate Results</label>
                                    <p className="text-xs text-gray-500">Combine evaluation results</p>
                                  </div>
                                  <Switch checked={concatEvalResults} onCheckedChange={setConcatEvalResults} />
                                </div>
                               
                                <p className="text-xs text-gray-500">
                                  Parameter: <code>concat_eval_results</code> ={" "}
                                  <code>{concatEvalResults ? "true" : "false"}</code>
                                </p>
                              </div>
                              
                            </>
                          )}

                          <div className="flex justify-between mt-6">
                            <div className="flex space-x-2">
                              <Button
                                onClick={prevStep}
                                variant="outline"
                                className="transition-colors hover:text-blue-600"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                              </Button>

                              <Button
                                onClick={resetSettings}
                                variant="outline"
                                className="transition-colors hover:text-blue-600"
                              >
                                <Undo2 className="mr-2 h-4 w-4" />
                                Reset
                              </Button>
                            </div>

                            <Button
                              onClick={nextStep}
                              className="text-xm shadow-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:text-white"
                            >
                              Next Step
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="result" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl overflow-hidden bg-white">
                      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 pb-4">
                        <CardTitle className="text-xl text-gray-800 flex items-center">
                          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            3
                          </span>
                          Generated Result
                        </CardTitle>
                        <CardDescription>View and download your virtual try-on result</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <div className="w-full aspect-[3/4] max-h-[70vh] rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 relative">
                            {generatedImage ? (
                              <img
                                src={generatedImage || "/placeholder.svg"}
                                alt="Generated outfit"
                                className="w-full h-full object-contain"
                              />
                            ) : loading ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-full max-w-xs mb-6">
                                  <Progress value={progress} className="h-2 bg-gray-200" />
                                  <p className="text-center text-sm text-gray-500 mt-2">{progress}% complete</p>
                                </div>
                                <div className="relative">
                                  <div className="animate-spin h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                                </div>
                                <p className="text-gray-600 font-medium mt-4">Generating your virtual try-on...</p>
                                <p className="text-sm text-gray-500 mt-2">This may take few minutes</p>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                <Sparkles className="h-10 w-10 text-gray-400 mb-4" />
                                <p className="text-gray-600 font-medium text-center">
                                  Ready to generate your virtual try-on
                                </p>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                  Click the "Generate" button to create your virtual try-on
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-6 w-full justify-center">
                            <Button
                              onClick={prevStep}
                              variant="outline"
                              className="transition-colors hover:text-blue-600"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>

                            {generatedImage ? (
                              <>
                                <Button
                                  onClick={handleDownload}
                                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:text-white"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Image
                                </Button>

                                {/* <Button
                                  onClick={handleShare}
                                  variant="outline"
                                  className="transition-colors hover:text-blue-600"
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </Button> */}

                                <Button
                                  onClick={() => setGeneratedImage(null)}
                                  variant="outline"
                                  className="transition-colors hover:text-blue-600"
                                >
                                  <RotateCw className="mr-2 h-4 w-4" />
                                  Try Again
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:text-white disabled:bg-gray-400"
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate Try-On
                                  </>
                                )}
                              </Button>
                            )}
                          </div>

                          {generatedImage && (
                            <div className="mt-8 w-full">
                              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                Parameter Summary
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600 space-y-1">
                                <p>
                                  <strong>Size:</strong> {width}×{height}px
                                </p>
                                <p>
                                  <strong>Inference Steps:</strong> {inferenceSteps}
                                </p>
                                <p>
                                  <strong>Guidance Scale:</strong> {guidanceScale}
                                </p>
                                <p>
                                  <strong>Seed:</strong> {seed}
                                </p>
                                <p>
                                  <strong>Cloth Type:</strong> {clothType}
                                </p>
                                <p>
                                  <strong>Repaint:</strong> {repaint ? "Yes" : "No"}
                                </p>
                                <p>
                                  <strong>Concat Results:</strong> {concatEvalResults ? "Yes" : "No"}
                                </p>
                              </div>
                            </div>
                          )}

                   
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4">
              <Card className="border-0 shadow-xl sticky top-4 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 pb-4">
                  <CardTitle className="text-xl text-white">Try-On Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Current Progress</h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}
                          >
                            {currentStep > 1 ? <Check className="w-4 h-4" /> : 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span
                                className={`text-sm font-medium ${currentStep >= 1 ? "text-gray-900" : "text-gray-500"}`}
                              >
                                Upload Images
                              </span>
                              {image && clothing && <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-xs text-gray-500">Person and clothing photos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}
                          >
                            {currentStep > 2 ? <Check className="w-4 h-4" /> : 2}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}
                            >
                              Configure Settings
                            </span>
                            <p className="text-xs text-gray-500">Size and quality parameters</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}
                          >
                            3
                          </div>
                          <div className="flex-1">
                            <span
                              className={`text-sm font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}
                            >
                              Generate Result
                            </span>
                            <p className="text-xs text-gray-500">Create and download your try-on</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-medium text-gray-700">Parameters Summary</h3>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Image Size:</span>
                          <span className="font-medium">
                            {width}×{height}px
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Inference Steps:</span>
                          <span className="font-medium">{inferenceSteps}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Guidance Scale:</span>
                          <span className="font-medium">{guidanceScale.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Seed:</span>
                          <span className="font-medium">555</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Cloth Type:</span>
                          <span className="font-medium">{clothType}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Repaint:</span>
                          <span className="font-medium">False</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-500">Concat Results:</span>
                          <span className="font-medium">True</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-medium text-gray-700">Tips</h3>
                      <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            1
                          </div>
                          <span>Use front-facing photos of the person for best results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            2
                          </div>
                          <span>Clothing images should have a clean background</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            3
                          </div>
                          <span>Higher inference steps (40-50) produce better quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            4
                          </div>
                          <span>Generation may take 30-60 seconds depending on settings</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

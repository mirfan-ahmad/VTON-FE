import { Hero } from "@/components/sections/hero"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Sparkles, Upload, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Features Section */}
      <section className="py-32 p-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl font-bold tracking-tight">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online shopping with our cutting-edge virtual try-on technology
            </p>
          </div>
          <div className="mt-16 grid gap-32 md:grid-cols-1">
            {/* Realistic Effect Feature */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img
                  src="https://humanaigc.github.io/outfit-anyone/content/teaser/t1.gif"
                  alt="Realistic Effect"
                  className="rounded-2xl shadow-2xl w-full object-cover h-full hover:shadow-3xl transition-shadow duration-300"
                />
              </div>
              <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI-Powered Technology</span>
                </div>
                <h3 className="text-3xl font-bold">Realistic Effect</h3>
                <p className="text-muted-foreground text-lg">
                  Our Virtual Try-On tool provides an authentic try-on experience, with our high-quality AI technology
                  enabling AI models to present products more professionally than traditional models.
                </p>
                <Link to="/try-room">
                  <Button size="lg" className="mt-6 gap-2">
                    Try Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Reduce Costs Effortlessly Feature */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <img
                  src="https://humanaigc.github.io/outfit-anyone/content/teaser/t2.gif"
                  alt="Reduce Costs Effortlessly"
                  className="rounded-2xl shadow-2xl w-full object-cover h-full hover:shadow-3xl transition-shadow duration-300"
                />
              </div>
              <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Cost Effective</span>
                </div>
                <h3 className="text-3xl font-bold">Reduce Costs Effortlessly</h3>
                <p className="text-muted-foreground text-lg">
                  With our AI fashion models tool, sellers can transcend the limitations of traditional product
                  photography. Merchants no longer need to find multiple models for a global market.
                </p>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="mt-6">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with our virtual try-on technology in four simple steps
            </p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-4">
            {[
              {
                step: "1",
                icon: <Upload className="h-6 w-6" />,
                title: "Upload Your Photo",
                description: "Take or upload a photo of yourself",
              },
              {
                step: "2",
                icon: <Sparkles className="h-6 w-6" />,
                title: "Choose Clothing",
                description: "Select from our catalog or upload your own items",
              },
              {
                step: "3",
                icon: <Zap className="h-6 w-6" />,
                title: "AI Processing",
                description: "Our AI creates a realistic virtual try-on",
              },
              {
                step: "4",
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "See Results",
                description: "View and share your virtual outfit",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center group">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how our virtual try-on technology is transforming the shopping experience
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Blogger",
                content:
                  "This virtual try-on technology has completely changed how I shop online. The accuracy is incredible!",
              },
              {
                name: "Michael Chen",
                role: "E-commerce Manager",
                content:
                  "We've seen a significant reduction in returns since implementing this on our store. Customers love it!",
              },
              {
                name: "Emma Williams",
                role: "Regular Shopper",
                content: "I can now shop with confidence knowing exactly how clothes will look on me. It's like magic!",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-6 text-muted-foreground">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl font-bold tracking-tight">You Asked, We Answered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our virtual try-on technology
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Does the AI model generated by the virtual try-on involve any copyright issues?
                </AccordionTrigger>
                <AccordionContent>
                  No, our AI-generated virtual try-on images are created specifically for visualization purposes and do
                  not involve copyright issues. The technology transforms existing product images onto users' photos
                  while respecting intellectual property rights.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I choose from multiple AI clothing models for display?</AccordionTrigger>
                <AccordionContent>
                  Yes, our platform offers a variety of AI models to choose from, allowing you to see how clothing items
                  look on different body types and sizes. This helps provide a more comprehensive and inclusive shopping
                  experience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What are the advantages for e-commerce apparel merchants using virtual try-on technology?
                </AccordionTrigger>
                <AccordionContent>
                  E-commerce merchants benefit from reduced return rates, increased customer satisfaction, lower
                  photography costs, and improved conversion rates. The technology also enables them to reach a global
                  market without the need for multiple physical models.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Is the virtual try-on tool compatible with various clothing styles and sizes?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, our virtual try-on technology is designed to work with a wide range of clothing styles and sizes.
                  It accurately represents how different garments will look on various body types, ensuring a reliable
                  shopping experience for all customers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can using the virtual try-on tool help me reduce costs?</AccordionTrigger>
                <AccordionContent>
                  Yes, the virtual try-on tool can significantly reduce costs by eliminating the need for traditional
                  photo shoots, reducing returns, and streamlining the product visualization process. This leads to
                  substantial savings in operational expenses.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}


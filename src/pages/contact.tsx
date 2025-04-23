"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon, MapPinIcon, PhoneIcon, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function Contact() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    const mailtoLink = `mailto:irfanahmad2959@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    )}`

    window.location.href = mailtoLink

    toast({
      title: "Success!",
      description: "Your email client has been opened. Please check your email and send the message.",
    })

    form.reset()
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-white to-gray-50/50 py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our virtual try-on technology? We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                  <MapPinIcon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    PUCIT-New Campus, Lahore, Pakistan
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                  <Clock className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday & Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                  <MailIcon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <a href="mailto:fahadseedat@gmail.com" className="text-primary hover:underline">
                    fahadseedat@gmail.com
                  </a>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                  <PhoneIcon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">+92 3254585673</p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-xl overflow-hidden shadow-sm border h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.5894232679634!2d74.26262407459113!3d31.480478674232337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903ccac08143b%3A0x9b0637753efd261e!2sPUCIT-New%20Campus!5e0!3m2!1sen!2s!4v1740017549951!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" name="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={6} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

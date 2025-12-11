import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Store, CheckCircle } from "lucide-react";

export default function AddStorePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    setSubmitted(true);
    toast({ title: "Store submission received!" });
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Thank You | VapeFinder</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container py-16">
            <Card className="max-w-lg mx-auto p-8 text-center">
              <CheckCircle className="w-16 h-16 text-open mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
              <p className="text-muted-foreground mb-6">
                Your store submission has been received. Our team will review your information and get back to you within 2-3 business days.
              </p>
              <Button asChild>
                <a href="/">Return to Home</a>
              </Button>
            </Card>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Add Your Store | VapeFinder</title>
        <meta name="description" content="List your vape shop on VapeFinder and reach thousands of customers in your area." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-12">
            <div className="container text-center">
              <Store className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Add Your Store to VapeFinder
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reach thousands of potential customers searching for vape shops in your area. 
                Get listed for free and start growing your business today.
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12">
            <div className="container max-w-2xl">
              <Card className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Store Information</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name *</Label>
                      <Input
                        id="storeName"
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        placeholder="Your Vape Shop Name"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                        <Input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@yourstore.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Location</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Los Angeles"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="CA"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          placeholder="90001"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Additional Details</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://www.yourstore.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Store Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell us about your store, the brands you carry, and what makes you special..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full">
                      Submit Your Store
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      By submitting, you agree to our terms of service. 
                      We'll review your submission and contact you within 2-3 business days.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-12 bg-secondary/30">
            <div className="container">
              <h2 className="text-2xl font-bold text-center mb-8">Why List on VapeFinder?</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="p-6 text-center">
                  <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Local Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Get found by customers searching for vape shops in your area.
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <Phone className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Direct Contact</h3>
                  <p className="text-sm text-muted-foreground">
                    Customers can call or visit your store with just one click.
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Build Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect reviews and build trust with potential customers.
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

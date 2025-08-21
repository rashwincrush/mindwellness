import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MessageCircle, GraduationCap } from "lucide-react";

export default function ContactSales() {
  const email = "connect@forgeash.in";
  const whatsapp = "+91 63691 26439";
  const whatsappLink = "https://wa.me/916369126439"; // international number without '+' and spaces

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Edu360+</h1>
          </div>
          <p className="text-gray-600">Private access only — contact us to get pricing and a demo</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Request Access</CardTitle>
            <CardDescription className="text-center">
              We’re onboarding schools in cohorts. Reach out and we’ll set up a tailored demo and plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={`mailto:${email}`} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="mr-2 h-4 w-4" /> Email {email}
                </Button>
              </a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp {whatsapp}
                </Button>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Prefer a quick call? Drop a message and we’ll schedule it.
            </p>
            <div className="mt-6 text-center">
              <Link href="/signin">
                <Button variant="ghost">I already have an account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

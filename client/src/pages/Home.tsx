import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, Heart, Bot, BarChart2, Bell, FileWarning } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-rose-600" />,
      title: "Mood Check-ins",
      desc: "Daily wellness check-ins to understand student sentiment and trends.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Anonymous Reporting",
      desc: "Confidential reports to keep your community safe and supported.",
    },
    {
      icon: <Bot className="h-6 w-6 text-blue-600" />,
      title: "AI Assistant",
      desc: "24/7 AI guidance for students and staff with contextual insights.",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-emerald-600" />,
      title: "Analytics Dashboard",
      desc: "Real-time trends and actionable insights for counselors and admins.",
    },
    {
      icon: <Bell className="h-6 w-6 text-amber-600" />,
      title: "Smart Alerts",
      desc: "Proactive notifications to intervene early and effectively.",
    },
    {
      icon: <FileWarning className="h-6 w-6 text-slate-600" />,
      title: "Case Management",
      desc: "Track cases, assign actions, and collaborate securely across roles.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Edu360+</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/signin"><Button variant="ghost">Sign In</Button></Link>
          <Link href="/signup"><Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button></Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            AI-Powered School Safety & Wellness Platform
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Empower your community with privacy-first tools for wellness, safety, and support.
            Edu360+ brings together mood check-ins, anonymous reporting, AI assistance, and
            real-time analytics under one secure hub.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup"><Button className="bg-green-600 hover:bg-green-700">Create an Account</Button></Link>
            <Link href="/signin"><Button variant="outline">I already have an account</Button></Link>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
        <div>
          <Card className="shadow-xl border-0 bg-white/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                        {f.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Built for your entire school community</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border">
            <h3 className="font-bold text-gray-900">Students</h3>
            <p className="mt-1 text-sm text-gray-600">Check in daily, get AI guidance, and seek help safely.</p>
          </div>
          <div className="p-5 rounded-xl bg-white border">
            <h3 className="font-bold text-gray-900">Counselors</h3>
            <p className="mt-1 text-sm text-gray-600">Monitor wellness trends and manage cases efficiently.</p>
          </div>
          <div className="p-5 rounded-xl bg-white border">
            <h3 className="font-bold text-gray-900">Admins & Parents</h3>
            <p className="mt-1 text-sm text-gray-600">Ensure campus safety with oversight and alerts.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Edu360+. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <Link href="/signin" className="hover:underline">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

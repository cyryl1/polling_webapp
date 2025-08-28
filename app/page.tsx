import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Create and Share Polls with Ease
        </h1>
        <p className="text-xl text-muted-foreground">
          Get instant feedback from your audience with our simple polling platform.
          Create custom polls, share with your audience, and analyze results in real-time.
        </p>
      </div>

      <div className="flex gap-4 mb-16">
        <Link href="/auth/sign-up">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/auth/sign-in">
          <Button variant="outline" size="lg">Sign In</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Design custom polls with multiple options. Add descriptions and customize settings to suit your needs.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Easily</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Share your polls with a simple link. Reach your audience through email, social media, or embed on your website.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Watch responses come in real-time. Analyze results with visual charts and export data for further analysis.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

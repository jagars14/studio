import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>Update your farm's name and location.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Farm Name</Label>
            <Input id="farm-name" defaultValue="BovinoPro Demo Farm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" defaultValue="Green Valley, California" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-headline font-bold">Configuración</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Finca</CardTitle>
          <CardDescription>Actualiza el nombre y la ubicación de tu finca.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nombre de la Finca</Label>
            <Input id="farm-name" defaultValue="Finca Demo BovinoPro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" defaultValue="Valle Verde, California" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

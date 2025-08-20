
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Download, FileCheck, FileQuestion, Upload, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3 | 4 | 5;
type DataType = 'animals' | 'milk' | 'reproduction';

const stepsContent = [
  { title: 'Seleccionar Datos', description: 'Elija el tipo de datos que desea importar.' },
  { title: 'Cargar Archivo', description: 'Descargue nuestra plantilla y luego suba su archivo completo.' },
  { title: 'Mapear Columnas', description: 'Asocie las columnas de su archivo con los campos de la aplicación.' },
  { title: 'Validar y Previsualizar', description: 'Revise una muestra de sus datos para asegurar que todo esté correcto.' },
  { title: 'Importación Completa', description: 'Vea el resumen del proceso de importación.' },
];

const animalFields = ['ID del Animal', 'Nombre', 'Raza', 'Sexo', 'Fecha de Nacimiento', 'Peso (kg)', 'ID Padre', 'ID Madre'];
const milkFields = ['ID del Animal', 'Fecha', 'Sesión (AM/PM)', 'Cantidad (L)'];
const reproFields = ['ID del Animal', 'Tipo de Evento', 'Fecha del Evento'];

const mockValidationData = [
    { row: 2, status: 'success', data: { id: '110', name: 'Margarita', birthDate: '2022-01-15' } },
    { row: 3, status: 'error', data: { id: '111', name: 'Pinta', birthDate: '20-03-2022' }, error: "Formato de fecha inválido. Use AAAA-MM-DD." },
    { row: 4, status: 'success', data: { id: '112', name: 'Manchas', birthDate: '2022-04-10' } },
    { row: 5, status: 'error', data: { id: '101', name: 'Daisy', birthDate: '2021-05-15' }, error: "ID de animal ya existe. Elija 'Actualizar' si desea sobrescribir." },
];

export default function DataImporter() {
  const [step, setStep] = useState<Step>(1);
  const [dataType, setDataType] = useState<DataType | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (step === 1 && !dataType) {
      toast({ variant: 'destructive', title: 'Error', description: 'Por favor, seleccione un tipo de dato para importar.' });
      return;
    }
    if (step === 2 && !fileName) {
       toast({ variant: 'destructive', title: 'Error', description: 'Por favor, suba un archivo para continuar.' });
       return;
    }
    if (step < 5) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <RadioGroup value={dataType || ''} onValueChange={(value) => setDataType(value as DataType)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Label htmlFor="animals" className="p-4 border rounded-lg cursor-pointer hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                <RadioGroupItem value="animals" id="animals" className="sr-only" />
                <h3 className="font-bold">Inventario de Animales</h3>
                <p className="text-sm">Cargue su lista completa de animales.</p>
              </Label>
              <Label htmlFor="milk" className="p-4 border rounded-lg cursor-pointer hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                <RadioGroupItem value="milk" id="milk" className="sr-only" />
                <h3 className="font-bold">Historial de Pesaje de Leche</h3>
                <p className="text-sm">Importe registros de producción históricos.</p>
              </Label>
              <Label htmlFor="reproduction" className="p-4 border rounded-lg cursor-pointer hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                <RadioGroupItem value="reproduction" id="reproduction" className="sr-only" />
                <h3 className="font-bold">Eventos Reproductivos</h3>
                <p className="text-sm">Cargue partos, celos o servicios pasados.</p>
              </Label>
            </div>
          </RadioGroup>
        );
      case 2:
        return (
            <div className="text-center space-y-6 p-6 border-2 border-dashed rounded-lg">
                <div>
                    <h3 className="font-semibold mb-2">1. Descargue la Plantilla</h3>
                    <p className="text-sm text-muted-foreground mb-4">Use nuestro formato para evitar errores en la importación.</p>
                    <Button variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Plantilla .xlsx
                    </Button>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">2. Suba su Archivo</h3>
                    <p className="text-sm text-muted-foreground mb-4">Arrastre y suelte o seleccione el archivo de su computador.</p>
                    <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>{fileName ? `Archivo: ${fileName}` : 'Seleccionar Archivo'}</span>
                    </Label>
                    <input id="file-upload" type="file" className="sr-only" accept=".csv,.xlsx,.txt" onChange={handleFileUpload} />
                 </div>
            </div>
        );
      case 3:
        return (
            <div>
                <p className="text-sm text-muted-foreground mb-4">Asegúrese de que cada columna de su archivo (izquierda) corresponda a un campo de BovinoPro Lite (derecha).</p>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Columna de su Archivo</TableHead>
                                <TableHead>Campo en la App</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(dataType === 'animals' ? animalFields : dataType === 'milk' ? milkFields : reproFields).map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-mono bg-muted/50">COLUMNA_{index + 1}</TableCell>
                                    <TableCell>
                                         <Select defaultValue={field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un campo..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(dataType === 'animals' ? animalFields : dataType === 'milk' ? milkFields : reproFields).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Manejo de Duplicados</h4>
                    <RadioGroup defaultValue="skip" className="flex items-center gap-4">
                        <Label htmlFor="skip" className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value="skip" id="skip" />
                            Omitir registros duplicados
                        </Label>
                        <Label htmlFor="update" className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value="update" id="update" />
                            Actualizar registros existentes
                        </Label>
                    </RadioGroup>
                </div>
            </div>
        );
    case 4:
        return (
            <div>
                <p className="text-sm text-muted-foreground mb-4">Se encontraron 2 errores en la muestra. Por favor, corríjalos en su archivo original o continúe si desea omitir estas filas.</p>
                <div className="rounded-md border">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Fila</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Datos de Muestra</TableHead>
                                <TableHead>Observaciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockValidationData.map(item => (
                                <TableRow key={item.row} className={cn(item.status === 'error' && 'bg-destructive/10')}>
                                    <TableCell>{item.row}</TableCell>
                                    <TableCell>
                                        {item.status === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">{JSON.stringify(item.data)}</TableCell>
                                    <TableCell className="text-xs text-destructive font-medium">{item.error}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    case 5:
        return (
            <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold">Importación Exitosa</h3>
                <p>Se importaron 450 registros de animales.</p>
                <p>Se omitieron 15 registros por errores.</p>
                <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Reporte de Errores
                </Button>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistente de Importación de Datos</CardTitle>
        <CardDescription>
          Siga los pasos para cargar masivamente sus datos históricos en la aplicación.
        </CardDescription>
         <div className="flex items-center gap-4 pt-4">
            {[1,2,3,4,5].map(s_step => (
                <React.Fragment key={s_step}>
                    <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center font-bold border-2",
                            step === s_step ? "bg-primary text-primary-foreground border-primary" : "bg-muted",
                             step > s_step ? "bg-green-500 border-green-500 text-white" : ""
                        )}>
                            {step > s_step ? <CheckCircle2 className="h-5 w-5" /> : s_step}
                        </div>
                        <p className={cn("text-xs text-center", step === s_step && "font-bold")}>Paso {s_step}</p>
                    </div>
                   {s_step < 5 && <div className="flex-1 h-0.5 bg-border" />}
                </React.Fragment>
            ))}
         </div>
      </CardHeader>
      <CardContent>
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {step === 1 && <FileQuestion />}
                    {step === 2 && <Upload />}
                    {step === 3 && <FileCheck />}
                    {step === 4 && <FileCheck />}
                    {step === 5 && <CheckCircle2 />}
                    {stepsContent[step - 1].title}
                </CardTitle>
                <CardDescription>{stepsContent[step - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevStep} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        {step < 5 && (
            <Button onClick={handleNextStep}>
                {step === 4 ? 'Confirmar e Importar' : 'Siguiente'}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

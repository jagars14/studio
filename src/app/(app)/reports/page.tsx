
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileDown, GanttChartSquare } from "lucide-react";
import { animals as mockAnimals, milkRecords as mockMilkRecords } from "@/lib/mock-data";
import { utils, writeFile } from 'xlsx';
import { format } from 'date-fns';

type ReportType = 'animal_inventory' | 'milk_production';
type FileFormat = 'xlsx' | 'csv';

export default function ReportsClient() {
    const { toast } = useToast();
    const [reportType, setReportType] = useState<ReportType>('animal_inventory');
    const [fileFormat, setFileFormat] = useState<FileFormat>('xlsx');
    const [isLoading, setIsLoading] = useState(false);
    
    // In a real app, you would fetch this data from Firestore
    const animals = mockAnimals;
    const milkRecords = mockMilkRecords;
    
    const handleExport = () => {
        setIsLoading(true);
        try {
            let data: any[] = [];
            let fileName = `Reporte_${reportType}_${format(new Date(), 'yyyy-MM-dd')}`;
            
            switch (reportType) {
                case 'animal_inventory':
                    data = animals.map(a => ({
                        'ID Animal': a.id,
                        'Nombre': a.name,
                        'Raza': a.breed,
                        'Sexo': a.sex,
                        'Fecha Nacimiento': a.birthDate,
                        'Estado': a.status,
                        'Categoría': a.category,
                        'ID Madre': a.damId || 'N/A',
                        'ID Padre': a.sireId || 'N/A',
                    }));
                    fileName = `Inventario_Animales_${format(new Date(), 'yyyy-MM-dd')}`;
                    break;
                
                case 'milk_production':
                    data = milkRecords.map(r => ({
                        'ID Registro': r.id,
                        'ID Animal': r.animalId,
                        'Nombre Animal': r.animalName,
                        'Fecha': r.date,
                        'Sesión': r.session,
                        'Cantidad (L)': r.quantity,
                    }));
                    fileName = `Produccion_Leche_${format(new Date(), 'yyyy-MM-dd')}`;
                    break;
            }

            if (data.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'No hay datos',
                    description: 'No hay datos disponibles para generar este informe.',
                });
                return;
            }

            const worksheet = utils.json_to_sheet(data);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "Datos");
            
            writeFile(workbook, `${fileName}.${fileFormat}`);

            toast({
                title: 'Exportación Exitosa',
                description: `El archivo ${fileName}.${fileFormat} ha sido generado.`,
            });

        } catch (error) {
            console.error("Error al exportar:", error);
            toast({
                variant: 'destructive',
                title: 'Error de Exportación',
                description: 'No se pudo generar el archivo. Por favor, intente de nuevo.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Informes y Exportación de Datos</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GanttChartSquare className="h-6 w-6"/>
                        <span>Generador de Informes</span>
                    </CardTitle>
                    <CardDescription>
                        Seleccione el tipo de informe y el formato deseado para descargar sus datos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-type">Tipo de Informe</Label>
                            <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                                <SelectTrigger id="report-type">
                                    <SelectValue placeholder="Seleccione un informe..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="animal_inventory">Inventario General de Animales</SelectItem>
                                    <SelectItem value="milk_production">Historial de Producción de Leche</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file-format">Formato de Archivo</Label>
                            <Select value={fileFormat} onValueChange={(v) => setFileFormat(v as FileFormat)}>
                                <SelectTrigger id="file-format">
                                    <SelectValue placeholder="Seleccione un formato..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Button onClick={handleExport} disabled={isLoading} className="w-full md:w-auto">
                            <FileDown className="mr-2 h-4 w-4" />
                            {isLoading ? 'Generando...' : 'Exportar Datos'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

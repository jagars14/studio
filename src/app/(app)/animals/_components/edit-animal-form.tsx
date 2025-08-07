
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Animal } from '@/lib/types';
import { format } from 'date-fns';
import * as React from 'react';

const formSchema = z.object({
  id: z.string().min(1, 'El ID es obligatorio.'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  breed: z.string().min(2, 'La raza es obligatoria.'),
  sex: z.enum(['Macho', 'Hembra'], { required_error: 'Por favor, seleccione un sexo.' }),
  weight: z.coerce.number().min(1, 'El peso debe ser mayor que 0.'),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  lastCalvingDate: z.string().optional(),
  heatDate: z.string().optional(),
  pregnancyDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAnimalFormProps {
  animal: Animal;
  onFinished?: () => void;
}

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

export function EditAnimalForm({ animal, onFinished }: EditAnimalFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: animal.id,
      name: animal.name,
      breed: animal.breed,
      sex: animal.sex,
      weight: animal.weight,
      birthDate: formatDateForInput(animal.birthDate),
      lastCalvingDate: formatDateForInput(animal.lastCalvingDate),
      heatDate: formatDateForInput(animal.heatDate),
      pregnancyDate: formatDateForInput(animal.pregnancyDate),
    },
  });

  const isLoading = form.formState.isSubmitting;
  const sex = form.watch('sex');

  React.useEffect(() => {
    if (sex === 'Macho') {
      form.setValue('lastCalvingDate', '');
      form.setValue('heatDate', '');
      form.setValue('pregnancyDate', '');
    }
  }, [sex, form]);

  async function onSubmit(values: FormValues) {
    // En una aplicación real, aquí enviarías los datos al backend para actualizar.
    console.log('Datos actualizados del animal:', values);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: '¡Animal Actualizado!',
      description: `El animal ${values.name} (${values.id}) ha sido modificado con éxito.`,
    });
    onFinished?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Animal</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 107" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Luna" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Angus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                   <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 600" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator className="my-2" />
        <p className="text-sm font-medium text-muted-foreground">Información Reproductiva (Solo Hembras)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="lastCalvingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Último Parto</FormLabel>
                <FormControl>
                   <Input type="date" {...field} disabled={sex !== 'Hembra'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heatDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Celo</FormLabel>
                <FormControl>
                   <Input type="date" {...field} disabled={sex !== 'Hembra'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pregnancyDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Preñez</FormLabel>
                <FormControl>
                   <Input type="date" {...field} disabled={sex !== 'Hembra'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}

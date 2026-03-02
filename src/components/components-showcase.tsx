"use client"

import { ColumnDef } from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// ─── Form schema ────────────────────────────────────────────────────────────

const supplierFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter ao menos 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  phone: z.string().min(10, { message: "Telefone inválido." }),
  category: z.string().min(1, { message: "Selecione uma categoria." }),
  description: z.string().optional(),
  active: z.boolean(),
})

type SupplierFormValues = z.infer<typeof supplierFormSchema>

// ─── Table data ─────────────────────────────────────────────────────────────

type Supplier = {
  id: string
  name: string
  category: string
  email: string
  status: "ativo" | "inativo" | "pendente"
}

const suppliers: Supplier[] = [
  { id: "1", name: "Tech Solutions Ltda", category: "Tecnologia", email: "contato@techsolutions.com", status: "ativo" },
  { id: "2", name: "Papelaria Central", category: "Escritório", email: "vendas@papelaria.com", status: "ativo" },
  { id: "3", name: "Limpeza Total", category: "Higiene", email: "orcamento@limpezatotal.com", status: "pendente" },
  { id: "4", name: "Fast Food Distribuidora", category: "Alimentação", email: "pedidos@fastfood.com", status: "inativo" },
  { id: "5", name: "Mobília Express", category: "Móveis", email: "moveis@express.com", status: "ativo" },
  { id: "6", name: "Gráfica Digital", category: "Impressão", email: "grafica@digital.com", status: "ativo" },
  { id: "7", name: "Segurança Pro", category: "Segurança", email: "seg@pro.com", status: "pendente" },
  { id: "8", name: "Eventos & Cia", category: "Eventos", email: "info@eventosecia.com", status: "inativo" },
]

const statusVariant: Record<Supplier["status"], "default" | "secondary" | "destructive"> = {
  ativo: "default",
  pendente: "secondary",
  inativo: "destructive",
}

const columns: ColumnDef<Supplier>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Supplier["status"]
      return <Badge variant={statusVariant[status]}>{status}</Badge>
    },
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function ComponentsShowcase() {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: { name: "", email: "", phone: "", description: "", active: true },
  })

  function onSubmit(values: SupplierFormValues) {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Fornecedores</h1>
          <p className="mt-1 text-muted-foreground">
            Biblioteca de componentes shadcn/ui — formulários e tabelas interativas.
          </p>
        </div>

        <Separator />

        {/* ── Form Components ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Componentes de Formulário</h2>
            <p className="text-sm text-muted-foreground">
              Validação com React Hook Form + Zod.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Fornecedor</CardTitle>
              <CardDescription>Preencha os dados do novo fornecedor.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Empresa Ltda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contato@empresa.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tecnologia">Tecnologia</SelectItem>
                              <SelectItem value="escritorio">Escritório</SelectItem>
                              <SelectItem value="higiene">Higiene</SelectItem>
                              <SelectItem value="alimentacao">Alimentação</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os produtos ou serviços oferecidos..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Opcional. Máximo de 500 caracteres.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Fornecedor ativo</FormLabel>
                          <FormDescription className="text-xs">
                            Fornecedores inativos não aparecem nas buscas.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Salvar fornecedor</Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Limpar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Standalone primitives */}
          <Card>
            <CardHeader>
              <CardTitle>Primitivos de Formulário</CardTitle>
              <CardDescription>Componentes individuais disponíveis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="input-demo">Input</Label>
                  <Input id="input-demo" placeholder="Texto livre..." />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="input-disabled">Input desabilitado</Label>
                  <Input id="input-disabled" placeholder="Desabilitado" disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="select-demo">Select</Label>
                  <Select>
                    <SelectTrigger id="select-demo">
                      <SelectValue placeholder="Escolha uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Opção A</SelectItem>
                      <SelectItem value="b">Opção B</SelectItem>
                      <SelectItem value="c">Opção C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="textarea-demo">Textarea</Label>
                  <Textarea id="textarea-demo" placeholder="Texto longo..." rows={3} />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="chk1" defaultChecked />
                  <Label htmlFor="chk1">Checkbox marcado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="chk2" />
                  <Label htmlFor="chk2">Checkbox desmarcado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="chk3" disabled />
                  <Label htmlFor="chk3">Checkbox desabilitado</Label>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>Primário</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destrutivo</Button>
                <Button disabled>Desabilitado</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* ── Table Components ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Tabela Interativa</h2>
            <p className="text-sm text-muted-foreground">
              Ordenação, filtragem por coluna, visibilidade e paginação com @tanstack/react-table.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fornecedores</CardTitle>
              <CardDescription>
                Gerencie os fornecedores cadastrados. Use o campo de busca, ordene as colunas e
                controle quais colunas são exibidas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={suppliers}
                filterColumn="name"
                filterPlaceholder="Filtrar por nome..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges de Status</CardTitle>
              <CardDescription>Variantes disponíveis para indicar estados.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>ativo</Badge>
              <Badge variant="secondary">pendente</Badge>
              <Badge variant="destructive">inativo</Badge>
              <Badge variant="outline">rascunho</Badge>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

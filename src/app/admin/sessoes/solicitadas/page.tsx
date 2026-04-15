"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { CardSessaoAdmin } from "@/components/consultoria/card-sessao-admin";
import { sessoesConsultoria } from "@/lib/mock-data";

export default function AdminSessoesSolicitadas() {
  const [tick, setTick] = useState(0);

  const solicitadas = useMemo(
    () =>
      sessoesConsultoria
        .filter((s) => s.status === "solicitada")
        .sort((a, b) => a.solicitada_em.localeCompare(b.solicitada_em)),
    [tick]
  );

  return (
    <AppShell tipo="admin" titulo="Sessões solicitadas">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">
                Sessões solicitadas ({solicitadas.length})
              </h1>
              <p className="text-sm text-muted-foreground">
                Atribua um advisor ou traga para você. Sugestão baseada em especialização + carga.
              </p>
            </div>
          </CardContent>
        </Card>

        {solicitadas.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Fila vazia. Bom trabalho.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {solicitadas.map((sessao) => (
              <CardSessaoAdmin
                key={sessao.id}
                sessao={sessao}
                onMudou={() => setTick((t) => t + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

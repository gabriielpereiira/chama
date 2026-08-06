"use client";

type Segmento = {
  label: string;
  valor: number;
  cor: string;
};

type Props = {
  dados: Segmento[];
  titulo?: string;
};

const RAIO = 40;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function RoscaChart({ dados, titulo }: Props) {
  const total = dados.reduce((soma, d) => soma + d.valor, 0);

  if (total <= 0) {
    return (
      <div className="text-sm text-gray-500 py-6 text-center">
        Sem dados para exibir ainda.
      </div>
    );
  }

  let acumulado = 0;
  const segmentos = dados
    .filter((d) => d.valor > 0)
    .map((d) => {
      const dash = (d.valor / total) * CIRCUNFERENCIA;
      const segmento = { ...d, dash, offset: acumulado };
      acumulado += dash;
      return segmento;
    });

  return (
    <div>
      {titulo && (
        <h3 className="font-semibold text-[#1e3a5f] mb-4">{titulo}</h3>
      )}
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RAIO}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="14"
            />
            {segmentos.map((s) => (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={RAIO}
                fill="none"
                stroke={s.cor}
                strokeWidth="14"
                strokeDasharray={`${s.dash} ${CIRCUNFERENCIA - s.dash}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#1e3a5f]">{total}</span>
            <span className="text-xs text-gray-500">total</span>
          </div>
        </div>
        <div className="space-y-2">
          {segmentos.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: s.cor }}
              />
              <span className="text-gray-700">{s.label}</span>
              <span className="font-semibold text-[#1e3a5f]">{s.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

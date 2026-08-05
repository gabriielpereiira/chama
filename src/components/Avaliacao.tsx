"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Avaliacao = {
  id: string;
  tarefa_id: string;
  avaliador_id: string;
  avaliado_id: string;
  nota: number;
  comentario: string | null;
  resposta: string | null;
  resposta_em: string | null;
  created_at: string;
  visivel_para_avaliado: boolean;
  avaliador_nome?: string;
};

type Props = {
  tarefaId: string;
  usuarioLogadoId: string;
  outroLadoId: string;
  tarefaConcluida: boolean;
};

export function Avaliacao({
  tarefaId,
  usuarioLogadoId,
  outroLadoId,
  tarefaConcluida,
}: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [jaAvaliei, setJaAvaliei] = useState(false);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarAvaliacoes() {
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("*, avaliador:usuarios(nome)")
      .eq("tarefa_id", tarefaId);

    if (error) {
      setErro("Não foi possível carregar as avaliações.");
      return;
    }

    const normalizadas = (data ?? []).map((a: any) => ({
      ...a,
      avaliador_nome: a.avaliador?.nome ?? "Usuário",
    }));

    setAvaliacoes(normalizadas);
    setJaAvaliei(normalizadas.some((a) => a.avaliador_id === usuarioLogadoId));
    setCarregando(false);
  }

  useEffect(() => {
    carregarAvaliacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarefaId]);

  async function enviarAvaliacao(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!tarefaConcluida) {
      setErro("As avaliações são liberadas quando a tarefa é concluída.");
      return;
    }

    const { error } = await supabase.from("avaliacoes").insert({
      tarefa_id: tarefaId,
      avaliador_id: usuarioLogadoId,
      avaliado_id: outroLadoId,
      nota,
      comentario: comentario.trim() || null,
      visivel_para_avaliado: false,
    });

    if (error) {
      setErro("Não foi possível enviar a avaliação. Tente de novo.");
      return;
    }

    // Ao avaliar, libera a avaliação que você recebeu do outro lado
    await supabase
      .from("avaliacoes")
      .update({ visivel_para_avaliado: true })
      .eq("tarefa_id", tarefaId)
      .eq("avaliador_id", outroLadoId)
      .eq("avaliado_id", usuarioLogadoId);

    setNota(5);
    setComentario("");
    carregarAvaliacoes();
  }

  async function enviarResposta(avaliacaoId: string) {
    setErro("");

    if (!resposta.trim()) return;

    const { error } = await supabase
      .from("avaliacoes")
      .update({
        resposta: resposta.trim(),
        resposta_em: new Date().toISOString(),
      })
      .eq("id", avaliacaoId);

    if (error) {
      setErro("Não foi possível enviar a resposta.");
      return;
    }

    setResposta("");
    carregarAvaliacoes();
  }

  if (carregando) {
    return <p className="text-gray-500 text-sm">Carregando avaliações...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#1e3a5f]">Avaliações</h2>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {!jaAvaliei && tarefaConcluida && (
        <form
          onSubmit={enviarAvaliacao}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-semibold text-[#1e3a5f]">Avalie esta experiência</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Nota (1 a 5)</label>
            <select
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} estrela{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comentário</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Como foi a experiência?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Enviar avaliação
          </button>
        </form>
      )}

      {!tarefaConcluida && (
        <p className="text-sm text-gray-500">
          As avaliações ficam disponíveis quando a tarefa for concluída.
        </p>
      )}

      <div className="space-y-4">
        {avaliacoes.length === 0 && (
          <p className="text-sm text-gray-500">
            Ainda não há avaliações para esta tarefa.
          </p>
        )}

        {avaliacoes.map((avaliacao) => {
          const souAvaliado = avaliacao.avaliado_id === usuarioLogadoId;
          const possoResponder = souAvaliado && !avaliacao.resposta;

          return (
            <div
              key={avaliacao.id}
              className="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#1e3a5f]">
                  {avaliacao.avaliador_nome}
                </span>
                <span className="text-[#e67e22] font-bold">
                  {avaliacao.nota}/5
                </span>
              </div>

              {avaliacao.comentario && (
                <p className="text-gray-700 text-sm mb-3">{avaliacao.comentario}</p>
              )}

              {avaliacao.resposta && (
                <div className="bg-gray-50 border-l-4 border-[#1e3a5f] rounded p-3 mt-3">
                  <p className="text-xs font-semibold text-[#1e3a5f] mb-1">
                    Resposta do avaliado
                  </p>
                  <p className="text-sm text-gray-600">{avaliacao.resposta}</p>
                </div>
              )}

              {possoResponder && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    Sua resposta será pública. Evite expor situações muito
                    específicas ou dados pessoais; se houve um problema, trate
                    de forma reservada e profissional.
                  </p>
                  <textarea
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Escreva sua resposta (opcional)"
                  />
                  <button
                    onClick={() => enviarResposta(avaliacao.id)}
                    className="bg-[#1e3a5f] hover:bg-[#162c47] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Responder
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

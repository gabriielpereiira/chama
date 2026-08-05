"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Avaliacao } from "../../../components/Avaliacao";

type Tarefa = {
  id: string;
  cliente_id: string;
  titulo: string;
  descricao: string | null;
  bairro: string | null;
  orcamento_sugerido: number | null;
  status: string;
  created_at: string;
  categorias?: { nome: string } | null;
};

type Orcamento = {
  id: string;
  tarefa_id: string;
  prestador_id: string;
  valor: number | null;
  prazo: string | null;
  mensagem: string | null;
  status: string;
  created_at: string;
};

const formatarMoeda = (valor: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor ?? 0);

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DetalheTarefaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tarefaId = params.id;

  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [souCliente, setSouCliente] = useState(false);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("Usuário");
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);

  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagemOk, setMensagemOk] = useState("");

  async function buscarOrcamentos() {
    const { data } = await supabase
      .from("orcamentos")
      .select("*")
      .eq("tarefa_id", tarefaId);
    setOrcamentos((data ?? []) as Orcamento[]);
  }

  async function buscarTarefa(uid: string) {
    const { data: t, error } = await supabase
      .from("tarefas")
      .select("*, categorias(nome)")
      .eq("id", tarefaId)
      .single();

    if (error || !t) {
      setNaoEncontrada(true);
      setCarregando(false);
      return;
    }

    const tarefa = t as unknown as Tarefa;
    setTarefa(tarefa);
    setSouCliente(uid === tarefa.cliente_id);

    // Detecção de admin via função no banco (ignora RLS de usuarios)
    const { data: ehAdminData } = await supabase.rpc("is_admin");
    setEhAdmin(!!ehAdminData);

    const { data: perfil } = await supabase
      .from("perfis_publicos")
      .select("nome")
      .eq("id", tarefa.cliente_id)
      .single();
    if (perfil) setNomeCliente((perfil as { nome: string }).nome);

    const { data: fotosData } = await supabase
      .from("fotos_tarefa")
      .select("url")
      .eq("tarefa_id", tarefaId);
    setFotos(((fotosData ?? []) as { url: string }[]).map((f) => f.url));

    setCarregando(false);
  }

  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      const { data: sessao } = await supabase.auth.getUser();
      if (!sessao.user) {
        router.push("/login");
        return;
      }
      if (!ativo) return;

      const uid = sessao.user.id;
      setUsuarioId(uid);
      await buscarTarefa(uid);
      await buscarOrcamentos();
    }

    iniciar();
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarefaId]);

  async function enviarOrcamento(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setMensagemOk("");

    if (!usuarioId || !tarefa) return;
    if (!valor.trim()) {
      setErro("Informe o valor do orçamento.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.from("orcamentos").insert({
      tarefa_id: tarefaId,
      prestador_id: usuarioId,
      valor: Number(valor.replace(",", ".")),
      prazo: prazo.trim() || null,
      mensagem: mensagem.trim() || null,
      status: "pendente",
    });

    setEnviando(false);

    if (error) {
      setErro(`Erro ao enviar (${error.code}): ${error.message}`);
      return;
    }

    setValor("");
    setPrazo("");
    setMensagem("");
    setMensagemOk("Orçamento enviado com sucesso.");
    await buscarOrcamentos();
  }

  async function aceitarOrcamento(id: string) {
    setErro("");
    setMensagemOk("");
    await supabase
      .from("orcamentos")
      .update({ status: "aceito" })
      .eq("id", id);
    await supabase
      .from("orcamentos")
      .update({ status: "recusado" })
      .eq("tarefa_id", tarefaId)
      .neq("id", id)
      .eq("status", "pendente");
    await buscarOrcamentos();
  }

  async function recusarOrcamento(id: string) {
    await supabase
      .from("orcamentos")
      .update({ status: "recusado" })
      .eq("id", id);
    await buscarOrcamentos();
  }

  async function concluirTarefa() {
    setErro("");
    setMensagemOk("");
    await supabase
      .from("tarefas")
      .update({ status: "concluida" })
      .eq("id", tarefaId);
    await buscarTarefa(usuarioId ?? "");
    await buscarOrcamentos();
  }

  if (carregando) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-gray-600">Carregando tarefa...</p>
      </main>
    );
  }

  if (naoEncontrada || !tarefa) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          Tarefa não encontrada
        </h1>
        <p className="text-gray-600 mb-6">
          Ela pode ter sido removida ou você não tem permissão para vê-la.
        </p>
        <Link href="/tarefas" className="text-[#e67e22] font-medium">
          Voltar para as tarefas
        </Link>
      </main>
    );
  }

  const meuOrcamento = orcamentos.find((o) => o.prestador_id === usuarioId);
  const orcamentoAceito = orcamentos.find((o) => o.status === "aceito");
  const souPrestadorAceito =
    !!orcamentoAceito && orcamentoAceito.prestador_id === usuarioId;

  const possoEnviarOrcamento =
    tarefa.status === "aberta" && (!souCliente || ehAdmin) && !meuOrcamento;

  const modoTestePrestador = ehAdmin && souCliente && tarefa.status === "aberta";

  const autoTeste =
    ehAdmin &&
    souCliente &&
    !!orcamentoAceito &&
    orcamentoAceito.prestador_id === usuarioId;

  const possoAvaliar =
    tarefa.status === "concluida" &&
    !!orcamentoAceito &&
    (souCliente || souPrestadorAceito || ehAdmin);

  const outroLadoId = souCliente
    ? orcamentoAceito?.prestador_id
    : tarefa.cliente_id;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/tarefas"
        className="text-sm text-gray-500 hover:text-[#e67e22] mb-6 inline-block"
      >
        Voltar para as tarefas
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-[#e67e22]/10 text-[#d35400] text-xs font-semibold px-3 py-1 rounded-full">
            {tarefa.categorias?.nome ?? "Sem categoria"}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
              tarefa.status === "aberta" ? "bg-[#e67e22]" : "bg-green-600"
            }`}
          >
            {tarefa.status === "aberta" ? "Aberta" : "Concluída"}
          </span>
          {ehAdmin && (
            <span className="bg-[#1e3a5f] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">
          {tarefa.titulo}
        </h1>

        {tarefa.descricao && (
          <p className="text-gray-700 whitespace-pre-line mb-6">
            {tarefa.descricao}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-5">
          <div>
            <p className="text-gray-500">Bairro</p>
            <p className="font-medium text-[#1e3a5f]">
              {tarefa.bairro ?? "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Orçamento sugerido</p>
            <p className="font-medium text-[#1e3a5f]">
              {formatarMoeda(tarefa.orcamento_sugerido)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Publicado por</p>
            <p className="font-medium text-[#1e3a5f]">{nomeCliente}</p>
          </div>
          <div>
            <p className="text-gray-500">Data</p>
            <p className="font-medium text-[#1e3a5f]">
              {formatarData(tarefa.created_at)}
            </p>
          </div>
        </div>

        {fotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            {fotos.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt={`Foto da tarefa ${i + 1}`}
                className="rounded-xl object-cover w-full h-32"
              />
            ))}
          </div>
        )}
      </div>

      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}
      {mensagemOk && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          {mensagemOk}
        </p>
      )}

      {modoTestePrestador && (
        <p className="text-sm text-[#1e3a5f] bg-[#1e3a5f]/5 border border-dashed border-[#1e3a5f]/40 rounded-xl p-3 mb-6">
          Modo teste: você é o cliente desta tarefa, mas como admin pode simular
          o papel de prestador enviando um orçamento para ela.
        </p>
      )}

      {(souCliente || ehAdmin) && tarefa.status === "aberta" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            Orçamentos recebidos ({orcamentos.length})
          </h2>

          {orcamentos.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhum orçamento ainda. Assim que os prestadores enviarem, eles
              aparecem aqui.
            </p>
          ) : (
            <div className="space-y-4">
              {orcamentos.map((o) => (
                <div
                  key={o.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1e3a5f]">
                      {formatarMoeda(o.valor)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        o.status === "aceito"
                          ? "bg-green-100 text-green-700"
                          : o.status === "recusado"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-[#e67e22]/10 text-[#d35400]"
                      }`}
                    >
                      {o.status === "aceito"
                        ? "Aceito"
                        : o.status === "recusado"
                          ? "Recusado"
                          : "Pendente"}
                    </span>
                  </div>
                  {o.prazo && (
                    <p className="text-sm text-gray-600 mb-1">
                      Prazo: {o.prazo}
                    </p>
                  )}
                  {o.mensagem && (
                    <p className="text-sm text-gray-600 mb-3">{o.mensagem}</p>
                  )}
                  {o.status === "pendente" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => aceitarOrcamento(o.id)}
                        className="bg-[#1e3a5f] hover:bg-[#162c47] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => recusarOrcamento(o.id)}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {orcamentoAceito ? (
            <button
              onClick={concluirTarefa}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Concluir tarefa
            </button>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              Aceite um orçamento para poder concluir a tarefa.
            </p>
          )}
        </div>
      )}

      {possoEnviarOrcamento && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            Enviar orçamento
          </h2>
          <form onSubmit={enviarOrcamento} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prazo</label>
                <input
                  type="text"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: 2 dias"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mensagem ao cliente
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Conte sua experiência e por que você é a escolha certa."
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar orçamento"}
            </button>
          </form>
        </div>
      )}

      {tarefa.status === "concluida" && orcamentoAceito && !possoAvaliar && (
        <p className="text-sm text-gray-500 mb-6">
          As avaliações ficam disponíveis para quem participou do serviço.
        </p>
      )}

      {possoAvaliar && usuarioId && !autoTeste && outroLadoId && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <Avaliacao
            tarefaId={tarefa.id}
            usuarioLogadoId={usuarioId}
            outroLadoId={outroLadoId}
            tarefaConcluida={true}
          />
        </div>
      )}

      {autoTeste && usuarioId && (
        <div className="space-y-6">
          <p className="text-sm text-[#1e3a5f] bg-[#1e3a5f]/5 border border-dashed border-[#1e3a5f]/40 rounded-xl p-3">
            Modo teste: você é cliente e prestador desta tarefa. Avalie os dois
            lados para validar a trava do Airbnb (cada lado só vê a avaliação
            que recebeu depois de avaliar o outro).
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
              Avaliando como cliente
            </h2>
            <Avaliacao
              tarefaId={tarefa.id}
              usuarioLogadoId={usuarioId}
              outroLadoId={orcamentoAceito?.prestador_id ?? usuarioId}
              tarefaConcluida={true}
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
              Avaliando como prestador
            </h2>
            <Avaliacao
              tarefaId={tarefa.id}
              usuarioLogadoId={usuarioId}
              outroLadoId={tarefa.cliente_id}
              tarefaConcluida={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}

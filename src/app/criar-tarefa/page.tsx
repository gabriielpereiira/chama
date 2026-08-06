"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Categoria = { id: string; nome: string };

const TAMANHO_MAXIMO_MB = 5;
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

export default function CriarTarefaPage() {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [bairro, setBairro] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);
  const [erroFotos, setErroFotos] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUsuarioId(data.user.id);
      const { data: cats } = await supabase
        .from("categorias")
        .select("id, nome")
        .order("nome");
      setCategorias((cats ?? []) as Categoria[]);
      setCarregando(false);
    });
  }, [router]);

  function adicionarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []);
    if (arquivos.length === 0) return;
    setErroFotos("");

    const rejeitadas = arquivos.filter((f) => f.size > TAMANHO_MAXIMO_BYTES);
    if (rejeitadas.length > 0) {
      setErroFotos(
        `Imagens acima de ${TAMANHO_MAXIMO_MB}MB não são aceitas. ${
          rejeitadas.length === 1
            ? "Essa imagem foi ignorada."
            : "Essas imagens foram ignoradas."
        }`
      );
    }

    const aceitas = arquivos.filter((f) => f.size <= TAMANHO_MAXIMO_BYTES);
    if (aceitas.length === 0) {
      e.target.value = "";
      return;
    }

    const vagas = 5 - fotos.length;
    const novas = aceitas.slice(0, vagas);
    if (aceitas.length > vagas) {
      setErroFotos("Você pode anexar no máximo 5 fotos. As demais foram ignoradas.");
    }

    setFotos((atual) => [...atual, ...novas]);
    setFotosPreview((atual) => [
      ...atual,
      ...novas.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  }

  function removerFoto(index: number) {
    setFotos((atual) => atual.filter((_, i) => i !== index));
    setFotosPreview((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!usuarioId) return;
    if (!categoriaId) {
      setErro("Escolha uma categoria para o serviço.");
      return;
    }
    setSalvando(true);
    const { data, error } = await supabase
      .from("tarefas")
      .insert({
        cliente_id: usuarioId,
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        categoria_id: categoriaId,
        bairro: bairro.trim() || null,
        orcamento_sugerido: orcamento ? Number(orcamento.replace(",", ".")) : null,
        status: "aberta",
      })
      .select("id")
      .single();
    if (error || !data) {
      setSalvando(false);
      setErro("Não foi possível publicar a tarefa. Tente de novo.");
      return;
    }
    // Upload das fotos para o storage e registro na tabela fotos_tarefa
    if (fotos.length > 0) {
      const registros: { tarefa_id: string; url: string }[] = [];
      for (const foto of fotos) {
        const caminho = `${data.id}/${Date.now()}-${foto.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage
          .from("tarefas")
          .upload(caminho, foto);
        if (uploadError) continue;
        const { data: publicUrlData } = supabase.storage
          .from("tarefas")
          .getPublicUrl(caminho);
        registros.push({
          tarefa_id: data.id,
          url: publicUrlData.publicUrl,
        });
      }
      if (registros.length > 0) {
        await supabase.from("fotos_tarefa").insert(registros);
      }
    }
    setSalvando(false);
    router.push(`/tarefas/${data.id}`);
  }

  if (carregando) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">
        Publicar tarefa
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Ex: Preciso de um eletricista para trocar uma tomada"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          {categorias.length > 0 ? (
            <select
              required
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Nenhuma categoria cadastrada. Rode o SQL do Bloco 2 (seed de categorias).
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Detalhe o serviço: o que precisa, tamanho, urgência, materiais..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Fotos do serviço (opcional, até 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={adicionarFotos}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:text-white file:font-medium file:cursor-pointer hover:file:bg-[#162c47]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Anexe fotos para o prestador ter uma ideia clara do serviço. Máximo de 5 fotos, até {TAMANHO_MAXIMO_MB}MB cada.
          </p>
          {erroFotos && <p className="text-sm text-red-600 mt-2">{erroFotos}</p>}
          {fotosPreview.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
              {fotosPreview.map((preview, i) => (
                <div key={preview} className="relative">
                  <img
                    src={preview}
                    alt={`Prévia da foto ${i + 1}`}
                    className="rounded-lg object-cover w-full h-20"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-sm leading-none hover:bg-red-700"
                    aria-label="Remover foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bairro</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: Centro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Orçamento sugerido (R$)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: 150"
            />
          </div>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={salvando}
            className="bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {salvando ? "Publicando..." : "Publicar tarefa"}
          </button>
          <Link
            href="/tarefas"
            className="text-gray-500 hover:text-gray-800 py-2.5 px-4"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}

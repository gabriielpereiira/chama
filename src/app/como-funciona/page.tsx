import Link from "next/link";

type Etapa = {
  numero: number;
  titulo: string;
  descricao: string;
};

const passosCliente: Etapa[] = [
  {
    numero: 1,
    titulo: "Crie sua conta",
    descricao: "Cadastro rápido com nome e e-mail. Você já começa como cliente, pronto para pedir o que precisar.",
  },
  {
    numero: 2,
    titulo: "Conte o que precisa",
    descricao: "Descreva o serviço, escolha a categoria, informe o bairro e um orçamento sugerido para orientar as propostas.",
  },
  {
    numero: 3,
    titulo: "Receba orçamentos",
    descricao: "Prestadores da região veem o seu anúncio e enviam propostas com valor, prazo e uma mensagem.",
  },
  {
    numero: 4,
    titulo: "Compare e escolha",
    descricao: "Analise preço, prazo e avaliações de cada proposta e decida com quem quer fechar.",
  },
  {
    numero: 5,
    titulo: "Combine e avalie",
    descricao: "Feche o acordo, acompanhe o serviço até o fim e deixe sua avaliação para ajudar a comunidade.",
  },
];

const passosPrestador: Etapa[] = [
  {
    numero: 1,
    titulo: "Crie sua conta",
    descricao: "Cadastre-se e, quando quiser começar a oferecer serviços, ative o perfil de prestador.",
  },
  {
    numero: 2,
    titulo: "Veja tarefas da região",
    descricao: "Navegue pelos anúncios dos vizinhos e encontre quem precisa exatamente do que você faz.",
  },
  {
    numero: 3,
    titulo: "Envie seu orçamento",
    descricao: "Proponha valor e prazo, com uma mensagem que mostre por que você é a escolha certa.",
  },
  {
    numero: 4,
    titulo: "Negocie e feche",
    descricao: "Combine os detalhes com o cliente até chegar a um acordo que sirva para os dois.",
  },
  {
    numero: 5,
    titulo: "Realize e construa reputação",
    descricao: "Execute o serviço com capricho e receba avaliações que aumentam sua confiança na plataforma.",
  },
];

const ciclo: Etapa[] = [
  { numero: 1, titulo: "Anunciar", descricao: "O cliente publica o que precisa." },
  { numero: 2, titulo: "Orçar", descricao: "Prestadores enviam propostas." },
  { numero: 3, titulo: "Comparar", descricao: "O cliente analisa valor, prazo e avaliações." },
  { numero: 4, titulo: "Combinar", descricao: "As duas partes fecham o acordo." },
  { numero: 5, titulo: "Realizar", descricao: "O serviço acontece na prática." },
  { numero: 6, titulo: "Avaliar", descricao: "Cada lado deixa sua avaliação." },
];

const diferenciais = [
  {
    titulo: "Vizinhança de verdade",
    descricao: "Prestadores que moram perto de você, com deslocamento rápido e relação de confiança.",
  },
  {
    titulo: "Reputação com avaliações",
    descricao: "Cada serviço concluído vira nota e comentário, construindo confiança para os próximos.",
  },
  {
    titulo: "Você no comando",
    descricao: "Compare orçamentos, prazos e perfis antes de decidir. Nada é escolhido por você.",
  },
  {
    titulo: "Um só lugar",
    descricao: "Do anúncio à avaliação, todo o fluxo de um serviço acontece de forma simples e organizada.",
  },
];

const faq = [
  {
    pergunta: "Posso ser cliente e prestador ao mesmo tempo?",
    resposta:
      "Sim. No CHAMA o que muda é a intenção: quando você precisa de um serviço, anuncia; quando quer oferecer seu trabalho, ativa o perfil de prestador e começa a enviar orçamentos.",
  },
  {
    pergunta: "Como sei que posso confiar em um prestador?",
    resposta:
      "Você vê o nome, o bairro e as avaliações de serviços anteriores. Como tudo acontece na sua região, fica mais fácil combinar e acompanhar de perto.",
  },
  {
    pergunta: "Onde o pagamento é combinado?",
    resposta:
      "O CHAMA conecta você ao prestador. O valor do serviço é combinado entre as duas partes, com transparência no orçamento, antes de qualquer trabalho começar.",
  },
  {
    pergunta: "Como funcionam as avaliações?",
    resposta:
      "Depois que o serviço termina, cliente e prestador avaliam a experiência. A nota e o comentário ficam no perfil e ajudam a comunidade a escolher melhor.",
  },
];

function Seta() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[#e67e22]"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ComoFuncionaPage() {
  return (
    <main className="overflow-hidden">
      {/* HERO com efeito uau */}
      <section className="relative bg-[#1e3a5f] text-white overflow-hidden">
        {/* blobs decorativos */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#e67e22]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#e67e22]/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#e67e22] font-semibold mb-4 animate-pulse">
            Guia rápido
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Dê o grito,
            <br />
            <span className="text-[#e67e22]">a vizinhança responde.</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl mb-10">
            O jeito simples e seguro de pedir ajuda e oferecer serviços para quem mora perto de você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="bg-[#e67e22] hover:bg-[#d35400] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            >
              Quero anunciar um serviço
            </Link>
            <Link
              href="/cadastro"
              className="bg-white/10 hover:bg-white/20 backdrop-blur px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            >
              Quero oferecer serviços
            </Link>
          </div>
        </div>
      </section>

      {/* DOIS CAMINHOS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#1e3a5f] text-center mb-3">
            Duas maneiras de usar o CHAMA
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-14 text-lg">
            O CHAMA funciona para os dois lados da rua: quem precisa de ajuda e quem resolve. Você pode ser os dois.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                Quem precisa de um serviço
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                Cliente: pede, compara orçamentos e escolhe.
              </p>
              <ol className="space-y-6">
                {passosCliente.map((passo) => (
                  <li key={passo.numero} className="flex gap-4">
                    <span className="w-11 h-11 rounded-full bg-[#1e3a5f] text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                      {passo.numero}
                    </span>
                    <div>
                      <h4 className="font-semibold text-[#1e3a5f]">{passo.titulo}</h4>
                      <p className="text-sm text-gray-600">{passo.descricao}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#162c47] rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-2">
                Quem oferece um serviço
              </h3>
              <p className="text-sm text-white/70 mb-8">
                Prestador: oferece, negocia e constrói reputação.
              </p>
              <ol className="space-y-6">
                {passosPrestador.map((passo) => (
                  <li key={passo.numero} className="flex gap-4">
                    <span className="w-11 h-11 rounded-full bg-[#e67e22] text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                      {passo.numero}
                    </span>
                    <div>
                      <h4 className="font-semibold">{passo.titulo}</h4>
                      <p className="text-sm text-white/70">{passo.descricao}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CICLO DO SERVIÇO */}
      <section className="relative bg-[#1e3a5f] py-20 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-[#e67e22]/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white text-center mb-3">
            O ciclo de um serviço no CHAMA
          </h2>
          <p className="text-white/80 text-center max-w-2xl mx-auto mb-14 text-lg">
            Seis momentos conectam quem precisa com quem resolve, do primeiro anúncio à avaliação final.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciclo.map((etapa) => (
              <div
                key={etapa.numero}
                className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e67e22] to-[#d35400] text-white font-black flex items-center justify-center text-xl shadow-md">
                    {etapa.numero}
                  </span>
                  {etapa.numero < ciclo.length && <Seta />}
                </div>
                <h3 className="font-bold text-[#1e3a5f] text-xl mb-1">{etapa.titulo}</h3>
                <p className="text-sm text-gray-600">{etapa.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#1e3a5f] text-center mb-3">
            Por que usar o CHAMA
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-14 text-lg">
            Uma rede de confiança construída entre vizinhos, com transparência em cada etapa.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item, i) => (
              <div
                key={item.titulo}
                className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <span className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/5 text-[#e67e22] font-black flex items-center justify-center text-xl mb-4">
                  {i + 1}
                </span>
                <h3 className="font-bold text-[#1e3a5f] mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-600">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#1e3a5f] text-center mb-10">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.pergunta}
                className="group bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#e67e22]/50 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-[#1e3a5f] list-none [&::-webkit-details-marker]:hidden">
                  {item.pergunta}
                  <span className="text-[#e67e22] text-2xl leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-gray-600 mt-3">{item.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="relative bg-gradient-to-br from-[#e67e22] to-[#d35400] py-20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Pronto para dar o primeiro grito?
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Crie sua conta e anuncie o que você precisa, ou ative o perfil de prestador e comece a oferecer seu trabalho.
          </p>
          <Link
            href="/cadastro"
            className="inline-block bg-[#1e3a5f] hover:bg-[#162c47] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            Criar minha conta agora
          </Link>
        </div>
      </section>
    </main>
  );
}

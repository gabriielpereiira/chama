import Link from "next/link";

const categories = [
  { name: "Montagem de Móveis", icon: "🪑" },
  { name: "Pequenos Reparos", icon: "🔧" },
  { name: "Eletricista", icon: "⚡" },
  { name: "Encanador", icon: "🔩" },
  { name: "Diarista", icon: "🧹" },
  { name: "Jardineiro", icon: "🌿" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Precisa de um serviço em Rio Grande?
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Publique o que precisa, receba orçamentos de prestadores da sua
            região, escolha o melhor e pague com segurança.
          </p>
          <Link
            href="/cadastro"
            className="bg-[#e67e22] hover:bg-[#d35400] text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors"
          >
            Publicar um serviço
          </Link>
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1e3a5f]">
          Como funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#e67e22] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Publique a tarefa</h3>
            <p className="text-gray-600">
              Descreva o serviço, tire fotos e informe o bairro. Em minutos sua
              tarefa está no ar.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#e67e22] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Receba orçamentos</h3>
            <p className="text-gray-600">
              Prestadores locais enviam propostas com valor e prazo. Compare e
              escolha o melhor.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#e67e22] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Confirme e avalie</h3>
            <p className="text-gray-600">
              Após o serviço pronto, confirme a conclusão e avalie o prestador.
              Sua opinião ajuda a comunidade.
            </p>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e3a5f]">
            Categorias de serviço
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-[#f8f9fa] rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="font-medium text-gray-700">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#e67e22] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Publique seu primeiro serviço gratuitamente e receba orçamentos de
            prestadores de Rio Grande.
          </p>
          <Link
            href="/cadastro"
            className="bg-white text-[#e67e22] hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors"
          >
            Quero publicar um serviço
          </Link>
        </div>
      </section>
    </div>
  );
}
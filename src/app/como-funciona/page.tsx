export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">
        Como funciona o CHAMA
      </h1>
      <div className="space-y-6 text-gray-700">
        <p>
          O CHAMA conecta quem precisa de um serviço com prestadores locais em
          Rio Grande/RS. Diferente de outras plataformas, aqui você publica o
          que precisa e os prestadores enviam orçamentos para você comparar.
        </p>
        <div className="bg-[#f8f9fa] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#1e3a5f] mb-4">
            Para clientes
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Publique o serviço que você precisa</li>
            <li>Adicione fotos para ajudar os prestadores</li>
            <li>Receba orçamentos com valor e prazo</li>
            <li>Escolha o melhor e combine o pagamento</li>
            <li>Confirme a conclusão e avalie</li>
          </ol>
        </div>
        <div className="bg-[#f8f9fa] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#1e3a5f] mb-4">
            Para prestadores
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Crie sua conta gratuitamente</li>
            <li>Veja as tarefas disponíveis na sua região</li>
            <li>Envie orçamentos para as que tiver interesse</li>
            <li>Se for escolhido, execute o serviço</li>
            <li>Receba o pagamento e construa sua reputação</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
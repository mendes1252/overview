import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";

const posts = [
  {
    slug: "melhores-apps-produtividade-ia-2026",
    title: "7 Melhores Apps de Produtividade com IA em 2026 Que Realmente Funcionam",
    excerpt:
      "Testei mais de 40 apps para você não precisar. Classificados por resultados reais — não por marketing.",
    category: "Ferramentas de IA",
    readTime: "12 min de leitura",
    date: "30 de abril de 2026",
    featured: true,
  },
  {
    slug: "como-construir-melhores-habitos-com-ia",
    title: "Como Construir Melhores Hábitos em 30 Dias Usando IA",
    excerpt:
      "A maioria dos apps de hábitos falha porque rastreia sequências, não padrões. Veja o método baseado em ciência que muda isso.",
    category: "Hábitos",
    readTime: "9 min de leitura",
    date: "30 de abril de 2026",
    featured: false,
  },
  {
    slug: "gerenciamento-de-tarefas-com-ia-vs-listas-tradicionais",
    title: "Gerenciamento de Tarefas com IA vs. Listas Tradicionais: O Que 10.000 Usuários Descobriram",
    excerpt:
      "Listas tradicionais foram otimizadas para lista de compras. Veja o que acontece quando profissionais do conhecimento migram para IA.",
    category: "Produtividade",
    readTime: "10 min de leitura",
    date: "30 de abril de 2026",
    featured: false,
  },
];

export const metadata = {
  title: "Blog — IA, Produtividade e Empreendedorismo | Pulse",
  description:
    "Guias práticos sobre ferramentas de IA, ciência dos hábitos e gerenciamento de tarefas para profissionais que querem fazer menos e conquistar mais.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-[#1A1A2E] pt-24 pb-32 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-[52px] font-light text-white leading-tight tracking-[-0.02em] mb-5">
            IA. Produtividade.{" "}
            <span className="bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] bg-clip-text text-transparent font-medium">
              Resultados.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto font-light">
            Guias práticos testados por usuários reais — sem listas recicladas.
          </p>
        </div>

        {/* Post em Destaque */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A9FFF] bg-[#4A9FFF]/10 px-3 py-1 rounded-full">
                Destaque
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 bg-white/5 px-3 py-1 rounded-full">
                {featured.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-4 group-hover:text-[#4A9FFF] transition-colors tracking-tight">
              {featured.title}
            </h2>
            <p className="text-white/50 font-light leading-relaxed mb-6 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-6 text-xs text-white/30 font-light">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {featured.readTime}
              </span>
              <span>{featured.date}</span>
              <span className="flex items-center gap-1 text-[#4A9FFF] font-medium ml-auto">
                Ler artigo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Grade de Posts */}
        <div className="grid sm:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors p-6 sm:p-8 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-3 h-3 text-[#4A9FFF]" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-light text-white mb-3 group-hover:text-[#4A9FFF] transition-colors tracking-tight leading-snug">
                  {post.title}
                </h2>
                <p className="text-white/40 font-light text-sm leading-relaxed flex-1 mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-white/25 font-light">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-[#4A9FFF] font-medium">
                    Ler <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Newsletter */}
        <div className="mt-20 rounded-2xl border border-[#4A9FFF]/30 bg-[#4A9FFF]/5 p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-light text-white mb-3 tracking-tight">
            Receba a Seleção de Quinta
          </h3>
          <p className="text-white/50 font-light mb-8 max-w-md mx-auto">
            Uma análise de ferramenta, uma estratégia, uma coisa para parar de fazer. Leitura de 3 minutos, toda semana.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#4A9FFF] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Assinar Grátis
            </button>
          </form>
          <p className="text-white/20 text-xs mt-4 font-light">Sem spam. Cancele quando quiser.</p>
        </div>

      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";

const posts = [
  {
    slug: "best-ai-productivity-apps-2026",
    title: "7 Best AI Productivity Apps in 2026 That Actually Work",
    excerpt:
      "Tested 40+ apps so you don't have to. Ranked by real results — not marketing copy.",
    category: "AI Tools",
    readTime: "12 min read",
    date: "April 30, 2026",
    featured: true,
  },
  {
    slug: "how-to-build-better-habits-with-ai",
    title: "How to Build Better Habits in 30 Days Using AI",
    excerpt:
      "Most habit apps fail because they track streaks, not patterns. Here's the science-backed method that changes that.",
    category: "Habits",
    readTime: "9 min read",
    date: "April 30, 2026",
    featured: false,
  },
  {
    slug: "ai-task-management-vs-traditional-todo-lists",
    title: "AI Task Management vs. Traditional To-Do Lists: What 10,000 Users Discovered",
    excerpt:
      "Traditional to-do lists are optimized for grocery shopping. Here's what happens when knowledge workers switch to AI.",
    category: "Productivity",
    readTime: "10 min read",
    date: "April 30, 2026",
    featured: false,
  },
];

export const metadata = {
  title: "Blog — AI, Productivity & Entrepreneurship | Pulse",
  description:
    "Practical guides on AI tools, habit science, and task management for knowledge workers who want to do less and accomplish more.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-[#1A1A2E] pt-24 pb-32 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-[52px] font-light text-white leading-tight tracking-[-0.02em] mb-5">
            AI. Productivity.{" "}
            <span className="bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] bg-clip-text text-transparent font-medium">
              Results.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto font-light">
            Practical guides tested by real users — not recycled listicles.
          </p>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A9FFF] bg-[#4A9FFF]/10 px-3 py-1 rounded-full">
                Featured
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
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Post Grid */}
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
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 rounded-2xl border border-[#4A9FFF]/30 bg-[#4A9FFF]/5 p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-light text-white mb-3 tracking-tight">
            Get the Thursday Dispatch
          </h3>
          <p className="text-white/50 font-light mb-8 max-w-md mx-auto">
            One tool review, one strategy, one thing to stop doing. 3-minute read, every week.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#4A9FFF] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
          <p className="text-white/20 text-xs mt-4 font-light">No spam. Unsubscribe any time.</p>
        </div>

      </div>
    </main>
  );
}

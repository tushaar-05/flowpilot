import React from 'react';
import { Link } from 'react-router-dom';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-primary/20 rounded-full">
            Insights & Guides
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            The FlowPilot Blog
          </h1>
          <p className="text-base sm:text-lg text-muted font-semibold">
            Productivity tips, development guides, and product design deep dives curated by our core team.
          </p>
        </div>

        {/* Featured Post Card */}
        {blogPosts.length > 0 && (
          <Link to={`/blog/${blogPosts[0].id}`} className="block group">
            <Card padding="lg" color="yellow" className="relative overflow-hidden group-hover:shadow-brutal-hover transition-all">
              <div className="absolute right-4 bottom-4 h-16 w-16 rounded-full border-2 border-ink bg-white/20 hidden sm:flex items-center justify-center rotate-12">
                <ArrowRight className="h-6 w-6 text-ink group-hover:translate-x-1.5 transition-transform" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-muted uppercase mb-4">
                <span className="px-2.5 py-1 bg-surface border-2 border-ink rounded-full text-ink">
                  {blogPosts[0].category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {blogPosts[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {blogPosts[0].author}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-snug group-hover:text-primary transition-colors">
                {blogPosts[0].title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted font-medium max-w-3xl leading-relaxed">
                {blogPosts[0].desc}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-extrabold text-ink mt-6 group-hover:underline">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        )}

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="block group">
              <Card padding="md" color={post.color} className="h-full flex flex-col justify-between group-hover:shadow-brutal-hover transition-all">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-muted uppercase mb-3">
                    <span className="px-2 py-0.5 bg-surface border-2 border-ink rounded-full text-ink">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-ink leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-muted font-medium leading-relaxed line-clamp-3">
                    {post.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-ink/5 flex items-center justify-between text-xs font-bold text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1 font-extrabold text-ink group-hover:underline">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default BlogPage;

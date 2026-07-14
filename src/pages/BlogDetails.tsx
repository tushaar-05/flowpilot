import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { blogPosts } from '@/data/blogPosts';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

const BlogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <LandingNav />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-extrabold text-ink">Post Not Found</h1>
            <p className="text-muted">The blog article you are looking for does not exist.</p>
            <Link to="/blog">
              <Button variant="dark">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-12 px-6 max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to all articles
        </Link>

        {/* Article Container */}
        <article className="space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-primary/20 border-2 border-ink text-ink font-extrabold text-xs uppercase rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-ink leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted pt-2 border-b-2 border-ink/5 pb-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> By {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> 6 min read
              </span>
            </div>
          </div>

          {/* Featured Image placeholder / Soft Brutalist Box */}
          <div className={`relative h-64 sm:h-96 rounded-3xl border-2 border-ink bg-surface shadow-brutal overflow-hidden flex items-center justify-center p-8 bg-${post.color}/20`}>
            <div className="absolute top-4 left-4 h-8 w-8 rounded-full border-2 border-ink bg-white/30" />
            <div className="absolute bottom-6 right-8 h-20 w-20 rounded-2xl border-2 border-ink bg-white/20 rotate-12" />
            <span className="text-lg sm:text-2xl font-extrabold text-ink text-center max-w-lg italic px-4">
              "{post.desc}"
            </span>
          </div>

          {/* Article Content */}
          <Card padding="lg" className="prose prose-slate max-w-none leading-relaxed text-muted font-medium text-sm sm:text-base space-y-6">
            <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-ink first-letter:mr-3 first-letter:float-left">
              The shift toward modern product design demands a careful balance of aesthetic innovation and functional accessibility. As interfaces evolve, designers are rediscovering neo-brutalism—or more specifically, "soft-brutalism"—as a tool to make software stand out in a sea of homogenous flat design.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink pt-4">Why aesthetics impact user trust</h2>
            <p>
              Studies show that users perceive well-designed interfaces as more usable and trustworthy. FlowPilot's signature style utilizes high-contrast outlines, subtle offsets, and bright colors. These visual anchors draw attention to key interactive features like boards, inputs, and toggle buttons.
            </p>

            <blockquote className="border-l-4 border-primary pl-4 py-1 italic font-extrabold text-ink text-base my-6">
              "Design is not just what it looks like and feels like. Design is how it works."
            </blockquote>

            <h2 className="text-xl sm:text-2xl font-extrabold text-ink pt-4">Implementing themes with CSS Variables</h2>
            <p>
              By utilizing Tailwind CSS v4 variables mapped directly in the index.css `@theme`, we ensure that changing the page theme is as simple as adding or removing the `.dark` class from the root `html` element. This approach updates borders, colors, and backgrounds synchronously, leaving no layout flashes or visual shifts behind.
            </p>

            <div className="flex items-center justify-between pt-6 border-t-2 border-ink/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-ink bg-yellow overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-extrabold text-ink text-sm">{post.author}</p>
                  <p className="text-xs text-muted">Core Writer & Team Lead</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 rounded-xl border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold hover:bg-yellow/30 transition-all shadow-brutal-sm"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </Card>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
};

export default BlogDetailsPage;

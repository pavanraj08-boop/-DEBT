"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, ArrowRight, Shield, Copy, Check, 
  Image as ImageIcon, Loader2, Users, TrendingUp, Zap, 
  MessageCircle, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// 🚨 CONFIGURATION - Update these with your real links
// ==========================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekzxephakvminafxzdcq.supabase.co"; 
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_r8W6GNtrqFi6wl5Z8rfvAQ_4MNZ8icc";
const X_LINK = "https://x.com/i/communities/2012249877766439018"; 
const BUY_LINK = "https://bags.fm/22w4TrBSLXNbRUJNR4Z6njh6CrzNpk9s5b3dan5XBAGS"; 
const CONTRACT_ADDRESS = "22w4TrBSLXNbRUJNR4Z6njh6CrzNpk9s5b3dan5XBAGS"; 
// ==========================================

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- HELPER COMPONENTS ---
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Section = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <section className={`py-20 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

const Button = ({ children, variant = 'primary', href, className = '' }: any) => {
  const baseStyles = "px-8 py-4 font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 cursor-pointer text-center justify-center";
  const variants = {
    primary: "bg-red-600 hover:bg-red-700 text-white hover:scale-105 hover:shadow-2xl hover:shadow-red-600/50",
    secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
  };
  return (
    <a href={href || "#"} target="_blank" rel="noopener noreferrer" className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </a>
  );
};

export default function DebtLandingPage() {
  const [copied, setCopied] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [storyInput, setStoryInput] = useState('');
  const [postingStory, setPostingStory] = useState(false);
  const [memes, setMemes] = useState<any[]>([]);
  const [memeFile, setMemeFile] = useState<File | null>(null);
  const [memeCaption, setMemeCaption] = useState("");
  const [uploadingMeme, setUploadingMeme] = useState(false);

  useEffect(() => {
    fetchStories();
    fetchMemes();
  }, []);

  const fetchStories = async () => {
    const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
    if (data) setStories(data);
  };

  const fetchMemes = async () => {
    const { data } = await supabase.from('memes').select('*').order('created_at', { ascending: false });
    if (data) setMemes(data);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyInput.trim()) return;
    setPostingStory(true);
    const { error } = await supabase.from('stories').insert([{ content: storyInput }]);
    if (!error) { setStoryInput(''); fetchStories(); }
    setPostingStory(false);
  };

  const handleMemeUpload = async () => {
    if (!memeFile) return alert("Select an image first!");
    setUploadingMeme(true);
    try {
      const fileName = `${Date.now()}_${memeFile.name.replace(/\s/g, '_')}`;
      const { error: uploadError } = await supabase.storage.from('memes').upload(fileName, memeFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('memes').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('memes').insert([{ image_url: urlData.publicUrl, caption: memeCaption || "DEBT REBELLION" }]);
      if (dbError) throw dbError;
      setMemeFile(null); setMemeCaption(""); fetchMemes();
      alert("Meme Uploaded!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally { setUploadingMeme(false); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-red-950/10 to-black text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-8 border border-red-500 px-4 py-2 text-sm tracking-widest uppercase">
              <Shield size={16} /> The Student Debt Rebellion
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase">
              OUT OF DEBT.<br/><span className="text-red-600">TOGETHER.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              $DEBT is the student debt rebellion. A meme coin born from a generation that refuses to carry silent financial pressure anymore.
            </p>
            
            <p className="text-3xl font-bold italic mb-8 uppercase">Already broke. Might as well be free.</p>
            
            <FadeIn delay={0.4}>
              <div className="w-40 h-40 mx-auto mb-8 relative group">
                 <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <img src="/logo.png" alt="$DEBT Logo" className="w-full h-full object-contain relative z-10" />
              </div>
            </FadeIn>

            <div className="mb-8 inline-flex items-center gap-3 bg-[#0a0a0a] border border-gray-800 px-6 py-3 hover:border-red-600 transition-colors cursor-pointer" onClick={copyToClipboard}>
              <span className="text-xs text-gray-500 uppercase tracking-widest">CA:</span>
              <code className="text-sm text-red-500 font-mono">{CONTRACT_ADDRESS.slice(0,6)}...{CONTRACT_ADDRESS.slice(-6)}</code>
              <button className="p-2">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href={BUY_LINK}>Buy on Bags <ArrowRight size={20} /></Button>
              <Button variant="secondary" href={X_LINK}>Follow on X</Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- PROBLEM SECTION --- */}
      <Section className="bg-[#0a0a0a] text-center">
        <FadeIn>
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight uppercase">
            Student debt is the <span className="text-red-600">chain</span> around our generation
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-xl text-gray-300 leading-relaxed">
            <p>Tuition keeps rising. Living costs keep rising. Paychecks stay the same.</p>
            <p>Millions of students graduate into decades of repayments — alone, overwhelmed, and quiet about it.</p>
            <p className="text-2xl font-bold text-white pt-6">But debt isn't a personal failure. It's a system problem.</p>
            <p className="text-2xl font-bold text-red-600 uppercase">And system problems get solved together.</p>
          </div>
        </FadeIn>
      </Section>

      {/* --- THE SYSTEM IS RIGGED (VERIFIED 2026 DATA) --- */}
      <Section className="bg-[#111] text-[#F5F5F0] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
          <div className="lg:w-1/3 lg:sticky lg:top-24 text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white uppercase">
              THE SYSTEM <br/> IS RIGGED. <br/> <span className="text-red-600 text-left">HERE IS THE PROOF.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">Verified live and active data as of 2026.</p>
          </div>
          
          <div className="lg:w-2/3 grid gap-6">
            {[
              { 
                title: "$1.81 Trillion Total Crisis", 
                source: "Education Data Initiative", 
                text: "Total student debt reached $1.81 Trillion in 2026. It is now the second-highest consumer debt category after mortgages.", 
                url: "https://educationdata.org/student-loan-debt-statistics" 
              },
              { 
                title: "The Wage-to-Tuition Gap", 
                source: "NCES (Government Data)", 
                text: "Official data shows college costs have increased by 169% since 1980, while earnings of young workers grew by just 19%.", 
                url: "https://nces.ed.gov/fastfacts/display.asp?id=76" 
              },
              { 
                title: "The 10-Year Homeownership Delay", 
                source: "Realtor.com Analysis", 
                text: "A 2026 analysis shows student debt delays homeownership by an average of 10 years for 27% of graduates.", 
                url: "https://www.realtor.com/advice/finance/student-loans-homeownership-delay-2026-repayment-changes/" 
              },
              { 
                title: "Wealth Loss: The 7x Gap", 
                source: "FRB Boston", 
                text: "By age 40, households without student debt accumulate up to seven times more wealth than those who carried loans.", 
                url: "https://www.bostonfed.org/publications/current-policy-perspectives/2014/student-loan-debt-and-economic-outcomes.aspx" 
              }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={stat.url} target="_blank" className="block bg-[#1a1a1a] p-8 border-l-4 border-red-600 hover:bg-[#252525] transition-all text-left group">
                  <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 mb-2"><FileText size={12} /> {stat.source}</span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors uppercase tracking-tight">{stat.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{stat.text}</p>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* --- MEET $DEBT SECTION --- */}
      <Section className="bg-black text-center">
        <FadeIn>
          <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase text-white">Meet <span className="text-red-600">$DEBT</span></h2>
          <div className="w-48 h-48 mx-auto rounded-full border-4 border-red-600 mb-12 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)]">
            <img src="/logo.png" alt="$DEBT Coin" className="w-full h-full object-cover" />
          </div>
          <p className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">$DEBT is not a project. Not a startup. Not a roadmap. It's a shared joke, shared pain, and shared movement.</p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Share stories", desc: "Your journey matters. Your struggle is valid." },
              { icon: TrendingUp, title: "Share strategies", desc: "Learn what's working for others like you." },
              { icon: Zap, title: "Share opportunities", desc: "Side hustles, tips, and wins we find together." },
              { icon: MessageCircle, title: "Share wins", desc: "Every payment celebrated. Every milestone honored." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-red-600 transition-colors">
                <item.icon className="text-red-600 mb-4" size={32} />
                <h3 className="text-2xl font-bold mb-2 uppercase">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* --- WHY MEME COIN --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/10 to-black text-center">
        <FadeIn>
          <h2 className="text-5xl font-black mb-12 uppercase">Why a <span className="text-red-600">Meme Coin?</span></h2>
          <div className="space-y-6 text-xl text-gray-300">
            <p>Because <span className="text-white font-bold uppercase">humor spreads faster than lectures.</span></p>
            <p>Because <span className="text-white font-bold uppercase">community beats isolation.</span></p>
            <p>Because sometimes the best way to fight pressure is to <span className="text-red-600 font-bold uppercase italic">laugh at it — together.</span></p>
          </div>
        </FadeIn>
      </Section>

      {/* --- HOW TO JOIN --- */}
      <Section className="bg-[#0a0a0a] text-center">
        <h2 className="text-5xl font-black mb-16 uppercase">How to <span className="text-red-600">Join</span></h2>
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            { step: "01", title: "Get Solana", desc: "Set up a Solana wallet" },
            { step: "02", title: "Buy $DEBT", desc: "Purchase on Bags" },
            { step: "03", title: "Hold Strong", desc: "Join the community" },
            { step: "04", title: "Share & Meme", desc: "Post your stories" }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-black text-red-600/20 mb-4">{item.step}</div>
              <h3 className="text-2xl font-bold mb-2 uppercase">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-2xl font-bold mb-8 uppercase italic tracking-widest text-red-600">No barriers. No applications. No permission.</p>
        <Button variant="primary" href={BUY_LINK}>Join Now <ArrowRight size={20}/></Button>
      </Section>

      {/* --- COMMUNITY WALL --- */}
      <Section className="bg-black text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase">Community <span className="text-red-600">Wall</span></h2>
        <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">Post your debt confessions, ramen survival stories, and chain-break milestones.</p>

        {/* MEME UPLOADER */}
        <div className="bg-[#0a0a0a] border border-gray-800 p-8 mb-16 text-left border-2 border-red-600 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">UPLOAD A MEME</h3>
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
               <input type="file" accept="image/*" onChange={(e: any) => setMemeFile(e.target.files[0])} className="hidden" id="meme-upload" />
               <label htmlFor="meme-upload" className="flex items-center justify-center gap-3 w-full bg-white border-2 border-dashed border-gray-700 p-4 cursor-pointer text-black hover:bg-gray-200 transition-all font-bold uppercase">
                  <ImageIcon size={20}/> {memeFile ? memeFile.name : "Select Image"}
               </label>
            </div>
            <div className="flex-[2] w-full">
              <input type="text" placeholder="CAPTION..." value={memeCaption} onChange={(e) => setMemeCaption(e.target.value)} className="w-full bg-white p-4 text-black focus:border-red-600 focus:outline-none uppercase font-bold text-xl" />
            </div>
            <button onClick={handleMemeUpload} disabled={uploadingMeme} className="w-full md:w-auto bg-red-600 text-white px-8 py-4 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 min-w-[140px] text-lg">
              {uploadingMeme ? <Loader2 className="animate-spin mx-auto" /> : "Upload"}
            </button>
          </div>
        </div>

        {/* STORY INPUT SECTION - FIXED VISIBILITY */}
        <div className="max-w-3xl mx-auto border-t border-gray-900 pt-12">
          <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest">
             <span className="text-red-600">CONFESSIONS</span> & STORIES
          </h3>

          <form onSubmit={handleStorySubmit} className="mb-12 flex shadow-2xl border-2 border-red-600 overflow-hidden">
              <input 
                  type="text" 
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  placeholder="TYPE YOUR STORY HERE..."
                  className="flex-1 p-6 bg-white text-black text-xl focus:outline-none font-bold placeholder:text-gray-400"
              />
              <button type="submit" disabled={postingStory} className="bg-red-700 hover:bg-red-600 text-white font-black px-10 uppercase transition-colors min-w-[140px] text-lg">
                  {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "POST"}
              </button>
          </form>

          {/* STORY LIST */}
          <div className="space-y-4">
            {[
              { text: "Finally paid off my first loan. Felt like breaking actual chains.", date: "2 days ago" },
              { text: "Graduated with $87K in debt. Found this community. Don't feel alone anymore.", date: "1 week ago" },
              { text: "Ate ramen for 3 months straight. Made my first payment. We're doing this.", date: "3 days ago" }
            ].map((s, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                <p className="text-xl text-gray-200 mb-4 font-medium italic">"{s.text}"</p>
                <p className="text-xs text-red-600 font-bold uppercase">{s.date}</p>
              </div>
            ))}
            {stories.map((s: any) => (
              <div key={s.id} className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                <p className="text-xl text-gray-200 mb-4 font-medium italic">"{s.content}"</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{formatDate(s.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- MISSION --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/20 to-black text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-12 uppercase text-white">The <span className="text-red-600">Mission</span></h2>
        <div className="space-y-8 text-2xl leading-relaxed max-w-4xl mx-auto">
          <p className="font-bold text-white uppercase">No student should feel alone in debt.</p>
          <p className="font-bold text-white uppercase">No generation should carry shame for a broken system.</p>
          <p className="text-gray-300">So we built a place to stand together. And meme through it.</p>
        </div>
      </Section>

      {/* --- FINAL FOOTER CTA --- */}
      <Section className="bg-black text-center py-32 border-t border-gray-900">
        <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase text-white">Already in debt.<br/><span className="text-red-600">Might as well be free.</span></h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" href={BUY_LINK}>Buy on Bags</Button>
                <Button variant="secondary" href={X_LINK}>Follow on X</Button>
            </div>
        </FadeIn>
      </Section>

      <footer className="bg-[#0a0a0a] border-t border-gray-900 py-12 px-6 text-center text-white">
        <p className="text-sm text-gray-600 italic tracking-widest uppercase">$DEBT is a meme coin. No promises. Just vibes.</p>
      </footer>
    </div>
  );
}
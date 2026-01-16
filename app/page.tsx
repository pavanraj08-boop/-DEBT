"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, ArrowRight, Shield, Copy, Check, Upload, 
  Image as ImageIcon, Loader2, Users, TrendingUp, Zap, 
  MessageCircle, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// 🚨 CONFIGURATION
// ==========================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekzxephakvminafxzdcq.supabase.co"; 
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_r8W6GNtrqFi6wl5Z8rfvAQ_4MNZ8icc";
const X_LINK = "https://x.com/i/communities/2012249877766439018"; 
const BUY_LINK = "https://bags.fm/token/your_contract_address"; 
const CONTRACT_ADDRESS = "88888888888888888888888888888888"; 
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
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center relative z-10 max-w-6xl">
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
              <button className="p-2 hover:bg-red-600/20 transition-colors rounded">
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
      <Section className="bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight uppercase">
              Student debt is the <span className="text-red-600">chain</span> around our generation
            </h2>
            <div className="space-y-6 text-xl text-gray-300 leading-relaxed">
              <p>Tuition keeps rising. Living costs keep rising. Paychecks stay the same.</p>
              <p>Millions of students graduate into decades of repayments — alone, overwhelmed, and quiet about it.</p>
              <p className="text-2xl font-bold text-white pt-6">But debt isn't a personal failure. It's a system problem.</p>
              <p className="text-2xl font-bold text-red-600 uppercase">And system problems get solved together.</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- REALITY SECTION (UPDATED ARTICLES) --- */}
      <Section className="bg-[#111] text-[#F5F5F0] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
          <div className="lg:w-1/3 lg:sticky lg:top-24 text-left">
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-4 border border-red-500 px-3 py-1 text-xs tracking-widest uppercase">
              <ShieldCheck size={14} /> Verified Data
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white uppercase">
              THE SYSTEM <br/> IS RIGGED. <br/> <span className="text-red-600 text-left">HERE IS THE PROOF.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              We didn't start this fire. We are just trying to survive it.
            </p>
          </div>
          
          <div className="lg:w-2/3 grid gap-6">
            {[
              { 
                title: "$1.75 Trillion Total Crisis", 
                source: "Federal Reserve Data", 
                text: "The total US student loan debt has outpaced credit card debt, creating a permanent drag on the economy.", 
                url: "https://www.federalreserve.gov/releases/g19/current/" 
              },
              { 
                title: "The Wage-to-Tuition Gap", 
                source: "NCES Report", 
                text: "Since 1980, the cost of college has increased by 169%, while earnings for young workers grew by just 19%.", 
                url: "https://nces.ed.gov/fastfacts/display.asp?id=76" 
              },
              { 
                title: "Interest: The Invisible Anchor", 
                source: "CFPB Analysis", 
                text: "Borrowers often pay back double their original loan amount due to predatory compounding interest rates.", 
                url: "https://www.consumerfinance.gov/data-research/student-loan-data/" 
              },
              { 
                title: "Lifetime Wealth Destruction", 
                source: "Economic Policy Institute", 
                text: "Student debt delays homeownership and retirement by an average of 7-10 years for modern graduates.", 
                url: "https://www.epi.org/publication/student-debt-and-the-economy/" 
              }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={stat.url} target="_blank" rel="noopener noreferrer" className="block bg-[#1a1a1a] p-8 border-l-4 border-red-600 hover:bg-[#252525] transition-all text-left group">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2"><FileText size={12} /> {stat.source}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{stat.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{stat.text}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-widest">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div> Verified Source
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* --- MEET $DEBT SECTION --- */}
      <Section className="bg-black relative text-center">
        <div className="max-w-5xl mx-auto">
            <FadeIn>
                <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase">Meet <span className="text-red-600">$DEBT</span></h2>
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-red-600 mb-12 overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                   <img src="/logo.png" alt="$DEBT Coin" className="w-full h-full object-cover" />
                </div>
                <p className="text-2xl text-gray-300 mb-8">$DEBT is not a project. Not a startup. Not a roadmap.</p>
                <p className="text-3xl font-bold text-white mb-16 uppercase italic">It's a shared joke, shared pain, and shared movement.</p>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                    {[
                        { icon: Users, title: "Share stories", desc: "Your journey matters. Your struggle is valid." },
                        { icon: TrendingUp, title: "Share strategies", desc: "Learn what's working for others like you." },
                        { icon: Zap, title: "Share opportunities", desc: "Side hustles, tips, and wins we find together." },
                        { icon: MessageCircle, title: "Share wins", desc: "Every payment celebrated. Every milestone honored." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-red-600 transition-colors group">
                           <item.icon className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
                           <h3 className="text-2xl font-bold mb-2 uppercase">{item.title}</h3>
                           <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xl text-red-600 mt-12 font-bold uppercase italic tracking-widest">And meme the system while doing it.</p>
            </FadeIn>
        </div>
      </Section>

      {/* --- WHY MEME COIN --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/10 to-black text-center">
         <div className="max-w-4xl mx-auto">
            <FadeIn>
                <h2 className="text-5xl font-black mb-12 uppercase">Why a <span className="text-red-600">Meme Coin?</span></h2>
                <div className="space-y-6 text-xl text-gray-300">
                    <p>Because <span className="text-white font-bold">humor spreads faster than lectures.</span></p>
                    <p>Because <span className="text-white font-bold">community beats isolation.</span></p>
                    <p>Because sometimes the best way to fight pressure is to <span className="text-white font-bold uppercase">laugh at it — together.</span></p>
                </div>
                <div className="mt-16 p-12 bg-[#0a0a0a] border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    <p className="text-3xl font-black uppercase tracking-tighter">$DEBT is <span className="text-red-600">culture</span>. $DEBT is <span className="text-red-600">identity</span>. $DEBT is the <span className="text-red-600">rebellion</span>.</p>
                </div>
            </FadeIn>
         </div>
      </Section>

      {/* --- HOW TO JOIN --- */}
      <Section className="bg-[#0a0a0a] text-center">
        <div className="max-w-5xl mx-auto">
             <h2 className="text-5xl font-black mb-16 uppercase text-center">How to <span className="text-red-600">Join</span></h2>
             <div className="grid md:grid-cols-4 gap-8">
                {[
                    { step: "01", title: "Get Solana", desc: "Set up a Solana wallet" },
                    { step: "02", title: "Buy $DEBT", desc: "Purchase on Bags" },
                    { step: "03", title: "Hold Strong", desc: "Join the community" },
                    { step: "04", title: "Share & Meme", desc: "Post your stories" }
                ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="text-center">
                            <div className="text-6xl font-black text-red-600/20 mb-4">{item.step}</div>
                            <h3 className="text-2xl font-bold mb-2 uppercase">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    </FadeIn>
                ))}
             </div>
             <div className="mt-16">
                 <p className="text-2xl font-bold mb-8 uppercase italic">No barriers. No applications. No permission.</p>
                 <Button variant="primary" href={BUY_LINK}>Join Now <ArrowRight size={20}/></Button>
             </div>
        </div>
      </Section>

      {/* --- COMMUNITY WALL & BACKEND --- */}
      <Section className="bg-black border-t border-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase">Community <span className="text-red-600">Wall</span></h2>
            <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
              Post your debt confessions, ramen survival stories, first paycheck wins, and chain-break milestones.
            </p>
          </FadeIn>

          {/* MEME UPLOADER */}
          <FadeIn delay={0.2}>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 md:p-8 mb-16 relative group hover:border-red-600 transition-colors text-left">
              <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">UPLOAD A MEME</h3>
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={(e: any) => setMemeFile(e.target.files[0])} className="hidden" id="meme-upload" />
                     <label htmlFor="meme-upload" className="flex items-center justify-center gap-3 w-full bg-[#111] border-2 border-dashed border-gray-700 p-4 cursor-pointer hover:border-red-600 hover:text-white text-gray-400 transition-all uppercase font-bold text-sm">
                        <ImageIcon size={20}/> {memeFile ? memeFile.name : "Select Image"}
                     </label>
                   </div>
                </div>
                <div className="flex-[2] w-full">
                  <input type="text" placeholder="CAPTION..." value={memeCaption} onChange={(e) => setMemeCaption(e.target.value)} className="w-full bg-[#111] border border-gray-800 p-4 text-white focus:border-red-600 focus:outline-none uppercase font-bold" />
                </div>
                <button onClick={handleMemeUpload} disabled={uploadingMeme} className="w-full md:w-auto bg-red-600 text-white px-8 py-4 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 min-w-[140px]">
                  {uploadingMeme ? <Loader2 className="animate-spin mx-auto" /> : "Upload"}
                </button>
              </div>
            </div>
          </FadeIn>

          {/* MEME GALLERY */}
          <div className="mb-20">
             <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-2 uppercase text-left">
               <span className="w-2 h-8 bg-red-600 block"></span> MEME GALLERY
            </h3>
            {memes.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-[#0a0a0a] border border-gray-800 flex items-center justify-center text-gray-700 font-bold uppercase text-xs italic">
                      Meme {i}: Your meme here
                    </div>
                  ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {memes.map(meme => (
                        <div key={meme.id} className="aspect-square bg-[#111] border border-gray-800 relative group overflow-hidden">
                            <img src={meme.image_url} alt="meme" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                {meme.caption}
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* STORY WALL */}
          <div className="max-w-3xl mx-auto border-t border-gray-900 pt-12">
                <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest">
                   <span className="text-red-600">CONFESSIONS</span> & STORIES
                </h3>

                <form onSubmit={handleStorySubmit} className="mb-12 flex shadow-2xl">
                    <input 
                        type="text" 
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                        placeholder="Share your story..."
                        className="flex-1 p-6 text-black text-lg focus:outline-none font-medium"
                    />
                    <button type="submit" disabled={postingStory} className="bg-red-700 hover:bg-red-600 text-white font-bold px-8 uppercase transition-colors min-w-[120px]">
                        {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "Post"}
                    </button>
                </form>

                <div className="space-y-4">
                    {/* Placeholder static stories as requested */}
                    <div className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                        <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed italic">
                            "Finally paid off my first loan. Felt like breaking actual chains."
                        </p>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wider">2 days ago</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                        <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed italic">
                            "Graduated with $87K in debt. Found this community. Don't feel alone anymore."
                        </p>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wider">1 week ago</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                        <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed italic">
                            "Ate ramen for 3 months straight. Made my first payment. We're doing this."
                        </p>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wider">3 days ago</p>
                    </div>

                    {/* Dynamic stories from database */}
                    {stories.map((s: any) => (
                        <div key={s.id} className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                            <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed italic italic">"{s.content}"</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{formatDate(s.created_at)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16">
                    <p className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-tighter italic">
                        If one of us wins — we all win.
                    </p>
                </div>
            </div>
        </div>
      </Section>

      {/* --- MISSION --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/20 to-black text-center">
          <div className="max-w-4xl mx-auto">
              <FadeIn>
                  <h2 className="text-5xl md:text-6xl font-black mb-12 uppercase">The <span className="text-red-600">Mission</span></h2>
                  <div className="space-y-8 text-2xl leading-relaxed mb-16">
                      <p className="font-bold text-white uppercase">We believe: No student should feel alone in debt.</p>
                      <p className="font-bold text-white uppercase">No generation should carry shame for a broken system.</p>
                      <p className="text-gray-300 mt-12">So we built a place to stand together. And meme through it.</p>
                  </div>
              </FadeIn>
          </div>
      </Section>

      {/* --- FINAL FOOTER CTA --- */}
      <Section className="bg-black text-center py-32 border-t border-gray-900">
        <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase">Already in debt.<br/><span className="text-red-600">Might as well be free.</span></h2>
            <p className="text-3xl font-bold mb-12 text-gray-300 uppercase italic">Join the $DEBT rebellion today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" href={BUY_LINK}>Buy on Bags</Button>
                <Button variant="secondary" href={X_LINK}>Follow on X</Button>
            </div>
        </FadeIn>
      </Section>

      <footer className="bg-[#0a0a0a] border-t border-gray-900 py-12 px-6 text-center">
        <p className="text-sm text-gray-600">$DEBT is a meme coin. No promises. Just vibes.</p>
      </footer>
    </div>
  );
}
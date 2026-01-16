"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, ArrowRight, Shield, Copy, Check, 
  Image as ImageIcon, Loader2, Users, TrendingUp, Zap, 
  MessageCircle, FileText, Wallet, ShoppingCart, HeartHandshake, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// 🚨 CONFIGURATION - Update these with your real links
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
  const baseStyles = "px-8 py-4 font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 cursor-pointer text-center justify-center uppercase tracking-tighter";
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
    } catch (error) { console.error(error); alert("Upload failed."); } finally { setUploadingMeme(false); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <Section className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-black via-red-950/10 to-black text-center">
        <div className="relative z-10 max-w-6xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-8 border border-red-500 px-4 py-2 text-sm uppercase tracking-widest">
              <Shield size={16} /> The Student Debt Rebellion
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase">
              OUT OF DEBT.<br/><span className="text-red-600">TOGETHER.</span>
            </h1>
            
            <div className="space-y-4 text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto uppercase font-medium">
                <p>Student debt is the <span className="text-red-600">chain</span> around our generation.</p>
                <p className="text-base text-gray-500">Tuition keeps rising. Living costs keep rising. Paychecks stay the same.</p>
            </div>
            
            <p className="text-3xl font-bold italic mb-8 uppercase text-white">Already broke. Might as well be free.</p>

            <div className="mb-8 inline-flex items-center gap-3 bg-[#0a0a0a] border border-gray-800 px-6 py-3 hover:border-red-600 transition-colors cursor-pointer" onClick={copyToClipboard}>
              <span className="text-xs text-gray-500 uppercase tracking-widest">CA:</span>
              <code className="text-sm text-red-500 font-mono">{CONTRACT_ADDRESS.slice(0,6)}...{CONTRACT_ADDRESS.slice(-6)}</code>
              <button className="p-2">{copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href={BUY_LINK}>Join the Rebellion <ArrowRight size={20} /></Button>
              <Button variant="secondary" href={X_LINK}>Follow on X</Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- MEET $DEBT --- */}
      <Section className="bg-[#0a0a0a] text-center border-y border-gray-900">
        <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase italic">Meet <span className="text-red-600">$DEBT</span></h2>
            
            <div className="w-56 h-56 mx-auto mb-12 relative group">
                <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.png" alt="$DEBT Logo" className="w-full h-full object-contain relative z-10" />
            </div>

            <div className="max-w-3xl mx-auto space-y-6 text-2xl font-bold text-gray-300 mb-16 uppercase">
                <p>$DEBT is not a project. Not a startup. Not a roadmap.</p>
                <p className="text-red-600 italic">It's a shared joke, shared pain, and shared movement.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {[
                    { icon: MessageCircle, title: "Share stories", desc: "Your journey matters. Your struggle is valid." },
                    { icon: TrendingUp, title: "Share strategies", desc: "Learn what's working for others like you." },
                    { icon: Zap, title: "Share opportunities", desc: "Side hustles, tips, and wins we find together." },
                    { icon: HeartHandshake, title: "Share wins", desc: "Every payment celebrated. Every milestone honored." }
                ].map((item, i) => (
                    <div key={i} className="bg-black border border-gray-800 p-8 hover:border-red-600 transition-all">
                        <item.icon className="text-red-600 mb-4" size={32} />
                        <h3 className="text-xl font-black mb-2 uppercase italic">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
            <p className="mt-12 text-xl font-black uppercase text-gray-500 tracking-widest italic">And meme the system while doing it.</p>
        </FadeIn>
      </Section>

      {/* --- WHY MEME COIN --- */}
      <Section className="bg-black text-center">
        <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase">Why a <span className="text-red-600">Meme Coin?</span></h2>
            <div className="space-y-8 max-w-4xl mx-auto text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
                <p>Because <span className="text-white">humor spreads faster than lectures.</span></p>
                <p>Because <span className="text-white">community beats isolation.</span></p>
                <p>Because sometimes the best way to fight pressure is to <span className="text-red-600 underline">laugh at it — together.</span></p>
            </div>
            <div className="mt-20 flex flex-wrap justify-center gap-8 text-lg font-black uppercase opacity-50 italic">
                <span>$DEBT is culture</span>
                <span>$DEBT is identity</span>
                <span>$DEBT is the rebellion</span>
            </div>
        </FadeIn>
      </Section>

      {/* --- HOW TO JOIN --- */}
      <Section className="bg-[#0a0a0a] border-y border-gray-900">
        <h2 className="text-5xl font-black mb-16 text-center uppercase italic">How to <span className="text-red-600">Join</span></h2>
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            { step: "01", icon: Wallet, title: "Get Solana", desc: "Set up a Solana wallet" },
            { step: "02", icon: ShoppingCart, title: "Buy $DEBT", desc: "Purchase on Bags" },
            { step: "03", icon: Users, title: "Hold Strong", desc: "Join the community" },
            { step: "04", icon: Share2, title: "Share & Meme", desc: "Post your stories" }
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <div className="text-8xl font-black text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 z-0">{item.step}</div>
              <div className="relative z-10">
                <item.icon className="mx-auto text-red-600 mb-4" size={40} />
                <h3 className="text-2xl font-black mb-2 uppercase italic">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center max-w-2xl mx-auto">
            <p className="text-xl font-bold mb-10 italic text-gray-500">That's it. No barriers. No applications. No permission.</p>
            <Button variant="primary" href={BUY_LINK}>Join Now <ArrowRight size={20} /></Button>
        </div>
      </Section>

      {/* --- THE SYSTEM IS RIGGED (VERIFIED 2026 SOURCES) --- */}
      <Section className="bg-black">
        <div className="flex flex-col lg:flex-row gap-12 text-left">
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic leading-none">The System <br/> <span className="text-red-600">is Rigged.</span></h2>
            <p className="text-gray-500 uppercase font-bold text-sm tracking-widest">Verified 2026 Data Reports:</p>
          </div>
          <div className="lg:w-2/3 grid gap-6">
            {[
              { title: "$1.81 Trillion Total Crisis", source: "Education Data Initiative", text: "Total student debt reached $1.81 Trillion in 2026. It is now the second-highest consumer debt category after mortgages.", url: "https://educationdata.org/student-loan-debt-statistics" },
              { title: "The Wage-to-Tuition Gap", source: "NCES Report", text: "Since 1980, college costs have increased by 169%, while actual earnings of young workers have remained stagnant.", url: "https://nces.ed.gov/fastfacts/display.asp?id=76" },
              { title: "The 10-Year Housing Delay", source: "Realtor.com", text: "A 2026 analysis shows student debt delays homeownership by an average of 10 years for 27% of graduates.", url: "https://www.realtor.com/advice/finance/student-loans-homeownership-delay-2026-repayment-changes/" },
              { title: "Wealth Loss: The 7x Gap", source: "FRB Boston", text: "By age 40, households without student debt accumulate up to seven times more wealth than those who carried loans.", url: "https://www.bostonfed.org/publications/current-policy-perspectives/2014/student-loan-debt-and-economic-outcomes.aspx" }
            ].map((stat, i) => (
              <a key={i} href={stat.url} target="_blank" className="block bg-[#0a0a0a] p-8 border-l-4 border-red-600 hover:bg-[#111] transition-all group">
                <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 mb-2"><FileText size={12} /> {stat.source}</span>
                <h3 className="text-2xl font-black text-white mb-3 uppercase italic group-hover:text-red-500 transition-colors">{stat.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{stat.text}</p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* --- COMMUNITY WALL --- */}
      <Section className="bg-[#0a0a0a] border-t border-gray-900 text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase italic leading-none">Community <span className="text-red-600">Wall</span></h2>
        <p className="text-gray-500 uppercase font-bold text-sm tracking-widest mb-16">Post your debt confessions, ramen survival stories, and wins.</p>
        
        <div className="max-w-3xl mx-auto mb-24">
          <h3 className="text-2xl font-black mb-8 text-white uppercase italic tracking-widest">Confessions & Stories</h3>
          <form onSubmit={handleStorySubmit} className="mb-12 flex shadow-2xl border-2 border-red-600 overflow-hidden rounded-sm">
              <input 
                  type="text" 
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  placeholder="TYPE YOUR STORY HERE..."
                  className="flex-1 p-6 bg-white text-black text-xl focus:outline-none font-black placeholder:text-gray-400 uppercase italic"
              />
              <button type="submit" disabled={postingStory} className="bg-red-700 hover:bg-red-600 text-white font-black px-12 uppercase italic transition-colors min-w-[140px] text-xl">
                  {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "POST"}
              </button>
          </form>

          <div className="space-y-4">
            {[
              { text: "Finally paid off my first loan. Felt like breaking actual chains.", date: "2 days ago" },
              { text: "Graduated with $87K in debt. Found this community. Don't feel alone anymore.", date: "1 week ago" },
              { text: "Ate ramen for 3 months straight. Made my first payment. We're doing this.", date: "3 days ago" }
            ].map((s, i) => (
              <div key={i} className="bg-black border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                <p className="text-xl text-gray-200 mb-4 font-black italic uppercase tracking-tighter leading-tight">"{s.text}"</p>
                <p className="text-xs text-red-600 font-bold uppercase tracking-widest">{s.date}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl font-black text-red-600 mt-16 uppercase italic underline decoration-4 underline-offset-8">If one of us wins — we all win.</p>
        </div>

        {/* --- MEME GALLERY --- */}
        <div className="max-w-5xl mx-auto border-t border-gray-900 pt-20">
            <h3 className="text-3xl font-black mb-12 text-white uppercase italic tracking-widest">Meme Gallery</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-black border border-gray-800 flex items-center justify-center p-4 group hover:border-red-600 transition-all cursor-pointer">
                        <span className="text-gray-700 font-black uppercase text-xs text-center group-hover:text-red-500 italic">Meme {i}<br/>Your mascot here</span>
                    </div>
                ))}
            </div>

            <div className="bg-black border-2 border-red-600 p-8 text-left inline-block max-w-2xl mx-auto rounded-sm">
                <h4 className="text-xl font-black mb-4 uppercase italic">The Mission</h4>
                <div className="space-y-4 text-gray-300 font-bold uppercase text-sm leading-relaxed">
                    <p>We believe: No student should feel alone in debt.</p>
                    <p>No generation should carry shame for a broken system.</p>
                    <p className="text-white">So we built a place to stand together. And meme through it.</p>
                </div>
            </div>
        </div>
      </Section>

      <footer className="bg-black border-t border-gray-900 py-16 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase italic">Already in debt.<br/><span className="text-red-600 underline decoration-8">Might as well be free.</span></h2>
        <Button variant="primary" href={BUY_LINK} className="mb-12">Buy on Bags</Button>
        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">$DEBT is a meme coin. No promises. Just vibes. Post-ironic financial rebellion.</p>
      </footer>
    </div>
  );
}
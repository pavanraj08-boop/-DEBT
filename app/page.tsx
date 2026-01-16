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
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-red-950/10 to-black text-center">
        <div className="relative z-10 max-w-6xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-8 border border-red-500 px-4 py-2 text-sm tracking-widest uppercase">
              <Shield size={16} /> The Student Debt Rebellion
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase">
              OUT OF DEBT.<br/><span className="text-red-600">TOGETHER.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Student debt is the chain around our generation. We are breaking it, one meme at a time.
            </p>
            
            <p className="text-3xl font-bold italic mb-8 uppercase">Already broke. Might as well be free.</p>
            
            <FadeIn delay={0.4}>
              <div className="w-48 h-48 mx-auto mb-8 relative group">
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

      {/* --- REALITY SECTION (VERIFIED SOURCES) --- */}
      <Section className="bg-[#111] text-[#F5F5F0] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10 text-left">
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white uppercase">
              THE SYSTEM <br/> IS RIGGED. <br/> <span className="text-red-600">HERE IS THE PROOF.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">Click a report to verify the data behind the rebellion.</p>
          </div>
          
          <div className="lg:w-2/3 grid gap-6">
            {[
              { 
                title: "$1.81 Trillion Total Crisis", 
                source: "Education Data Initiative", 
                text: "Student debt is officially the second-highest consumer debt category in the US as of 2026.", 
                url: "https://educationdata.org/student-loan-debt-statistics" 
              },
              { 
                title: "The Wage-to-Tuition Gap", 
                source: "NCES Report", 
                text: "College costs have grown 169% faster than the wages of young workers since 1980.", 
                url: "https://nces.ed.gov/fastfacts/display.asp?id=76" 
              },
              { 
                title: "The 10-Year Housing Delay", 
                source: "Realtor.com", 
                text: "Recent data confirms student debt delays homeownership by a full decade for 1 in 4 graduates.", 
                url: "https://www.realtor.com/advice/finance/student-loans-homeownership-delay-2026-repayment-changes/" 
              },
              { 
                title: "Wealth Loss: The 7x Gap", 
                source: "FRB Boston", 
                text: "Graduates without student debt accumulate 7x more wealth by age 40 than those carrying loans.", 
                url: "https://www.bostonfed.org/publications/current-policy-perspectives/2014/student-loan-debt-and-economic-outcomes.aspx" 
              }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={stat.url} target="_blank" className="block bg-[#1a1a1a] p-8 border-l-4 border-red-600 hover:bg-[#252525] transition-all group">
                  <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 mb-2"><FileText size={12} /> {stat.source}</span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors uppercase">{stat.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{stat.text}</p>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* --- COMMUNITY WALL (TYPING FIXED) --- */}
      <Section className="bg-black text-center border-t border-gray-900">
        <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase">Community <span className="text-red-600">Wall</span></h2>
        
        <div className="max-w-3xl mx-auto py-12">
          <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest">
             <span className="text-red-600">CONFESSIONS</span> & STORIES
          </h3>

          {/* INPUT FORM - BRIGHT WHITE BACKGROUND SO YOU CAN SEE YOUR TEXT */}
          <form onSubmit={handleStorySubmit} className="mb-12 flex shadow-2xl border-2 border-red-600 overflow-hidden">
              <input 
                  type="text" 
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  placeholder="TYPE YOUR STORY HERE..."
                  className="flex-1 p-6 bg-white text-black text-xl focus:outline-none font-bold placeholder:text-gray-500"
              />
              <button type="submit" disabled={postingStory} className="bg-red-700 hover:bg-red-600 text-white font-black px-10 uppercase transition-colors min-w-[140px] text-lg">
                  {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "POST"}
              </button>
          </form>

          {/* STORY LIST */}
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
              <p className="text-xl text-gray-200 mb-4 font-medium italic">"Finally paid off my first loan. Felt like breaking actual chains."</p>
              <p className="text-xs text-red-600 font-bold uppercase tracking-widest">2 Days Ago</p>
            </div>
            {stories.map((s: any) => (
              <div key={s.id} className="bg-[#0a0a0a] border border-gray-800 p-8 text-left hover:border-red-600 transition-colors">
                <p className="text-xl text-gray-200 mb-4 font-medium italic">"{s.content}"</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{formatDate(s.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- FINAL FOOTER CTA --- */}
      <Section className="bg-black text-center py-32 border-t border-gray-900">
        <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase">Already in debt.<br/><span className="text-red-600">Might as well be free.</span></h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" href={BUY_LINK}>Buy on Bags</Button>
                <Button variant="secondary" href={X_LINK}>Follow on X</Button>
            </div>
        </FadeIn>
      </Section>

      <footer className="bg-[#0a0a0a] border-t border-gray-900 py-12 px-6 text-center">
        <p className="text-sm text-gray-600 italic tracking-widest uppercase">$DEBT is a meme coin. No promises. Just vibes.</p>
      </footer>
    </div>
  );
}
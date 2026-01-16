"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, ArrowRight, Shield, Copy, Check, 
  Image as ImageIcon, Loader2, Users, TrendingUp, Zap, 
  MessageCircle, FileText, Wallet, ShoppingCart, HeartHandshake, Share2, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// 🚨 CONFIGURATION - Update these with your real links
// ==========================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL"; 
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_KEY";
const X_LINK = "https://x.com/your_username"; 
const BUY_LINK = "https://bags.fm/token/your_contract_address"; 
const CONTRACT_ADDRESS = "88888888888888888888888888888888"; 
// ==========================================

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  <section className={`py-24 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

const Button = ({ children, variant = 'primary', href, className = '' }: any) => {
  const baseStyles = "px-10 py-5 font-black text-xl transition-all duration-300 inline-flex items-center gap-3 cursor-pointer text-center justify-center uppercase tracking-tighter italic";
  const variants = {
    primary: "bg-red-600 hover:bg-red-700 text-white hover:scale-105 hover:shadow-2xl hover:shadow-red-600/50",
    secondary: "bg-transparent border-4 border-white text-white hover:bg-white hover:text-black"
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

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
    if (data) setStories(data);
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden uppercase">
      
      {/* --- HERO SECTION --- */}
      <Section className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-black via-red-950/20 to-black text-center">
        <div className="relative z-10 max-w-5xl">
          <FadeIn>
            <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tighter italic">
              STUDENT DEBT IS THE <span className="text-red-600 underline">CHAIN</span> AROUND OUR GENERATION
            </h1>
            <div className="space-y-6 text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-bold tracking-tight">
                <p>Tuition keeps rising. Living costs keep rising. Paychecks stay the same.</p>
                <p>Millions graduate into decades of repayments — alone, overwhelmed, and quiet about it.</p>
                <p className="text-white text-3xl font-black italic">But debt isn't a personal failure. It's a system problem. And system problems get solved together.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <h2 className="text-4xl font-black italic">MEET <span className="text-red-600">$DEBT</span></h2>
                <ArrowRight className="hidden sm:block text-red-600" size={48} />
                <div className="flex gap-4">
                  <Button variant="primary" href={BUY_LINK}>JOIN THE REBELLION</Button>
                </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- MEET $DEBT SECTION --- */}
      <Section className="bg-[#0a0a0a] border-y-4 border-red-600/20 text-center">
        <FadeIn>
            <div className="w-64 h-64 mx-auto mb-12 relative">
                <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-30 animate-pulse"></div>
                <img src="/logo.png" alt="$DEBT Logo" className="w-full h-full object-contain relative z-10" />
            </div>

            <div className="max-w-4xl mx-auto mb-20">
                <h3 className="text-3xl md:text-5xl font-black mb-8 italic">
                    $DEBT IS NOT A PROJECT. NOT A STARTUP. NOT A ROADMAP.
                </h3>
                <p className="text-2xl md:text-4xl font-bold text-red-600 italic underline decoration-white">
                    IT'S A SHARED JOKE, SHARED PAIN, AND SHARED MOVEMENT.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                {[
                    { icon: MessageCircle, title: "Share stories", desc: "Your journey matters. Your struggle is valid." },
                    { icon: TrendingUp, title: "Share strategies", desc: "Learn what's working for others like you." },
                    { icon: Zap, title: "Share opportunities", desc: "Side hustles, tips, and wins we find together." },
                    { icon: HeartHandshake, title: "Share wins", desc: "Every payment celebrated. Every milestone honored." }
                ].map((item, i) => (
                    <div key={i} className="bg-black border-2 border-gray-800 p-8 hover:border-red-600 transition-all group">
                        <item.icon className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
                        <h4 className="text-2xl font-black mb-3 italic">{item.title}</h4>
                        <p className="text-gray-500 font-bold leading-tight">{item.desc}</p>
                    </div>
                ))}
            </div>
            <p className="mt-16 text-2xl font-black text-white italic tracking-widest">AND MEME THE SYSTEM WHILE DOING IT.</p>
        </FadeIn>
      </Section>

      {/* --- WHY MEME COIN SECTION --- */}
      <Section className="bg-black text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex flex-wrap text-9xl font-black overflow-hidden leading-none">
            {Array(20).fill("$DEBT REBELLION ")}
        </div>
        <FadeIn>
            <h2 className="text-5xl md:text-8xl font-black mb-16 italic">WHY A <span className="text-red-600">MEMECOIN?</span></h2>
            <div className="space-y-12 max-w-5xl mx-auto text-3xl md:text-5xl font-black italic tracking-tighter">
                <p>BECAUSE <span className="text-red-600">HUMOR</span> SPREADS FASTER THAN LECTURES.</p>
                <p>BECAUSE <span className="text-red-600">COMMUNITY</span> BEATS ISOLATION.</p>
                <p>BECAUSE SOMETIMES THE BEST WAY TO FIGHT PRESSURE IS TO <span className="underline decoration-red-600 underline-offset-8">LAUGH AT IT — TOGETHER.</span></p>
            </div>
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 border-4 border-red-600 text-3xl font-black italic">$DEBT IS CULTURE</div>
                <div className="p-10 border-4 border-white text-3xl font-black italic">$DEBT IS IDENTITY</div>
                <div className="p-10 border-4 border-red-600 text-3xl font-black italic">$DEBT IS THE REBELLION</div>
            </div>
        </FadeIn>
      </Section>

      {/* --- HOW TO JOIN SECTION --- */}
      <Section className="bg-[#0a0a0a] border-y-4 border-gray-900">
        <div className="text-center mb-20">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter">HOW TO <span className="text-red-600">JOIN</span></h2>
        </div>
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {[
            { step: "01", icon: Wallet, title: "Get Solana", desc: "Set up a Solana wallet" },
            { step: "02", icon: ShoppingCart, title: "Buy $DEBT", desc: "Purchase on Bags" },
            { step: "03", icon: Users, title: "Hold Strong", desc: "Join the community" },
            { step: "04", icon: Share2, title: "Share & Meme", desc: "Post your stories" }
          ].map((item, i) => (
            <div key={i} className="text-center relative group">
              <div className="text-9xl font-black text-white/5 absolute -top-12 left-1/2 -translate-x-1/2 z-0 group-hover:text-red-600/10 transition-colors">{item.step}</div>
              <div className="relative z-10">
                <item.icon className="mx-auto text-red-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-3xl font-black mb-4 italic leading-none">{item.title}</h3>
                <p className="text-gray-500 font-bold uppercase text-sm tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
            <p className="text-2xl font-black mb-12 italic text-gray-500">THAT'S IT. NO BARRIERS. NO APPLICATIONS. NO PERMISSION.</p>
            <Button variant="primary" href={BUY_LINK}>JOIN THE FIGHT NOW</Button>
        </div>
      </Section>

      {/* --- COMMUNITY WALL --- */}
      <Section className="bg-black text-center">
        <h2 className="text-6xl md:text-8xl font-black mb-8 italic leading-none text-red-600">COMMUNITY WALL</h2>
        <p className="text-xl text-gray-400 font-bold uppercase tracking-widest mb-16">Post debt confessions, ramen survival stories, and wins.</p>
        
        <div className="max-w-4xl mx-auto mb-32">
          {/* INPUT FORM - HIGH VISIBILITY WHITE BOX */}
          <form onSubmit={handleStorySubmit} className="mb-16 flex shadow-[0_0_50px_rgba(220,38,38,0.3)] border-4 border-red-600 overflow-hidden">
              <input 
                  type="text" 
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  placeholder="TYPE YOUR DEBT STORY HERE..."
                  className="flex-1 p-8 bg-white text-black text-2xl focus:outline-none font-black placeholder:text-gray-400 uppercase italic"
              />
              <button type="submit" disabled={postingStory} className="bg-red-600 hover:bg-red-700 text-white font-black px-12 uppercase italic transition-colors text-2xl border-l-4 border-red-600">
                  {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "POST"}
              </button>
          </form>

          <div className="grid gap-6">
            <div className="bg-[#0a0a0a] border-2 border-gray-800 p-10 text-left hover:border-red-600 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                 <Shield className="text-red-600" size={40} />
              </div>
              <p className="text-2xl font-black italic uppercase tracking-tight leading-tight mb-4">"Finally paid off my first loan. Felt like breaking actual chains."</p>
              <p className="text-sm text-red-600 font-black tracking-[0.3em]">CHAIN BROKEN: 2 DAYS AGO</p>
            </div>
          </div>
        </div>

        {/* --- MEME GALLERY --- */}
        <div className="max-w-7xl mx-auto border-t-4 border-gray-900 pt-24">
            <h3 className="text-5xl font-black mb-16 italic tracking-widest text-white uppercase">MEME <span className="text-red-600">GALLERY</span></h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-[#0a0a0a] border-4 border-gray-800 flex flex-col items-center justify-center p-8 group hover:border-red-600 transition-all cursor-pointer relative overflow-hidden">
                        <ImageIcon className="text-gray-800 group-hover:text-red-600 mb-4 transition-colors" size={64} />
                        <span className="text-gray-700 font-black uppercase text-sm text-center group-hover:text-white italic">MEME {i}<br/>YOUR REBELLION HERE</span>
                        <div className="absolute top-4 right-4 bg-red-600 p-1">
                            <Plus size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* --- FOOTER --- */}
      <footer className="bg-black border-t-4 border-red-600 py-24 px-6 text-center">
        <FadeIn>
            <h2 className="text-6xl md:text-9xl font-black mb-12 leading-tight italic uppercase tracking-tighter">ALREADY IN DEBT.<br/><span className="text-red-600 underline decoration-white">MIGHT AS WELL BE FREE.</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button variant="primary" href={BUY_LINK}>BUY ON BAGS</Button>
                <Button variant="secondary" href={X_LINK}>FOLLOW ON X</Button>
            </div>
            <div className="max-w-4xl mx-auto bg-red-600/10 border-2 border-red-600 p-8 text-sm font-bold tracking-widest text-gray-400">
                $DEBT IS A MEME COIN CREATED FOR CULTURAL REBELLION. THERE IS NO FINANCIAL ROADMAP, ONLY SHARED PAIN AND SHARED HUMOR. INVEST ONLY WHAT YOU CAN AFFORD TO LOSE WHILE YOU EAT YOUR RAMEN.
            </div>
        </FadeIn>
      </footer>
    </div>
  );
}
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
// 🚨 CONFIGURATION
// ==========================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekzxephakvminafxzdcq.supabase.co"; 
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_r8W6GNtrqFi6wl5Z8rfvAQ_4MNZ8icc";
const X_LINK = "https://x.com/i/communities/2012249877766439018"; // 👈 PASTE YOUR X LINK HERE
const BUY_LINK = "https://bags.fm/token/your_contract_address"; // 👈 PASTE YOUR BAGS LINK HERE
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
  const baseStyles = "px-8 py-4 font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 cursor-pointer";
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="text-center relative z-10 max-w-6xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-8 border border-red-500 px-4 py-2 text-sm tracking-widest uppercase">
              <Shield size={16} /> The Student Debt Rebellion
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter">
              OUT OF DEBT.<br/><span className="text-red-600">TOGETHER.</span>
            </h1>
            
            <p className="text-3xl font-bold italic mb-8">Already broke. Might as well be free.</p>
            
            {/* HERO LOGO */}
            <FadeIn delay={0.4}>
              <div className="w-48 h-48 mx-auto mb-8 relative group">
                 <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <img src="/logo.png" alt="$DEBT Logo" className="w-full h-full object-contain relative z-10" />
              </div>
            </FadeIn>

            {/* CA BOX */}
            <div className="mb-8 inline-flex items-center gap-3 bg-[#0a0a0a] border border-gray-800 px-6 py-3 hover:border-red-600 transition-colors cursor-pointer" onClick={copyToClipboard}>
              <span className="text-xs text-gray-500 uppercase tracking-widest">CA:</span>
              <code className="text-sm text-red-500 font-mono">{CONTRACT_ADDRESS.slice(0,6)}...{CONTRACT_ADDRESS.slice(-6)}</code>
              <button className="p-2">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
              </button>
            </div>

            {/* HERO BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href={X_LINK}>
                Follow on X
              </Button>
              <Button variant="secondary" href={BUY_LINK}>
                Buy on Bags
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- REALITY SECTION --- */}
      <Section className="bg-[#111] text-[#F5F5F0]">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white text-left uppercase">The System <br/> Is Rigged.</h2>
            <p className="text-gray-400 text-lg text-left">Click any report to verify the data.</p>
          </div>
          
          <div className="lg:w-2/3 grid gap-6">
            {[
              { title: "$1.65 Trillion in Outstanding Debt", source: "Federal Reserve", url: "https://www.federalreserve.gov/releases/g19/current/default.htm" },
              { title: "Debt is Physically Making Us Sick", source: "UGA Study", url: "https://news.uga.edu/student-loan-debt-mental-health/" },
              { title: "The 'American Dream' is Delayed", source: "WGU Labs", url: "https://www.wgu.edu/labs/reports/student-debt-survey.html" },
              { title: "Default Rates Are Underreported", source: "Brookings", url: "https://www.brookings.edu/articles/the-looming-student-loan-default-crisis-is-worse-than-we-thought/" }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={stat.url} target="_blank" rel="noopener noreferrer" className="block bg-[#1a1a1a] p-8 border-l-4 border-red-600 hover:bg-[#252525] transition-all text-left">
                  <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 mb-2"><FileText size={12} /> {stat.source}</span>
                  <h3 className="text-2xl font-bold text-white">{stat.title}</h3>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* --- MEET $DEBT (Clickable to Chart) --- */}
      <Section className="bg-black text-center">
        <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase">Meet <span className="text-red-600">$DEBT</span></h2>
            <a href={BUY_LINK} target="_blank" className="block w-48 h-48 mx-auto rounded-full border-4 border-red-600 mb-12 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform">
               <img src="/logo.png" alt="$DEBT Coin" className="w-full h-full object-cover" />
            </a>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto">Not a project. Not a startup. Not a roadmap. Just a shared joke, shared pain, and shared movement.</p>
        </FadeIn>
      </Section>

      {/* --- FINAL FOOTER CTA --- */}
      <Section className="bg-black text-center py-32 border-t border-gray-900">
        <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase">Already in debt.<br/><span className="text-red-600">Might as well be free.</span></h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
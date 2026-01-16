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
// 🚨 PASTE YOUR SUPABASE KEYS HERE 🚨
// ==========================================
const SUPABASE_URL = "https://ekzxephakvminafxzdcq.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_r8W6GNtrqFi6wl5Z8rfvAQ_4MNZ8icc";
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
    <a href={href || "#"} className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </a>
  );
};

export default function DebtLandingPage() {
  const [copied, setCopied] = useState(false);
  
  // 🚨 YOUR CONTRACT ADDRESS
  const contractAddress = "88888888888888888888888888888888"; 

  // --- DATABASE STATE ---
  const [stories, setStories] = useState<any[]>([]);
  const [storyInput, setStoryInput] = useState('');
  const [postingStory, setPostingStory] = useState(false);

  const [memes, setMemes] = useState<any[]>([]);
  const [memeFile, setMemeFile] = useState<File | null>(null);
  const [memeCaption, setMemeCaption] = useState("");
  const [uploadingMeme, setUploadingMeme] = useState(false);

  // --- LOAD DATA ON PAGE START ---
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

  // --- HANDLERS ---
  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyInput.trim()) return;

    setPostingStory(true);
    const { error } = await supabase.from('stories').insert([{ content: storyInput }]);
    
    if (!error) {
        setStoryInput('');
        fetchStories(); 
    } else {
        alert("Error posting story.");
    }
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

        const { error: dbError } = await supabase.from('memes').insert([{ 
            image_url: urlData.publicUrl, 
            caption: memeCaption || "DEBT REBELLION" 
        }]);
        if (dbError) throw dbError;

        setMemeFile(null);
        setMemeCaption("");
        fetchMemes();
        alert("Meme Uploaded!");
    } catch (error) {
        console.error(error);
        alert("Upload failed. Check console.");
    } finally {
        setUploadingMeme(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            
            {/* --- MASCOT REMOVED FROM HERE --- */}

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter">
              OUT OF DEBT.<br/><span className="text-red-600">TOGETHER.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              $DEBT is the student debt rebellion. A meme coin born from a generation that refuses to carry silent financial pressure anymore.
            </p>
            
            <p className="text-3xl font-bold italic mb-8">Already broke. Might as well be free.</p>
            
            {/* LOGO (KEPT) */}
            <FadeIn delay={0.4}>
              <div className="w-40 h-40 mx-auto mb-8 relative group">
                 <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <img
                   src="/logo.png"
                   alt="$DEBT Logo"
                   className="w-full h-full object-contain relative z-10"
                 />
              </div>
            </FadeIn>

            {/* CA BOX */}
            <div className="mb-8 inline-flex items-center gap-3 bg-[#0a0a0a] border border-gray-800 px-6 py-3 hover:border-red-600 transition-colors cursor-pointer" onClick={copyToClipboard}>
              <span className="text-xs text-gray-500 uppercase tracking-widest">CA:</span>
              <code className="text-sm text-red-500 font-mono">{contractAddress.slice(0,6)}...{contractAddress.slice(-6)}</code>
              <button className="p-2 hover:bg-red-600/20 transition-colors rounded">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href="#">Join the Rebellion <ArrowRight size={20} /></Button>
              <Button variant="secondary" href="#">Buy on Bags</Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- PROBLEM SECTION --- */}
      <Section className="bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              Student debt is the <span className="text-red-600">chain</span> around our generation
            </h2>
            <div className="space-y-6 text-xl text-gray-300 leading-relaxed">
              <p>Tuition keeps rising. Living costs keep rising. Paychecks stay the same.</p>
              <p>Millions of students graduate into decades of repayments — alone, overwhelmed, and quiet about it.</p>
              <p className="text-2xl font-bold text-white pt-6">But debt isn't a personal failure. It's a system problem.</p>
              <p className="text-2xl font-bold text-red-600">And system problems get solved together.</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* --- REALITY SECTION (STATS) --- */}
      <Section className="bg-[#111] text-[#F5F5F0] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
          
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-4 border border-red-500 px-3 py-1 text-xs tracking-widest uppercase">
              <ShieldCheck size={14} /> Verified Data
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white">
              THE SYSTEM <br/> IS RIGGED. <br/> <span className="text-red-600">HERE IS THE PROOF.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              We didn't start this fire. We are just trying to survive it. These aren't memes—these are the financial reports they hope you won't read.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800">
               <p className="text-xs text-gray-600 uppercase tracking-wide">Last Verified</p>
               <p className="text-sm text-gray-400 mt-1">January 2025</p>
            </div>
          </div>
          
          <div className="lg:w-2/3 grid gap-6">
            {[
              { title: "$1.65 Trillion in Outstanding Debt", source: "Federal Reserve Report", text: "Outstanding student loan debt reached $1.65 trillion...", tag: "Q4 2024 Data" },
              { title: "Debt is Physically Making Us Sick", source: "University of Georgia Study", text: "High levels of mental health issues were directly associated with student loan debt.", tag: "Peer-Reviewed Research" },
              { title: "The 'American Dream' is Delayed", source: "WGU Labs Report", text: "55% of respondents reported a delay in saving for retirement.", tag: "National Survey Data" },
              { title: "Default Rates Are Underreported", source: "Brookings Institution", text: "Nearly 40% of borrowers may default on their student loans.", tag: "Economic Analysis" }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="block bg-[#1a1a1a] p-8 border-l-4 border-red-600 hover:bg-[#252525] transition-colors">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-2"><FileText size={12} /> {stat.source}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{stat.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{stat.text}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600"><div className="w-2 h-2 bg-red-600 rounded-full"></div> {stat.tag}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* --- MEET $DEBT SECTION --- */}
      <Section className="bg-black relative">
        <div className="max-w-5xl mx-auto text-center">
            <FadeIn>
                <h2 className="text-5xl md:text-7xl font-black mb-12">Meet <span className="text-red-600">$DEBT</span></h2>
                
                {/* COIN IMAGE (KEPT) */}
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-red-600 mb-12 overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                   <img 
                     src="/logo.png" 
                     alt="$DEBT Coin Logo" 
                     className="w-full h-full object-cover"
                   />
                </div>

                <p className="text-2xl text-gray-300 mb-8">$DEBT is not a project. Not a startup. Not a roadmap.</p>
                <p className="text-3xl font-bold text-white mb-16">It's a shared joke, shared pain, and shared movement.</p>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                    {[
                        { icon: Users, title: "Share stories", desc: "Your journey matters. Your struggle is valid." },
                        { icon: TrendingUp, title: "Share strategies", desc: "Learn what's working for others like you." },
                        { icon: Zap, title: "Share opportunities", desc: "Side hustles, tips, and wins we find together." },
                        { icon: MessageCircle, title: "Share wins", desc: "Every payment celebrated. Every milestone honored." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-8 hover:border-red-600 transition-colors group">
                           <item.icon className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
                           <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                           <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </div>
      </Section>

      {/* --- WHY MEME COIN --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/10 to-black">
         <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
                <h2 className="text-5xl font-black mb-12">Why a <span className="text-red-600">Meme Coin?</span></h2>
                <div className="space-y-4 text-xl text-gray-300">
                    <p>Because <span className="text-white font-bold">humor spreads faster than lectures.</span></p>
                    <p>Because <span className="text-white font-bold">community beats isolation.</span></p>
                    <p>Because sometimes the best way to fight pressure is to laugh at it.</p>
                </div>
                <div className="mt-16 p-12 bg-[#0a0a0a] border-2 border-red-600">
                    <p className="text-3xl font-black">$DEBT is <span className="text-red-600">culture</span>. $DEBT is <span className="text-red-600">identity</span>. $DEBT is the <span className="text-red-600">rebellion</span>.</p>
                </div>
            </FadeIn>
         </div>
      </Section>

      {/* --- HOW TO JOIN --- */}
      <Section className="bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
             <h2 className="text-5xl font-black mb-16 text-center">How to <span className="text-red-600">Join</span></h2>
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
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    </FadeIn>
                ))}
             </div>
             <div className="mt-16 text-center">
                 <p className="text-2xl font-bold mb-8">That's it. <span className="text-red-600">No barriers. No permission.</span></p>
                 <Button variant="primary" href="#">Join Now <ArrowRight size={20}/></Button>
             </div>
        </div>
      </Section>

      {/* --- COMMUNITY WALL & BACKEND --- */}
      <Section className="bg-black border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-center">
              Community <span className="text-red-600">Wall</span>
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Post your debt confessions, ramen survival stories, and memes.
            </p>
          </FadeIn>

          {/* 1. MEME UPLOADER */}
          <FadeIn delay={0.2}>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 md:p-8 mb-16 relative group hover:border-red-600 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">UPLOAD A MEME</h3>
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={(e: any) => setMemeFile(e.target.files[0])} className="hidden" id="meme-upload" />
                     <label htmlFor="meme-upload" className="flex items-center justify-center gap-3 w-full bg-[#111] border-2 border-dashed border-gray-700 p-4 cursor-pointer hover:border-red-600 hover:text-white text-gray-400 transition-all">
                        <ImageIcon size={20}/> {memeFile ? memeFile.name : "Select Image"}
                     </label>
                   </div>
                </div>
                <div className="flex-[2] w-full">
                  <input type="text" placeholder="CAPTION..." value={memeCaption} onChange={(e) => setMemeCaption(e.target.value)} className="w-full bg-[#111] border border-gray-700 p-4 text-white focus:border-red-600 focus:outline-none uppercase font-bold" />
                </div>
                <button onClick={handleMemeUpload} disabled={uploadingMeme} className="w-full md:w-auto bg-red-600 text-white px-8 py-4 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 min-w-[140px]">
                  {uploadingMeme ? <Loader2 className="animate-spin mx-auto" /> : "Upload"}
                </button>
              </div>
            </div>
          </FadeIn>

          {/* 2. MEME GALLERY DISPLAY */}
          <FadeIn delay={0.3}>
             <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
               <span className="w-2 h-8 bg-red-600 block"></span> MEME GALLERY
            </h3>
            {memes.length === 0 ? (
                <div className="text-gray-600 mb-12 py-10 border border-dashed border-gray-800 text-center">No memes yet. Upload the first one to start the rebellion.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
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
          </FadeIn>

          {/* 3. STORY WALL (TEXT) */}
          <FadeIn delay={0.4}>
            <div className="max-w-3xl mx-auto border-t border-gray-900 pt-12">
                <h3 className="text-2xl font-bold mb-8 text-center text-white">
                   <span className="text-red-600">CONFESSIONS</span> & STORIES
                </h3>

                {/* Story Input */}
                <form onSubmit={handleStorySubmit} className="mb-12 flex shadow-2xl">
                    <input 
                        type="text" 
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                        placeholder="Share your story..."
                        className="flex-1 p-6 text-black text-lg focus:outline-none"
                    />
                    <button type="submit" disabled={postingStory} className="bg-red-700 hover:bg-red-600 text-white font-bold px-8 uppercase transition-colors min-w-[120px]">
                        {postingStory ? <Loader2 className="animate-spin mx-auto" /> : "Post"}
                    </button>
                </form>

                {/* Stories List */}
                <div className="space-y-4">
                    {stories.length === 0 ? (
                        <div className="text-center text-gray-600 py-10">No stories yet. Start the chain.</div>
                    ) : (
                        stories.map((s: any) => (
                            <div key={s.id} className="bg-transparent border border-gray-800 p-8 hover:border-gray-600 transition-colors text-left">
                                <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed">
                                    "{s.content}"
                                </p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                    {formatDate(s.created_at)}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-wide">
                        If one of us wins — we all win.
                    </p>
                </div>
            </div>
          </FadeIn>

        </div>
      </Section>

      {/* --- MISSION --- */}
      <Section className="bg-gradient-to-b from-black via-red-950/20 to-black">
          <div className="max-w-4xl mx-auto text-center">
              <FadeIn>
                  <h2 className="text-5xl md:text-6xl font-black mb-12">The <span className="text-red-600">Mission</span></h2>
                  <div className="space-y-8 text-2xl leading-relaxed mb-16">
                      <p className="font-bold text-white">We believe: No student should feel alone in debt.</p>
                      <p className="font-bold text-white">No generation should carry shame for a broken system.</p>
                      <p className="text-gray-300 mt-12">So we built a place to stand together.</p>
                      <p className="text-3xl font-bold text-red-600">And meme through it.</p>
                  </div>
              </FadeIn>
          </div>
      </Section>

      {/* --- FINAL FOOTER CTA --- */}
      <Section className="bg-black text-center py-32">
        <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">Already in debt.<br/><span className="text-red-600">Might as well be free.</span></h2>
            <p className="text-3xl font-bold mb-12 text-gray-300">Join the $DEBT rebellion today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button variant="primary">Buy on Bags</Button>
                <Button variant="secondary">Join Telegram</Button>
                <Button variant="secondary">Follow on X</Button>
            </div>
        </FadeIn>
      </Section>

      <footer className="bg-[#0a0a0a] border-t border-gray-900 py-12 px-6 text-center">
        <p className="text-sm text-gray-600">$DEBT is a meme coin. No promises. Just vibes.</p>
      </footer>
    </div>
  );
}
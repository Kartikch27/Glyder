import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Zap, 
  Leaf, 
  ArrowUpRight, 
  Layers, 
  Users 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                  <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                  Our Story
               </div>
               <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                 Redefining <br />
                 Urban <span className="text-primary">Motion</span>
               </h1>
               <p className="max-w-xl text-muted-foreground font-medium text-lg leading-relaxed">
                 GLYDER was founded with a singular vision: to create the world's most premium, reliable, and sustainable personal electric vehicles.
               </p>
            </div>
            <div className="relative aspect-square rounded-[64px] overflow-hidden group border border-border/50 animate-in fade-in zoom-in-95 duration-1000 delay-300">
               <img 
                 src="/images/about-hero.png" 
                 alt="GLYDER Studio" 
                 className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="absolute bottom-10 left-10 text-white space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Established 2024</p>
                  <p className="text-2xl font-black uppercase tracking-tighter">GLYDER Design Lab, London</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
              <div className="max-w-2xl space-y-6">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                   Engineered for the <br />
                   <span className="text-primary">Discerning Rider</span>
                </h2>
                <p className="text-muted-foreground font-medium">
                   We don't just build scooters. We craft precision instruments of movement that bridge the gap between engineering excellence and contemporary lifestyle.
                </p>
              </div>
              <div className="flex items-center gap-6 pb-2">
                 <div className="text-right">
                    <p className="text-4xl font-black uppercase tracking-tighter">98.4%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efficiency Rating</p>
                 </div>
                 <div className="h-12 w-px bg-border/50" />
                 <div className="text-right">
                    <p className="text-4xl font-black uppercase tracking-tighter">15k+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Riders</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard 
                icon={Zap} 
                title="Performance" 
                text="Proprietary motor technology that delivers instantaneous power without compromising range." 
              />
              <ValueCard 
                icon={ShieldCheck} 
                title="Reliability" 
                text="Aero-grade aluminum and rigorous testing ensure your GLYDER is built for the long haul." 
              />
              <ValueCard 
                icon={Leaf} 
                title="Sustainability" 
                text="Completely carbon-neutral manufacturing and 100% recyclable components." 
              />
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-muted/30 border-y border-border/50 px-4 group overflow-hidden">
         <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="order-2 lg:order-1 relative h-[600px] rounded-[48px] overflow-hidden border border-border/50">
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute inset-0 flex items-center justify-center p-20">
                     <div className="relative w-full h-full border border-primary/20 rounded-[32px] overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.02] tracking-tighter select-none">GLYDER</div>
                         <div className="absolute top-10 left-10 p-6 bg-background rounded-2xl shadow-xl shadow-black/5 border border-border/50 max-w-[200px] space-y-4">
                            <Layers className="h-8 w-8 text-primary" />
                            <p className="font-bold text-xs uppercase tracking-widest">Multi-layered Safety Systems</p>
                         </div>
                         <div className="absolute bottom-10 right-10 p-6 bg-background rounded-2xl shadow-xl shadow-black/5 border border-border/50 max-w-[200px] space-y-4">
                            <Users className="h-8 w-8 text-primary" />
                            <p className="font-bold text-xs uppercase tracking-widest">Community Driven Design</p>
                         </div>
                     </div>
                  </div>
               </div>
               <div className="order-1 lg:order-2 space-y-8 lg:p-12">
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                     Design <br />
                     <span className="text-primary">Philosophy</span>
                  </h2>
                  <div className="space-y-6">
                     <p className="text-muted-foreground font-medium leading-relaxed">
                        We believe that minimalism is the ultimate form of sophistication. Every curve and every bolt in a GLYDER is there for a reason. No excess, only essentials.
                     </p>
                     <ul className="space-y-4 pt-4">
                        <ListItem text="Intelligent weight distribution" />
                        <ListItem text="Invisible cable management" />
                        <ListItem text="Integrated smart diagnostics" />
                        <ListItem text="Adaptive lighting systems" />
                     </ul>
                  </div>
                  <div className="pt-8">
                     <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[12px] gap-3">
                        Join the Movement <ArrowUpRight className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 px-4">
         <div className="container mx-auto max-w-4xl text-center space-y-8">
            <AnimatedBadge text="Join Us" />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
               Interested in <br />
               <span className="text-primary">Partnering with Us?</span>
            </h2>
            <p className="text-muted-foreground font-medium italic">
               Whether you're a dealer, a fleet manager, or a passionate rider, we'd love to hear from you.
            </p>
            <Button variant="outline" className="h-14 px-12 rounded-2xl border-border hover:bg-muted text-[10px] font-black uppercase tracking-widest">
               Contact Inquiries
            </Button>
         </div>
      </section>
    </div>
  );
}

function ValueCard({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="p-10 rounded-[40px] bg-muted/30 border border-border/50 space-y-6 group hover:bg-muted/50 transition-all duration-500">
       <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center text-primary shadow-xl shadow-black/5 group-hover:scale-110 transition-transform duration-500">
          <Icon className="h-7 w-7" />
       </div>
       <div className="space-y-3">
          <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">{text}</p>
       </div>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 group">
       <div className="h-1.5 w-1.5 rounded-full bg-primary" />
       <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
    </li>
  );
}

function AnimatedBadge({ text }: { text: string }) {
   return (
     <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
       <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
       {text}
     </span>
   );
 }

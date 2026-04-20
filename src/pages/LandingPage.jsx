import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, ArrowRight, UserPlus, FileEdit, Truck, Activity, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { loginAsDemo } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000', color: '#ffffff', overflowX: 'hidden', fontFamily: '"Space Grotesk", sans-serif' }}>
      
      {/* Navbar Minimal */}
      <nav style={{ padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', position: 'absolute', top: 0, width: '100%', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#000000', border: '1px solid #333333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#FF5CCD" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>CrisisConnect</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#a3a3a3', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#a3a3a3'}>
            Sign In
          </Link>
          <Link to="/signup" style={{ background: '#ffffff', color: '#000000', padding: '10px 20px', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 5% 0' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', border: '1px solid #333333', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, color: '#FF5CCD', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', background: '#FF5CCD', borderRadius: '50%' }} /> Crisis Resolution Evolved
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Coordinate Relief.<br />
            <span style={{ color: '#737373' }}>Save Lives.</span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#a3a3a3', marginBottom: '48px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 400 }}>
            Empower your civic teams with a unified platform to manage operations, track critical assets, and deploy field volunteers instantly.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={loginAsDemo} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', color: '#000000', padding: '16px 36px', fontSize: '1.05rem', fontWeight: 600, borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>
              Try Demo Mode <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Walkthrough Section */}
      <section style={{ padding: '120px 5%', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px', color: '#ffffff' }}>
              How it works
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>A seamless pipeline designed to turn chaos into structured, rapid response operations.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center', gap: '40px', background: '#000000', padding: '40px', borderRadius: '24px', border: '1px solid #222222' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid rgba(255, 77, 77, 0.3)', background: 'rgba(255, 77, 77, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileEdit size={28} color="#FF4D4D" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>1. Receive & Triage SOS Requests</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>Victims and agencies submit emergency requests. Coordinators see a live feed on the dashboard and prioritize them instantly based on severity.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center', gap: '40px', background: '#000000', padding: '40px', borderRadius: '24px', border: '1px solid #222222' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid rgba(255, 92, 205, 0.3)', background: 'rgba(255, 92, 205, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserPlus size={28} color="#FF5CCD" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>2. Dispatch Volunteers</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>Match required skills (medical, rescue, logistics) with your active roster. Assign tasks to available field nodes with a single click.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center', gap: '40px', background: '#000000', padding: '40px', borderRadius: '24px', border: '1px solid #222222' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid rgba(200, 230, 201, 0.3)', background: 'rgba(200, 230, 201, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={28} color="#C8E6C9" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>3. Allocate Logistics</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>Track inventory capacities across camps. Dispatch food, water, and medical kits to ensure responders have what they need.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Aesthetic Bento Grid - High Contrast Monochrome */}
      <section style={{ padding: '120px 5%', maxWidth: '1400px', margin: '0 auto', background: '#000000' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '60px', maxWidth: '800px', textAlign: 'center', margin: '0 auto 80px' }}>
          Unmatched visibility into <br/><span style={{ color: '#FF5CCD' }}>field operations.</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', autoRows: 'minmax(300px, auto)' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ gridColumn: 'span 8', background: '#000000', border: '1px solid #333333', borderRadius: '32px', padding: '48px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ zIndex: 1 }}>
              <Activity size={32} color="#FF4D4D" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '16px' }}>Live Command Center</h3>
              <p style={{ color: '#a3a3a3', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6 }}>Advanced dashboards provide real-time updates on active requests, response times, and total impact metrics.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ gridColumn: 'span 4', background: '#000000', border: '1px solid #333333', borderRadius: '32px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Zap size={32} color="#C8E6C9" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Zero Latency</h3>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.5 }}>Synchronized data distribution across all connected clients instantly.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer Block */}
      <section style={{ padding: '80px 5%', background: '#0a0a0a', display: 'flex', justifyContent: 'center', borderTop: '1px solid #1a1a1a' }}>
        <motion.div 
          style={{ y }} 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="cta-block"
          style={{
            background: '#FF6E00',
            borderRadius: '40px',
            padding: '80px 40px',
            width: '100%',
            maxWidth: '1000px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Zap size={32} color="#ffffff" style={{ marginBottom: '24px' }} />
          
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '24px', color: '#ffffff' }}>
            Build Faster
          </h2>
          
          <p style={{ fontSize: '1.15rem', color: '#ffffff', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Seamlessly organize systems starting with just a few clicks. Empower your civic teams today.
          </p>
          
          <button onClick={loginAsDemo} style={{ background: '#ffffff', color: '#FF6E00', padding: '16px 36px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>
            Try CrisisConnect for Free
          </button>
        </motion.div>
      </section>

      <footer style={{ padding: '40px 5%', background: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#737373', fontSize: '0.95rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} /> CrisisConnect OS © 2026
        </div>
      </footer>
    </div>
  );
}

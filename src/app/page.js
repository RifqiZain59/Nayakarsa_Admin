'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Memberikan sedikit jeda untuk transisi loading yang lebih halus
    const timer = setTimeout(() => {
      const auth = localStorage.getItem('nyk_auth');
      if (auth) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      background:'linear-gradient(135deg, #0f172a, #1e1b4b)',
      color: '#fff'
    }}>
      <div style={{
        width:'50px', 
        height:'50px', 
        borderRadius:'12px', 
        background:'linear-gradient(135deg, #4f46e5, #7c3aed)',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontSize:'24px',
        fontWeight:'800',
        marginBottom:'20px',
        boxShadow:'0 0 20px rgba(79, 70, 229, 0.4)'
      }}>N</div>
      
      <div style={{fontSize:'13px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:'700'}}>
        Nayakarsa Admin
      </div>
      
      <div style={{marginTop:'30px', display:'flex', gap:'5px'}}>
        <div className="dot-bounce" style={{width:'6px', height:'6px', background:'#4f46e5', borderRadius:'50%'}}></div>
        <div className="dot-bounce" style={{width:'6px', height:'6px', background:'#4f46e5', borderRadius:'50%', animationDelay:'0.1s'}}></div>
        <div className="dot-bounce" style={{width:'6px', height:'6px', background:'#4f46e5', borderRadius:'50%', animationDelay:'0.2s'}}></div>
      </div>
      
      {/* Perbaikan: Menghapus atribut 'jsx' agar aman di Next.js App Router */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        .dot-bounce {
          animation: bounce 0.6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
import BottomNav from "../components/BottomNav"
import { Link } from "react-router-dom"
import { useState } from "react"

function CycleTracking() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 antialiased">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 w-full flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="text-primary hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <Link to="/dashboard" className="font-headline-md text-headline-md text-primary italic">MenoVerse AI</Link>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBvlXvP76QjI7DP6hAIj5B6LWPZyJcAOPY52ul_Z4XAgFLft4Ga_M3TZFFiv9TBrnKogbYGQy9BhsK66CiIB_jCJGjGt6b5onzn7Hz9vfKguQLhT6gjhUVlgUFQ0pxrzrzs3V4ZJg3nik8k4oGMrzjPzDZ_p97WeelOWxwBGyxuShgmdwDfNBONO35x6qLyo8XKDM-2rKxHPpqHVkpAcKVpXbtwtUzQIo9Q57JM0mgXe8X2C3xwXIHtQ57JM0mgXe8X2C3xwXIHtQ" alt="profile" />
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}>
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline-md text-primary italic">MenoVerse AI</h2>
              <button onClick={() => setMenuOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary"><span className="material-symbols-outlined">home</span>Dashboard</Link>
              <Link to="/cycle" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 text-primary"><span className="material-symbols-outlined">calendar_month</span>Cycle Tracking</Link>
              <Link to="/symptoms" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary"><span className="material-symbols-outlined">edit_note</span>Symptoms</Link>
              <Link to="/insights" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary"><span className="material-symbols-outlined">analytics</span>Insights</Link>
            </nav>
          </aside>
        </div>
      )}

      <main className="max-w-[1100px] mx-auto px-6 pt-10 space-y-12">
        <section className="space-y-2">
          <h2 className="font-headline-xl text-[40px] leading-[48px] font-bold text-plum-deep" style={{fontFamily:'Playfair Display'}}>Cycle History</h2>
          <p className="text-on-surface-variant font-medium">Understanding your body's rhythm during perimenopause.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 bg-surface/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-[0_10px_30px_-10px_rgba(107,112,92,0.1)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[24px] font-semibold text-primary italic" style={{fontFamily:'Playfair Display'}}>October 2023</h3>
              <div className="flex gap-4">
                <button className="p-2 hover:bg-lavender-mist rounded-full"><span className="material-symbols-outlined text-primary">chevron_left</span></button>
                <button className="p-2 hover:bg-lavender-mist rounded-full"><span className="material-symbols-outlined text-primary">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
             {['M','T','W','T','F','S','S'].map((d, i) => <div key={`${d}-${i}`} className="text-center text-sm font-semibold text-outline py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">25</div>
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">26</div>
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">27</div>
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">28</div>
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">29</div>
              <div className="h-12 flex items-center justify-center text-outline-variant opacity-30">30</div>
              <div className="h-12 flex items-center justify-center">1</div>
              <div className="h-12 flex items-center justify-center rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 text-risk-high font-bold">2</div>
              <div className="h-12 flex items-center justify-center rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 text-risk-high font-bold">3</div>
              <div className="h-12 flex items-center justify-center rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 text-risk-high font-bold">4</div>
              <div className="h-12 flex items-center justify-center rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 text-risk-high font-bold">5</div>
              <div className="h-12 flex items-center justify-center">6</div>
              <div className="h-12 flex items-center justify-center">7</div>
              <div className="h-12 flex items-center justify-center">8</div>
              <div className="h-12 flex items-center justify-center">9</div>
              <div className="h-12 flex items-center justify-center">10</div>
              <div className="h-12 flex items-center justify-center">11</div>
              <div className="h-12 flex items-center justify-center">12</div>
              <div className="h-12 flex items-center justify-center">13</div>
              <div className="h-12 flex items-center justify-center bg-primary text-white rounded-2xl shadow-md">14</div>
              <div className="h-12 flex items-center justify-center rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold">15</div>
              <div className="h-12 flex items-center justify-center rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold">16</div>
              <div className="h-12 flex items-center justify-center rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold">17</div>
              <div className="h-12 flex items-center justify-center rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold">18</div>
              <div className="h-12 flex items-center justify-center rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold">19</div>
              <div className="h-12 flex items-center justify-center">20</div>
              <div className="h-12 flex items-center justify-center">21</div>
              <div className="h-12 flex items-center justify-center">22</div>
              <div className="h-12 flex items-center justify-center">23</div>
              <div className="h-12 flex items-center justify-center">24</div>
              <div className="h-12 flex items-center justify-center">25</div>
              <div className="h-12 flex items-center justify-center">26</div>
              <div className="h-12 flex items-center justify-center">27</div>
              <div className="h-12 flex items-center justify-center">28</div>
              <div className="h-12 flex items-center justify-center">29</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs font-medium">
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 inline-block"></span><span className="text-on-surface-variant font-bold">Menstruation</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 inline-block"></span><span className="text-on-surface-variant font-bold">Ovulation Window</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-primary rounded-lg inline-block"></span><span className="text-on-surface-variant font-bold">Today</span></div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-5">
            <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden shadow-lg">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h4 className="text-xs text-lavender-mist mb-4 uppercase tracking-[0.1em] font-bold">Current Status</h4>
              <p className="text-[40px] font-bold leading-none" style={{fontFamily:'Playfair Display'}}>Day 14</p>
              <p className="text-lavender-mist italic mt-1">Late follicular phase</p>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm text-lavender-mist">Predicted next period</span>
                <span className="text-sm font-bold">12 days</span>
              </div>
            </div>
            <div className="bg-surface rounded-2xl p-6 border-l-4 border-risk-low shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-risk-low/10 rounded-xl"><span className="material-symbols-outlined text-risk-low">insights</span></div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold">Cycle Insight</h4>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic">Your cycle is 2 days longer than last month. This variation is common in perimenopause.</p>
                </div>
              </div>
            </div>
            <Link to="/symptoms" className="bg-surface rounded-2xl p-6 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/20 shadow-sm flex items-center justify-between block">
              <div className="flex items-center gap-4"><span className="material-symbols-outlined text-tertiary">history_edu</span><span className="text-sm font-bold">View History Report</span></div>
              <span className="material-symbols-outlined text-outline">arrow_forward</span>
            </Link>
          </div>
        </div>

        <section className="space-y-8">
          <h3 className="text-[24px] font-semibold text-plum-deep italic" style={{fontFamily:'Playfair Display'}}>Previous Cycles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {month:'Sept 2023', days:'28 Days', desc:'Regular cycle. Normal symptoms reported.', p1:'15%', p2:'35%', p3:'15%'},
              {month:'Aug 2023', days:'34 Days', desc:'Delayed by 6 days. Higher stress markers noted.', p1:'20%', p2:'40%', p3:'10%'},
              {month:'July 2023', days:'27 Days', desc:'Standard length. Quality sleep recorded.', p1:'18%', p2:'37%', p3:'15%'},
            ].map(item => (
              <div key={item.month} className="bg-surface rounded-2xl p-6 border-t-4 border-primary/20 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-outline font-bold">{item.month}</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{item.days}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                  <div className="h-full bg-risk-high" style={{width: item.p1}}></div>
                  <div className="h-full bg-surface-container-high" style={{width: item.p2}}></div>
                  <div className="h-full bg-risk-low" style={{width: item.p3}}></div>
                  <div className="h-full bg-surface-container-high flex-1"></div>
                </div>
                <p className="mt-5 text-sm text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-plum-deep text-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl mb-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full -ml-20 -mb-20 blur-3xl"></div>
          </div>
          <div className="flex-1 space-y-6 relative z-10">
            <h3 className="text-[28px] md:text-[32px] font-semibold italic" style={{fontFamily:'Playfair Display'}}>Log your symptoms today</h3>
            <p className="text-lavender-mist/80 italic">Voice journaling or quick-tap logging helps MenoVerse AI build your unique hormonal profile.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/symptoms" className="bg-surface text-plum-deep px-8 py-4 rounded-xl text-sm font-semibold hover:bg-lavender-mist active:scale-95 transition-all flex items-center gap-3 shadow-md">
                <span className="material-symbols-outlined text-primary">mic</span>Voice Journal
              </Link>
              <Link to="/symptoms" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all">Quick Log</Link>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-video relative z-10 overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNZdd-NWvkwiCt9rd0_LjUtr251nNkw1w-Pa1CMnKzfWHGqvxcvdG0wx8Gp9CCRlXJjK_CuDfwFmK8jzLFnO8b1tuDg2mVK5jrxAJPS-pIvMOcZeCCn-tSpypbEL8rVYNtUmQRktCaL7MrIKkGjm6Tbx_wzj4tQA8I4M8f3XDVX-CtBy8zh1933fBJnZbl6OY-Eppg9G-gqEhPSgLdztdjvLSz6kRV75nZc8BoujKZrQ2jIFvvAyTncg" alt="zen" />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default CycleTracking
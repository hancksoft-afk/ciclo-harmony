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
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState<{
    code_id: string;
    qr_image_url: string;
    remaining_time: number;
  } | null>(null);
  const [qrError, setQrError] = useState<string>('');
  const [generatedCodes, setGeneratedCodes] = useState<{
    oculto: string;
    visible: string;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentStep === 2 && selectedPlatform) {
      const interval = setInterval(() => {
        setTimer1(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, selectedPlatform]);

  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setTimer2(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields({...copiedFields, [field]: true});
      setTimeout(() => {
        setCopiedFields(prev => ({...prev, [field]: false}));
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const fetchPlatformQrSettings = async (platform: string) => {
    setQrLoading(true);
    setQrError('');
    
    try {
      const { data, error } = await supabase
        .rpc('get_active_qr_setting', { qr_type: platform.toLowerCase() });

      if (error) {
        console.error('Error fetching QR settings:', error);
        setQrError('Error al cargar configuración QR');
        return;
      }

      if (data && data.length > 0) {
        setQrData(data[0]);
      } else {
        setQrError('No hay configuración QR activa para esta plataforma');
      }
    } catch (error) {
      console.error('Error:', error);
      setQrError('Error de conexión');
    } finally {
      setQrLoading(false);
    }
  };

  const saveToSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('register150')
        .insert([
          {
            name: formData.name,
            invitee: formData.invitee,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
            has_money: formData.hasMoney === 'yes',
            payment_method: formData.paymentMethod,
            binance_id: formData.paymentMethod === 'nequi' ? null : formData.binanceId,
            nequi_phone: formData.paymentMethod === 'binance_pay' ? null : formData.nequiPhone,
            oculto_code: generatedCodes?.oculto,
            visible_code: generatedCodes?.visible,
            platform: selectedPlatform
          }
        ])
        .select();

      if (error) {
        console.error('Error saving to Supabase:', error);
        alert('Error al guardar los datos. Por favor, intenta de nuevo.');
        return false;
      }

      console.log('Data saved successfully:', data);
      return true;
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
      return false;
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = true;
        isValid = false;
      }
      if (!formData.invitee.trim()) {
        newErrors.invitee = true;
        isValid = false;
      }
      if (!formData.country) {
        newErrors.country = true;
        isValid = false;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = true;
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = true;
        isValid = false;
      }
      if (!formData.hasMoney) {
        newErrors.hasMoney = true;
        isValid = false;
      }
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = true;
        isValid = false;
      }

      // Validate payment method specific fields
      if (formData.paymentMethod === 'binance_pay' && !formData.binanceId.trim()) {
        newErrors.binanceId = true;
        isValid = false;
      }
      if (formData.paymentMethod === 'nequi' && !formData.nequiPhone.trim()) {
        newErrors.nequiPhone = true;
        isValid = false;
      }
      if (formData.paymentMethod === 'binance_nequi') {
        if (!formData.binanceId.trim()) {
          newErrors.binanceId = true;
          isValid = false;
        }
        if (!formData.nequiPhone.trim()) {
          newErrors.nequiPhone = true;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        if (formData.paymentMethod === 'binance_nequi') {
          setShowPlatformModal(true);
        } else {
          setSelectedPlatform(formData.paymentMethod === 'binance_pay' ? 'Binance' : 'Nequi');
          fetchPlatformQrSettings(formData.paymentMethod === 'binance_pay' ? 'Binance' : 'Nequi');
          setCurrentStep(2);
        }
      } else if (currentStep === 2) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    const codes = {
      oculto: Math.random().toString(36).substr(2, 12).toUpperCase(),
      visible: Math.random().toString(36).substr(2, 8).toUpperCase()
    };
    setGeneratedCodes(codes);

    const saved = await saveToSupabase();
    if (saved) {
      setShowTicketModal(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const updatePaymentMethod = (method: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      paymentMethod: method,
      nequiPhone: (method === 'binance_pay') ? '' : prevFormData.nequiPhone,
      binanceId: (method === 'nequi') ? '' : prevFormData.binanceId
    }));
  };

  return (
    <div className="rounded-2xl ring-1 ring-white/10 p-6 md:p-8 bg-gradient-to-b from-slate-900/90 to-indigo-900/80 relative overflow-hidden">
      <div className="absolute inset-0 rounded-2xl">
        <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-[#000000] to-[#77001d] bg-[length:400%_400%] opacity-75" />
        <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-[#000000] to-[#77001d] bg-[length:400%_400%] opacity-50" />
      </div>

      <div className="relative z-10">
        {/* Steps Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-white text-black' : 'bg-white/20 text-white/60'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Registration Form */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Registro 150 USD</h2>
              <p className="text-white/70">Completa tu información para continuar</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombres */}
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombres
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.name ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="Ingresa tu nombre completo"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              {/* ¿A quién estás invitando? */}
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  ¿A quién estás invitando?
                </label>
                <input
                  type="text"
                  value={formData.invitee}
                  onChange={(e) => setFormData({...formData, invitee: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.invitee ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="Nombre de la persona"
                />
                {errors.invitee && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              {/* País */}
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  País
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                      errors.country ? 'border-red-500' : 'border-white/20'
                    } text-white text-left flex items-center justify-between focus:outline-none focus:border-white/40`}
                  >
                    <span className={formData.country ? 'text-white' : 'text-white/50'}>
                      {formData.country || 'Selecciona tu país'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg overflow-hidden z-10">
                      {countries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, country});
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.country && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              {/* Número de celular */}
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Número de celular (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.phone ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="Ej: +57 300 123 4567"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>
            </div>

            {/* ¿Tienes dinero? */}
            <div className="space-y-3">
              <label className="text-sm text-white">¿Tienes dinero?</label>
              <div className="flex gap-4">
                {['yes', 'no'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({...formData, hasMoney: option})}
                    className={`px-6 py-3 rounded-lg border transition-all ${
                      formData.hasMoney === option
                        ? 'bg-white text-black border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option === 'yes' ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
              {errors.hasMoney && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Este campo es obligatorio
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="text-sm text-white">Selecciona tu método de pago preferido</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'nequi', label: 'Nequi' },
                  { id: 'binance_pay', label: 'Binance Pay' },
                  { id: 'binance_nequi', label: 'Binance y Nequi' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => updatePaymentMethod(method.id)}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      formData.paymentMethod === method.id
                        ? 'bg-white text-black border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Fingerprint className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Este campo es obligatorio
                </p>
              )}
            </div>

            {/* Payment Fields */}
            {(formData.paymentMethod === 'binance_pay' || formData.paymentMethod === 'binance_nequi') && (
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  ID / Número de Binance pay
                </label>
                <input
                  type="text"
                  value={formData.binanceId}
                  onChange={(e) => setFormData({...formData, binanceId: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.binanceId ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="Ingresa tu ID de Binance"
                />
                {errors.binanceId && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>
            )}

            {(formData.paymentMethod === 'nequi' || formData.paymentMethod === 'binance_nequi') && (
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Número de teléfono Nequi
                </label>
                <input
                  type="tel"
                  value={formData.nequiPhone}
                  onChange={(e) => setFormData({...formData, nequiPhone: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.nequiPhone ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:border-white/40`}
                  placeholder="Ej: 300 123 4567"
                />
                {errors.nequiPhone && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Este campo es obligatorio
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Pago por QR - 150 USD ({selectedPlatform})
              </h2>
              <p className="text-white/70">Escanea el código QR para realizar el pago</p>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                <Timer className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-mono text-lg">{formatTime(timer1)}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white/10 rounded-xl p-8 text-center">
              {qrLoading ? (
                <div className="w-64 h-64 mx-auto bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white">Cargando QR...</span>
                </div>
              ) : qrError ? (
                <div className="w-64 h-64 mx-auto bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400">{qrError}</span>
                </div>
              ) : qrData ? (
                <img 
                  src={qrData.qr_image_url} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 mx-auto bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white">QR no disponible</span>
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">ID de orden:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{orderId1}</span>
                  <button
                    onClick={() => copyToClipboard(orderId1, 'order1')}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Copy className="w-4 h-4 text-white/70" />
                  </button>
                  {copiedFields.order1 && <span className="text-green-400 text-xs">✓</span>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Monto:</span>
                <span className="font-semibold text-white">150 USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Plataforma:</span>
                <span className="text-white">{selectedPlatform}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                Confirmar Pago
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Confirmar Transacción</h2>
              <p className="text-white/70">Verifica los detalles de tu pago</p>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                <Timer className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-mono text-lg">{formatTime(timer2)}</span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Detalles de la Transacción</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">ID de transacción:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-sm">{orderId2}</span>
                    <button
                      onClick={() => copyToClipboard(orderId2, 'order2')}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Copy className="w-4 h-4 text-white/70" />
                    </button>
                    {copiedFields.order2 && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Monto:</span>
                  <span className="font-semibold text-white">150 USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Plataforma:</span>
                  <span className="text-white">{selectedPlatform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Estado:</span>
                  <span className="text-yellow-400">Pendiente</span>
                </div>
              </div>

              {/* Payment Method Specific ID Input */}
              {selectedPlatform === 'Binance' && (
                <div className="mt-4">
                  <label className="text-sm text-white flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4" />
                    ID de Binance (Confirmar)
                  </label>
                  <input
                    type="text"
                    value={formData.binanceIdStep2}
                    onChange={(e) => setFormData({...formData, binanceIdStep2: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Confirma tu ID de Binance"
                  />
                </div>
              )}

              {selectedPlatform === 'Nequi' && (
                <div className="mt-4">
                  <label className="text-sm text-white flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Número de Nequi (Confirmar)
                  </label>
                  <input
                    type="text"
                    value={formData.binanceIdStep3}
                    onChange={(e) => setFormData({...formData, binanceIdStep3: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Confirma tu número de Nequi"
                  />
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium mb-1">Importante</h4>
                  <p className="text-yellow-200 text-sm">
                    Una vez confirmado, no podrás modificar los detalles de la transacción. 
                    Asegúrate de que toda la información sea correcta.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Selecciona plataforma de pago</h3>
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
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-left transition-colors"
              >
                <div className="font-medium">Binance Pay</div>
                <div className="text-sm text-white/70">Pagar con Binance Pay</div>
              </button>
              
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
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-left transition-colors"
              >
                <div className="font-medium">Nequi</div>
                <div className="text-sm text-white/70">Pagar con Nequi</div>
              </button>
            </div>
            
            <button
              onClick={() => setShowPlatformModal(false)}
              className="w-full mt-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TicketCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Registro Completado!</h3>
              <p className="text-white/70">Tu solicitud ha sido procesada exitosamente</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4 space-y-3 mb-6">
              <div className="text-center border-b border-white/10 pb-3 mb-3">
                <Ticket className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold">Ticket de Registro</h4>
              </div>
              
              <div className="space-y-2 text-sm">
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
                  <>
                    <div className="mb-2">
                      <p className="text-xs text-white font-inter">Método:</p>
                      <p className="font-medium text-slate-200">Binance Pay y Nequi</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs text-white font-inter">ID de Binance Pay:</p>
                      <p className="font-medium text-slate-200">{formData.binanceId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">ID de Nequi:</p>
                      <p className="font-medium text-slate-200">{formData.nequiPhone}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-white font-inter">
                      {formData.paymentMethod === 'nequi' ? 'Nequi:' : 'Binance Pay:'}
                    </p>
                    <p className="font-medium text-slate-200">
                      {formData.paymentMethod === 'nequi'
                      ? formData.nequiPhone 
                      : formData.binanceId}
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

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setCurrentStep(1);
                  setFormData({
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
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setCurrentStep(1);
                  setFormData({
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
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm150;

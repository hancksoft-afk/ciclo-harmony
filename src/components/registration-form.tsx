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

              <div className="text-center py-4">
                <p className="text-white font-inter">
                  El formulario de registro está siendo reorganizado para una mejor experiencia.
                </p>
                <p className="text-muted-foreground font-inter mt-2">
                  Por favor, vuelve pronto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
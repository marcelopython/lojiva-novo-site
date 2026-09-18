import { useState, type ChangeEvent, type FormEvent } from 'react';
import { SIGNUP_API_BASE, LOGIN_URL } from '@/data/plans';

type FormData = {
  name: string;
  email: string;
  phone: string;
  document: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const formatDocument = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateField = (name: keyof FormData, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Nome é obrigatório';
      if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
      return undefined;
    case 'phone': {
      const numbers = value.replace(/\D/g, '');
      if (!numbers) return 'WhatsApp é obrigatório';
      if (numbers.length < 10) return 'WhatsApp inválido';
      return undefined;
    }
    case 'document': {
      const numbers = value.replace(/\D/g, '');
      if (!numbers) return 'CPF/CNPJ é obrigatório';
      if (numbers.length !== 11 && numbers.length !== 14) return 'CPF/CNPJ inválido';
      return undefined;
    }
    case 'email':
      if (!value) return 'E-mail é obrigatório';
      if (!validateEmail(value)) return 'E-mail inválido';
      return undefined;
    case 'password':
      if (!value) return 'Senha é obrigatória';
      if (value.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
      return undefined;
  }
};

declare global {
  interface Window {
    lojivaTrack?: {
      ctaClick: (label: string) => void;
      signupStart: () => void;
      leadSubmit: () => void;
      whatsappClick: () => void;
    };
  }
}

const FIELDS: { id: keyof FormData; label: string; type?: string; placeholder: string }[] = [
  { id: 'name', label: 'Seu nome', placeholder: 'Como podemos te chamar?' },
  { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
  { id: 'phone', label: 'WhatsApp', placeholder: '(00) 00000-0000' },
  { id: 'document', label: 'CPF ou CNPJ', placeholder: '000.000.000-00' },
  { id: 'password', label: 'Senha', type: 'password', placeholder: 'Mínimo de 8 caracteres' },
];

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', document: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [formError, setFormError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = name === 'phone' ? formatPhone(value) : name === 'document' ? formatDocument(value) : value;
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    if (submitAttempted) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormData, formatted) }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);
    setFormError('');

    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const payload: Record<string, unknown> = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
        document: formData.document.replace(/\D/g, ''),
      };
      const planId = params.get('plan_id');
      if (planId) payload.plan_id = planId;
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
        const value = params.get(key);
        if (value) payload[key] = value;
      });

      const response = await fetch(`${SIGNUP_API_BASE}/register/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: payload.phone, email: payload.email, name: payload.name }),
      });

      if (!response.ok) throw new Error('Não foi possível enviar o código. Tente novamente.');

      setPendingPayload(payload);
      setStep('verify');
      window.lojivaTrack?.signupStart();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingPayload) return;
    if (!verificationCode.trim()) {
      setCodeError('Informe o código que enviamos pelo WhatsApp');
      return;
    }
    setCodeError('');
    setIsConfirming(true);

    try {
      const response = await fetch(`${SIGNUP_API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingPayload,
          verification_code: verificationCode.trim(),
          accepted_term_of_use: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data ? String(Object.values(data)[0] ?? '') : '';
        throw new Error(message || 'Código inválido ou expirado.');
      }

      setStep('done');
      window.lojivaTrack?.leadSubmit();
      window.setTimeout(() => {
        window.location.href = `${LOGIN_URL}/login?email=${encodeURIComponent(String(pendingPayload.email))}`;
      }, 1500);
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
        <p className="text-lg font-semibold text-foreground">Conta criada com sucesso!</p>
        <p className="mt-2 text-sm text-muted-foreground">Redirecionando para o painel da Lojiva...</p>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <h2 className="font-display text-xl font-bold text-foreground">Confirme seu WhatsApp</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviamos um código de verificação para o WhatsApp informado. Digite-o abaixo para concluir o cadastro.
        </p>
        <input
          type="text"
          inputMode="numeric"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Código recebido no WhatsApp"
          className="mt-5 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {codeError && <p className="mt-2 text-sm text-destructive">{codeError}</p>}
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-60"
        >
          {isConfirming ? 'Confirmando...' : 'Confirmar e criar conta'}
        </button>
        <button onClick={() => setStep('form')} className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground">
          Voltar e corrigir dados
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
      <h2 className="font-display text-xl font-bold text-foreground">Criar conta</h2>
      <p className="mt-2 text-sm text-muted-foreground">Preencha os dados abaixo para começar a testar a Lojiva.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-foreground">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              value={formData[field.id]}
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            {errors[field.id] && <p className="mt-1 text-xs text-destructive">{errors[field.id]}</p>}
          </div>
        ))}

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando...' : 'Criar minha conta'}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com os termos de uso da Lojiva.
        </p>
      </form>
    </div>
  );
}

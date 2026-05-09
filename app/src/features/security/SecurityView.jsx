import React, { useState } from 'react';
import {
  Shield, FileText, Lock, Database, AlertTriangle, Info,
  ShieldCheck, ShieldAlert, CheckCircle, Scale, Users,
  HardDrive, Key, WifiOff, Mail, ExternalLink, X, AlertCircle,
} from 'lucide-react';
import {
  TERMS_ARTICLES, TERMS_VERSION, TERMS_DATE, PLATFORM_INFO,
  PRIVACY_SECTIONS, CONDUCT_RULES,
} from '../terms/termsContent';
import { PageHero, CategoryChips } from '../../components/mobile';

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Visão Geral', icon: Shield },
  { id: 'terms', label: 'Termos de Uso', icon: FileText },
  { id: 'privacy', label: 'Privacidade & LGPD', icon: Lock },
  { id: 'cookies', label: 'Cookies', icon: Database },
  { id: 'conduct', label: 'Conduta', icon: AlertTriangle },
  { id: 'about', label: 'Sobre', icon: Info },
];

// ─── Sub-componente: Aba Visão Geral ──────────────────────────────────────────
function OverviewTab() {
  const commitments = [
    { icon: Shield, color: 'indigo', title: 'Seus dados protegidos', desc: 'Infraestrutura criptografada, sem venda para terceiros.' },
    { icon: Lock, color: 'emerald', title: 'Autenticação segura', desc: 'OAuth 2.0 + OTP — sem senhas frágeis.' },
    { icon: ShieldAlert, color: 'amber', title: 'Moderação ativa', desc: 'Conteúdo revisado por equipe dedicada 24h.' },
    { icon: FileText, color: 'blue', title: 'Termos transparentes', desc: 'Linguagem clara, sem letras miúdas importantes.' },
    { icon: Scale, color: 'purple', title: 'LGPD compliance', desc: 'Lei 13.709/2018 respeitada integralmente.' },
    { icon: Users, color: 'slate', title: 'Comunidade responsável', desc: 'Código de conduta para um bairro digital saudável.' },
  ];
  const colorMap = {
    indigo: 'bg-indigo-50  border-indigo-100  text-indigo-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50   border-amber-100   text-amber-600',
    blue: 'bg-blue-50    border-blue-100    text-blue-600',
    purple: 'bg-purple-50  border-purple-100  text-purple-600',
    slate: 'bg-slate-50   border-slate-100   text-slate-600',
  };
  const iconBgMap = {
    indigo: 'bg-indigo-100',
    emerald: 'bg-emerald-100',
    amber: 'bg-amber-100',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    slate: 'bg-slate-100',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-8 text-center">
        <ShieldCheck className="text-indigo-200 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-black text-white mb-2">Central de Segurança</h2>
        <p className="text-indigo-200 text-sm max-w-md mx-auto">
          Transparência, privacidade e regras claras para uma comunidade saudável.
        </p>
      </div>

      {/* Commitments grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {commitments.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className={`border rounded-2xl p-5 shadow-sm ${colorMap[color]}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBgMap[color]}`}>
              <Icon size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Version */}
      <p className="text-center text-[10px] text-slate-400">
        Versão 1.0 · {TERMS_DATE} · {PLATFORM_INFO.developer}
      </p>
    </div>
  );
}

// ─── Sub-componente: Aba Termos ───────────────────────────────────────────────
function TermsTabLocal() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
          {TERMS_VERSION} · {TERMS_DATE}
        </span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {TERMS_ARTICLES.map((article, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-slate-800 text-sm mb-2">{article.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{article.body}</p>
            {idx < TERMS_ARTICLES.length - 1 && (
              <hr className="mt-4 border-slate-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-componente: Aba Privacidade ─────────────────────────────────────────
const LGPD_RIGHTS = [
  { label: 'Confirmação de tratamento', desc: 'Saber se seus dados são processados.' },
  { label: 'Acesso', desc: 'Ver todos os dados que temos sobre você.' },
  { label: 'Correção', desc: 'Corrigir dados incompletos ou incorretos.' },
  { label: 'Anonimização/Exclusão', desc: 'Eliminar dados desnecessários.' },
  { label: 'Portabilidade', desc: 'Levar seus dados para outro serviço.' },
  { label: 'Exclusão', desc: 'Apagar dados tratados com consentimento.' },
  { label: 'Informação de terceiros', desc: 'Saber com quem compartilhamos seus dados.' },
  { label: 'Revogação', desc: 'Retirar consentimento a qualquer momento.' },
];

const PRIVACY_ICON_MAP = {
  database: Database,
  settings: Shield,
  share2: Users,
  shield: Lock,
};

function PrivacyTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {PRIVACY_SECTIONS.map((section) => {
        const Icon = PRIVACY_ICON_MAP[section.icon] || Shield;
        return (
          <div key={section.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Icon size={16} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{section.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* LGPD Rights */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <h3 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
          <Scale size={15} /> Seus Direitos LGPD (Art. 18)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LGPD_RIGHTS.map((right, i) => (
            <div key={i} className="bg-white rounded-xl p-3">
              <p className="font-semibold text-indigo-800 text-[11px]">{right.label}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{right.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact button */}
      <a
        href={`mailto:${PLATFORM_INFO.support}`}
        className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
      >
        <Mail size={16} />
        Exercer meus direitos LGPD → {PLATFORM_INFO.support}
      </a>
    </div>
  );
}

// ─── Sub-componente: Aba Cookies ─────────────────────────────────────────────
const COOKIE_CARDS = [
  {
    icon: HardDrive, color: 'blue',
    title: 'localStorage / sessionStorage',
    what: 'Armazenamento local do navegador',
    content: 'Preferências de interface, estado da sessão',
    purpose: 'Funcionamento da aplicação',
    expiry: 'Até logout ou limpeza manual',
  },
  {
    icon: Key, color: 'indigo',
    title: 'JWT Token de Sessão',
    what: 'Token de autenticação seguro',
    content: 'Identificador criptografado da sessão (sem dados pessoais em texto plano)',
    purpose: 'Manter usuário autenticado com segurança',
    expiry: '7 dias (renovado automaticamente)',
  },
  {
    icon: WifiOff, color: 'emerald',
    title: 'PWA Service Worker Cache',
    what: 'Cache para funcionamento offline',
    content: 'Recursos estáticos (CSS, JS, ícones) — ZERO dados pessoais',
    purpose: 'Carregar a plataforma mesmo sem internet',
    expiry: 'Atualizado automaticamente a cada deploy',
  },
];

const COOKIE_COLOR_MAP = {
  blue: { card: 'border-blue-100', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-50 text-blue-700' },
  indigo: { card: 'border-indigo-100', icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
  emerald: { card: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
};

function CookiesTab() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-center py-2">
        <h2 className="font-bold text-slate-800 text-lg">O que armazenamos no seu dispositivo</h2>
        <p className="text-slate-500 text-xs mt-1">Apenas o mínimo necessário para o funcionamento seguro da plataforma.</p>
      </div>

      {COOKIE_CARDS.map(({ icon: Icon, color, title, what, content, purpose, expiry }) => {
        const c = COOKIE_COLOR_MAP[color];
        return (
          <div key={title} className={`bg-white border rounded-2xl p-5 shadow-sm ${c.card}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${c.icon} shrink-0`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm mb-2">{title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">O que é</p>
                    <p className="text-slate-600">{what}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">Conteúdo</p>
                    <p className="text-slate-600">{content}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">Finalidade</p>
                    <p className="text-slate-600">{purpose}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">Expiração</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{expiry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="font-bold text-amber-800 text-sm mb-1">🚫 O que NÃO utilizamos</p>
        <p className="text-amber-700 text-xs leading-relaxed">
          Cookies de rastreamento, pixels de conversão, Google Analytics, Meta Pixel,
          ou qualquer tecnologia de publicidade comportamental.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-componente: Aba Conduta ─────────────────────────────────────────────
const CONDUCT_STYLE = {
  critical: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    card: 'border-red-100',
    iconColor: 'text-red-500',
  },
  severe: {
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    card: 'border-orange-100',
    iconColor: 'text-orange-500',
  },
  moderate: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    card: 'border-amber-100',
    iconColor: 'text-amber-500',
  },
};

function ConductTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <AlertTriangle className="text-amber-500 mx-auto mb-2" size={28} />
        <h2 className="font-bold text-slate-800 text-base mb-1">Código de Conduta da Comunidade</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          O Tem No Bairro é um espaço para conexão real entre vizinhos. Para mantê-lo
          saudável e seguro, aplicamos estas regras.
        </p>
      </div>

      {CONDUCT_RULES.map((group) => {
        const style = CONDUCT_STYLE[group.level];
        return (
          <div key={group.level} className={`bg-white border rounded-2xl p-5 shadow-sm ${style.card}`}>
            <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border mb-4 ${style.badge}`}>
              {group.title}
            </span>
            <ul className="space-y-2">
              {group.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  {group.level === 'moderate'
                    ? <AlertCircle size={13} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
                    : <X size={13} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
                  }
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Processo de denúncias */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-4">O que acontece com denúncias?</h3>
        <div className="space-y-3">
          {[
            { n: '1', label: 'Usuário denuncia conteúdo via botão "Reportar"' },
            { n: '2', label: 'Moderação revisa em até 24 horas' },
            { n: '3', label: 'Ação aplicada + notificação às partes envolvidas' },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                {n}
              </div>
              <p className="text-xs text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componente: Aba Sobre ────────────────────────────────────────────────
function AboutTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Brand card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-center">
        <h2 className="text-3xl font-light text-white mb-1">
          TemNo<span className="font-black text-indigo-400">Bairro</span>
        </h2>
        <p className="text-slate-300 text-sm mb-2">Hub digital comunitário para bairros brasileiros</p>
        <p className="text-slate-500 text-xs">São José dos Campos · SP</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plataforma */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">A Plataforma</h3>
          <dl className="space-y-2 text-xs">
            {[
              ['Versão', 'Beta 2.0'],
              ['Bairros ativos', '1 (Parque Interlagos)'],
              ['Lançamento', '2026'],
              ['Tecnologia', 'React 19 + Supabase'],
              ['Hospedagem', 'Hostgator Brasil'],
            ].map(([dt, dd]) => (
              <div key={dt} className="flex justify-between">
                <dt className="text-slate-500 font-medium">{dt}</dt>
                <dd className="text-slate-700 font-semibold text-right">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Desenvolvimento */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">Desenvolvimento</h3>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Empresa</dt>
              <dd className="text-slate-700 font-semibold">{PLATFORM_INFO.developer}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">CNPJ</dt>
              <dd className="text-slate-700 font-mono">{PLATFORM_INFO.cnpj}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-slate-500 font-medium">Suporte técnico</dt>
              <dd>
                <a href={`mailto:${PLATFORM_INFO.devEmail}`} className="text-indigo-600 hover:underline">
                  {PLATFORM_INFO.devEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-slate-500 font-medium">Site</dt>
              <dd>
                <a
                  href={PLATFORM_INFO.devSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-500 transition-colors flex items-center gap-1"
                >
                  plenainformatica.com.br
                  <ExternalLink size={10} />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`mailto:${PLATFORM_INFO.support}`}
          className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4 hover:bg-emerald-100 transition-colors"
        >
          <Mail size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Suporte geral</p>
            <p className="text-xs font-semibold text-slate-700">{PLATFORM_INFO.support}</p>
          </div>
        </a>
        <a
          href={`mailto:${PLATFORM_INFO.devEmail}`}
          className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 hover:bg-indigo-100 transition-colors"
        >
          <Mail size={18} className="text-indigo-600 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Suporte técnico</p>
            <p className="text-xs font-semibold text-slate-700">{PLATFORM_INFO.devEmail}</p>
          </div>
        </a>
      </div>

      {/* Footer legal */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[10px] text-slate-400">© {PLATFORM_INFO.year} Tem No Bairro · Desenvolvido por {PLATFORM_INFO.developer}</p>
        <p className="text-[10px] text-slate-400">Todos os direitos reservados. CNPJ {PLATFORM_INFO.cnpj}</p>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function SecurityView() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'terms': return <TermsTabLocal />;
      case 'privacy': return <PrivacyTab />;
      case 'cookies': return <CookiesTab />;
      case 'conduct': return <ConductTab />;
      case 'about': return <AboutTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="mobile-page bg-gray-50 pb-24 animate-in fade-in duration-300">
      <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="merchants"
          title="Central de Segurança"
          subtitle="Termos, privacidade e conduta"
          icon={ShieldCheck}
          compact
        />
        <div className="px-3 pt-3">
          <CategoryChips
            items={TABS}
            value={activeTab}
            onChange={setActiveTab}
            section="merchants"
            getId={(item) => item.id}
            getLabel={(item) => item.label}
            getIcon={(item) => item.icon}
          />
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-3 pt-4">
        {renderTab()}
      </main>
    </div>
  );
}

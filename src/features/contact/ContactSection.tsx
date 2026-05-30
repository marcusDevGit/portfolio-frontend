import { useContactStore } from "../../shared/stores/useContactStore";
import React, { useState } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";
import { toast } from "sonner";

export function ContactSection() {
  const { formData, setFormData, resetForm } = useContactStore();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const api_url = import.meta.env.VITE_API_URL;
  // Busca as informações do WhatsApp cadastrado
  React.useEffect(() => {
    fetch(`${api_url}/api/profile`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setWhatsapp(data.whatsapp || null);
      })
      .catch((err) => {
        console.error("Erro ao buscar WhatsApp para contato rápido:", err);
      });
  }, [api_url]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao enviar mensagem");
        setStatus("idle");
        return;
      }
      toast.success("Mensagem enviada com sucesso!");
      resetForm();
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      toast.error("Não foi possível enviar a mensagem. Tente novamente!");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-4">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block">
              Contato
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-(--text-primary) mb-4">
              Vamos conversar
            </h2>
            <p className="font-body text-(--text-secondary)">
              Aberto a oportunidades, freelas e colaborações. Me manda uma
              mensagem.
            </p>
            {whatsapp && (
              <div className="mt-4 flex justify-center">
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2 px-4 py-2 rounded-full border border-(--accent-cyan)/20 
                    bg-(--accent-cyan)/5 hover:bg-(--accent-cyan)/10 text-xs font-display uppercase tracking-widest 
                    text-(--accent-cyan) hover:shadow-[0_0_15px_rgba(0,209,255,0.2)] transition-all duration-300
                  "
                >
                  💬 Conversar direto no WhatsApp
                </a>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-(--bg-card) backdrop-blur-md border border-(--border-subtle) rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-display uppercase tracking-widest text-(--text-muted)"
                >
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="bg-(--bg-card) border border-(--border-subtle) rounded-lg px-4 py-3 text-sm font-body text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent-cyan)/50 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-display uppercase tracking-widest text-(--text-muted)"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-(--bg-card) border border-(--border-subtle) rounded-lg px-4 py-3 text-sm font-body text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent-cyan)/50 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-xs font-display uppercase tracking-widest text-(--text-muted)"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Olá Marcus, gostaria de..."
                className="bg-(--bg-card) border border-(--border-subtle) rounded-lg px-4 py-3 text-sm font-body text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent-cyan)/50 transition-colors duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="mt-2 px-6 py-3 rounded-full bg-(--accent-cyan) text-[#050816] font-display font-semibold text-sm uppercase tracking-widest hover:shadow-[0_0_24px_4px_rgba(0,209,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {status === "sent"
                ? "✓ Enviado!"
                : status === "sending"
                  ? "Enviando..."
                  : status === "error"
                    ? "✗ Erro — tente novamente"
                    : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </ScrollReveal>
    </section>
  );
}

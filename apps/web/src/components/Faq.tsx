import type { Copy } from "@/lib/copy";

export function Faq({ copy }: { copy: Copy }) {
  return (
    <section aria-labelledby="faq" className="container-narrow pt-12">
      <h2 id="faq" className="font-display text-3xl font-bold">{copy.faq.title}</h2>
      <div className="mt-4 divide-y divide-night-700/15 rounded-3xl border border-night-700/15 bg-paper">
        {copy.faq.items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden className="text-2xl text-gold-600 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-night-900/80">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

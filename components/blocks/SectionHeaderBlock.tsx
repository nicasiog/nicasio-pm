type SectionHeaderValue = { number?: string; label?: string; heading: string; intro?: string }

export function SectionHeaderBlock({ value }: { value: SectionHeaderValue }) {
  const eyebrow = [value.number, value.label].filter(Boolean).join(' // ')
  return (
    <div className="flex flex-col gap-3 pt-8">
      {eyebrow ? <p className="eyebrow text-tertiary">{eyebrow}</p> : null}
      <h2 className="font-display text-headline-sm text-text md:text-[2rem] md:leading-10">{value.heading}</h2>
      {value.intro ? <p className="prose-col text-body-lg text-text-muted">{value.intro}</p> : null}
    </div>
  )
}

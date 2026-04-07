interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl font-semibold mb-3">{title}</h1>
      <p className="text-lg text-bleu-nuit/80 max-w-2xl leading-relaxed">
        {description}
      </p>
    </header>
  )
}

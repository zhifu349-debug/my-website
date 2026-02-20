import { AdSlot } from '@/types/advertising'

interface AdSlotProps {
  ad: AdSlot
  className?: string
}

export default function AdSlotComponent({ ad, className = '' }: AdSlotProps) {
  if (!ad.enabled) return null

  return (
    <div className={`ad-slot ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: ad.adCode }} />
    </div>
  )
}

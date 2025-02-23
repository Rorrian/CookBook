import { MAX_COMPLEXITY_LEVEL } from '@modules/recipes'
import { StarFillIcon, StarBlankIcon } from '@shared/icons'

interface StarRatingProps {
  rating: number
  maxRating?: number
}

export const StarRating = ({
  rating,
  maxRating = MAX_COMPLEXITY_LEVEL,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(maxRating)].map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <StarFillIcon width={19} height={19} />
          ) : (
            <StarBlankIcon width={20} height={20} />
          )}
        </span>
      ))}
    </div>
  )
}

import { MdStar, MdStarBorder } from 'react-icons/md'

import { MAX_COMPLEXITY_LEVEL } from '@modules/recipes'

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
          {index < rating ? <MdStar size={20} /> : <MdStarBorder size={20} />}
        </span>
      ))}
    </div>
  )
}

import { MdStar, MdStarBorder } from 'react-icons/md'

import { MAX_COMPLEXITY_LEVEL } from '@modules/recipes'

export const getComplexityLevels = () =>
  Array.from({ length: MAX_COMPLEXITY_LEVEL }, (_, i) => {
    const rating = i + 1
    return {
      value: rating.toString(),
      label: (
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(MAX_COMPLEXITY_LEVEL)].map((_, index) => (
            <span key={index}>
              {index < rating ? (
                <MdStar size={16} />
              ) : (
                <MdStarBorder size={16} />
              )}
            </span>
          ))}
        </div>
      ),
    }
  })

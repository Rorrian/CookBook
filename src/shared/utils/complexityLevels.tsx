import { MAX_COMPLEXITY_LEVEL } from '@modules/recipes'
import { StarFillIcon, StarBlankIcon } from '@shared/icons'

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
                <StarFillIcon width={11} height={11} />
              ) : (
                <StarBlankIcon width={12} height={12} />
              )}
            </span>
          ))}
        </div>
      ),
    }
  })

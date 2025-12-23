import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, size = 20, color = "var(--color-neon-green)" }) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => onRatingChange && onRatingChange(star)}
          style={{ cursor: onRatingChange ? 'pointer' : 'default' }}
        >
          <Star 
            size={size} 
            fill={star <= rating ? color : "none"} 
            color={star <= rating ? color : "#666"}
            strokeWidth={1.5}
          />
        </div>
      ))}
    </div>
  );
};

export default StarRating;

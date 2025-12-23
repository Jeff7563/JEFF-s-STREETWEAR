import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import { User, MessageSquare } from 'lucide-react';

const ProductReviews = ({ productId }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Reviews
  useEffect(() => {
    if (!productId) return;

    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: currentUser.uid,
        userName: currentUser.email.split('@')[0], // Simple username
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setNewRating(5);
      alert('Review submitted!');
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Failed to submit review.');
    }
  };

  // Calculate Average
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #222' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        REVIEWS
        {reviews.length > 0 && (
            <span style={{ fontSize: '1rem', background: '#222', padding: '0.2rem 0.8rem', borderRadius: '12px' }}>
                ⭐ {averageRating} ({reviews.length})
            </span>
        )}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Review List */}
        <div>
           {loading ? (
             <p>Loading reviews...</p>
           ) : reviews.length === 0 ? (
             <p style={{ color: '#666' }}>No reviews yet. Be the first!</p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {reviews.map(review => (
                   <div key={review.id} style={{ borderBottom: '1px solid #222', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                            <div style={{ width: '30px', height: '30px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={16} />
                            </div>
                            {review.userName}
                         </div>
                         <span style={{ color: '#666', fontSize: '0.8rem' }}>
                            {review.createdAt?.toDate().toLocaleDateString()}
                         </span>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p style={{ color: '#ccc', lineHeight: '1.5' }}>{review.comment}</p>
                   </div>
                ))}
             </div>
           )}
        </div>

        {/* Review Form */}
        <div>
           <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <MessageSquare size={20} color="var(--color-neon-green)" />
                 WRITE A REVIEW
              </h3>
              
              {currentUser ? (
                  <form onSubmit={handleSubmit}>
                     <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Your Rating</label>
                        <StarRating rating={newRating} onRatingChange={setNewRating} size={24} />
                     </div>
                     
                     <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Your Review</label>
                        <textarea 
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           required
                           rows="4"
                           style={{
                              width: '100%',
                              padding: '1rem',
                              background: 'black',
                              border: '1px solid #333',
                              color: 'white',
                              borderRadius: '4px',
                              outline: 'none',
                              resize: 'none'
                           }}
                           placeholder="How was the product?"
                        />
                     </div>

                     <button 
                        type="submit" 
                        className="btn-primary"
                        style={{ width: '100%' }}
                     >
                        SUBMIT REVIEW
                     </button>
                  </form>
              ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                     <p style={{ marginBottom: '1rem', color: '#888' }}>Please login to review this product.</p>
                     <a href="/login" style={{ color: 'var(--color-neon-green)', textDecoration: 'underline' }}>Login Now</a>
                  </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductReviews;

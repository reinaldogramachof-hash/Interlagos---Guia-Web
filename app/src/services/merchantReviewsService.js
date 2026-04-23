import { supabase } from '../lib/supabaseClient';

export const getApprovedReviews = async (merchantId) => {
  const { data, error } = await supabase
    .from('merchant_reviews')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('merchantReviewsService.getApprovedReviews:', error);
    return [];
  }
  return data || [];
};

export const createReview = async ({ merchantId, authorId, authorName, neighborhood, rating, comment }) => {
  // Enforçar 1 review por usuário por loja
  const { data: existing, error: checkError } = await supabase
    .from('merchant_reviews')
    .select('id')
    .eq('merchant_id', merchantId)
    .eq('author_id', authorId)
    .maybeSingle();

  if (checkError) {
    console.error('merchantReviewsService.createReview check:', checkError);
    throw checkError;
  }

  if (existing) {
    throw new Error('Você já avaliou esta loja.');
  }

  const { data, error } = await supabase
    .from('merchant_reviews')
    .insert({
      merchant_id: merchantId,
      author_id: authorId,
      author_name: authorName,
      neighborhood: neighborhood,
      rating: rating,
      comment: comment,
      is_approved: true
    })
    .select()
    .single();

  if (error) {
    console.error('merchantReviewsService.createReview:', error);
    throw error;
  }
  return data;
};

export const getAverageRating = async (merchantId) => {
  const { data, error } = await supabase
    .from('merchant_reviews')
    .select('rating')
    .eq('merchant_id', merchantId)
    .eq('is_approved', true);

  if (error) {
    console.error('merchantReviewsService.getAverageRating:', error);
    return { average: 0, count: 0 };
  }

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  return { average: sum / data.length, count: data.length };
};

export const getRecentReviews = async () => {
  const { data, error } = await supabase
    .from('merchant_reviews')
    .select(`*, merchants (name)`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('merchantReviewsService.getRecentReviews:', error);
    return [];
  }
  return (data || []).map(r => ({ ...r, merchant_name: r.merchants?.name || '—' }));
};

export const approveReview = async (reviewId) => {
  const { error } = await supabase
    .from('merchant_reviews')
    .update({ is_approved: true })
    .eq('id', reviewId);

  if (error) throw error;
};

export const rejectReview = async (reviewId) => {
  const { error } = await supabase
    .from('merchant_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
};

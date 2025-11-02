export function getStarClasses(rating: number | undefined, totalStars = 5) {
  const stars = [];
  const roundedRating = rating ? Math.round(rating) : 0;

  for (let i = 0; i < totalStars; i++) {
    stars.push(
      i < roundedRating
        ? "fill-orange-500 text-orange-500"
        : "fill-gray-200 text-gray-200"
    );
  }

  return stars;
}

import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpg";
import image4 from "./assets/image4.jpg";
import image5 from "./assets/image5.jpg";
import image6 from "./assets/image6.jpg";
import image7 from "./assets/image7.jpg";
import recommendations from "./assets/recommendations.json";
const images = [image1, image2, image3, image4, image5, image6, image7];
export const songsData = recommendations.map((rec, index) => ({
  id: index + 1,  // Create a unique ID for each song
  name: rec.name,
  image: images[index], // Dynamically select the image based on the index
  liked: false,
  singer: rec.artist,
  trackUrl: rec.track_url,   // Add track_url from recommendations
  similarity: rec.similarity, // Add similarity score from recommendations
}));

console.log(songsData);  // Optional: Check the result in console

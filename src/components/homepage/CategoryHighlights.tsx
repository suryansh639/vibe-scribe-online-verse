
import { Link } from "react-router-dom";

interface CategoryProps {
  name: string;
  description: string;
  image: string;
  slug: string;
}

const CategoryHighlights = () => {
  // Mock data for categories
  const categories: CategoryProps[] = [
    {
      name: "Technology",
      description: "Explore the latest in tech trends, innovations, and digital transformations",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "technology"
    },
    {
      name: "Lifestyle",
      description: "Discover insights on wellness, personal development, and daily living",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "lifestyle"
    },
    {
      name: "Business",
      description: "Stay updated on entrepreneurship, markets, and business strategies",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "business"
    },
    {
      name: "Travel",
      description: "Journey through destinations, cultures, and travel experiences",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "travel"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Explore Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            to={`/all-articles?tag=${category.slug}`} 
            key={category.slug}
            className="group relative overflow-hidden rounded-lg h-60 hover-scale"
            aria-label={`View ${category.name} articles`}
          >
            <div className="absolute inset-0">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="font-bold text-xl mb-1">{category.name}</h3>
              <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryHighlights;

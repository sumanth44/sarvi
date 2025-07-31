import React from 'react';
import { Star, Users, Award, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-orange-400">Sarvi</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            We are passionate about bringing you the finest culinary experiences from around the world, 
            delivered fresh to your doorstep with love and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-stone-800 rounded-xl p-6 text-center">
            <Star className="text-orange-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Quality Food</h3>
            <p className="text-gray-300">Fresh ingredients and authentic recipes</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6 text-center">
            <Users className="text-orange-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Expert Chefs</h3>
            <p className="text-gray-300">Skilled culinary professionals</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6 text-center">
            <Award className="text-orange-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Award Winning</h3>
            <p className="text-gray-300">Recognized for excellence</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6 text-center">
            <Heart className="text-orange-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Made with Love</h3>
            <p className="text-gray-300">Every dish crafted with passion</p>
          </div>
        </div>

        <div className="bg-stone-800 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-300 mb-4">
                Founded with a passion for authentic flavors and exceptional service, Sarvi began as a small 
                family restaurant with big dreams. Our journey started with a simple mission: to bring 
                people together through the universal language of delicious food.
              </p>
              <p className="text-gray-300 mb-4">
                Today, we pride ourselves on sourcing the finest ingredients, supporting local farmers, 
                and maintaining the traditional cooking methods that make each dish special. From our 
                authentic Mexican specialties to delightful desserts, every item on our menu tells a story.
              </p>
              <p className="text-gray-300">
                Our commitment to quality, authenticity, and customer satisfaction has made us a beloved 
                choice for food lovers who appreciate the finer things in life.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Our kitchen"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-stone-800 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose Sarvi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-orange-300 font-semibold mb-2">Authentic Recipes</h3>
              <p className="text-gray-300">Traditional cooking methods passed down through generations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-orange-300 font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Hot, fresh food delivered to your door in record time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-orange-300 font-semibold mb-2">Customer Love</h3>
              <p className="text-gray-300">Exceptional service and customer satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
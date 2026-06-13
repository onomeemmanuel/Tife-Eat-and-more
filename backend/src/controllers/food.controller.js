const FoodItem = require('../models/FoodItem.model');

// Seed some food items if DB is empty
const seedFoods = async () => {
  const count = await FoodItem.countDocuments();
  if (count > 0) return;

  await FoodItem.insertMany([
    {
      name: 'Classic Smash Burger',
      description: 'Double smash patty, cheddar, pickles, special sauce',
      price: 4500,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      rating: 4.8,
      isFeatured: true,
      prepTime: '10-15 min'
    },
    {
      name: 'BBQ Bacon Burger',
      description: 'Crispy bacon, BBQ sauce, caramelized onions',
      price: 5200,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
      rating: 4.7,
      prepTime: '12-18 min'
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Loaded pepperoni, mozzarella, tomato base',
      price: 6800,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      rating: 4.9,
      isFeatured: true,
      prepTime: '20-25 min'
    },
    {
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken, BBQ base, red onion, cilantro',
      price: 7200,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      rating: 4.6,
      prepTime: '20-25 min'
    },
    {
      name: 'Crispy Fried Chicken',
      description: '3 pieces seasoned crispy chicken, coleslaw',
      price: 3800,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
      rating: 4.7,
      isFeatured: true,
      prepTime: '15-20 min'
    },
    {
      name: 'Spicy Wings (8pcs)',
      description: 'Buffalo style wings, blue cheese dip',
      price: 4200,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
      rating: 4.8,
      prepTime: '15-20 min'
    },
    {
      name: 'Loaded Fries',
      description: 'Crispy fries, cheese sauce, jalapeños, bacon bits',
      price: 2200,
      category: 'Sides',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
      rating: 4.5,
      prepTime: '8-12 min'
    },
    {
      name: 'Onion Rings',
      description: 'Beer battered onion rings, chipotle dip',
      price: 1800,
      category: 'Sides',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
      rating: 4.4,
      prepTime: '8-10 min'
    },
    {
      name: 'Chocolate Milkshake',
      description: 'Thick creamy chocolate shake, whipped cream',
      price: 2500,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
      rating: 4.9,
      prepTime: '5 min'
    },
    {
      name: 'Fresh Lemonade',
      description: 'Freshly squeezed lemonade, mint, ice',
      price: 1500,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
      rating: 4.6,
      prepTime: '3 min'
    },
    {
      name: 'Nutella Waffle',
      description: 'Belgian waffle, Nutella, strawberries, powdered sugar',
      price: 3200,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
      rating: 4.8,
      isFeatured: true,
      prepTime: '10 min'
    },
    {
      name: 'Ice Cream Sundae',
      description: 'Vanilla ice cream, hot fudge, cherry on top',
      price: 2800,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      rating: 4.7,
      prepTime: '5 min'
    }
  ]);
  console.log('Food items seeded!');
};

exports.getAllFoods = async (req, res) => {
  try {
    await seedFoods();
    const { category } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== 'All') filter.category = category;
    const foods = await FoodItem.find(filter);
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    await seedFoods();
    const foods = await FoodItem.find({ isFeatured: true, isAvailable: true });
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
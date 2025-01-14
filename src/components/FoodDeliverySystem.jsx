import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Navigation, Store, DollarSign, Paperclip, Package, Building2, Star, Coffee, Sparkles, Heart, Wallet, CreditCard, Bitcoin  } from 'lucide-react';
import EnhancedDeliveryMap from './EnhancedDeliveryMap';
import { Toaster, toast } from 'react-hot-toast';

const GobblDeliverySystem = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [state, setState] = useState({
    orders: [],
    trucks: Array(3).fill().map((_, i) => ({
      id: i + 1,
      position: { x: 50, y: 50 },
      status: 'idle',
      rotation: 0,
    })),
    messages: { consumer: [], delivery: [], restaurant: [], accounting: [] },
    reviews: [],
    payments: { totalRevenue: 0, pendingPayments: 0, completedPayments: 0 },
  });
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
};

  const PREP_TIME = 8000;
  const DELIVERY_TIME = 10000;

  const addMessage = useCallback((category, text) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [category]: [
          ...prev.messages[category],
          {
            text,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      },
    }));
  }, []);

  const pizzas = [
    {
      "id": 1,
      "name": "Spicy Chipotle Chicken Pizza",
      "description": "Spicy Chipotle Chicken Pizza with grilled chicken, onions, jalapeño, and Heinz Chipotle Sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__1.png"
  },
  {
      "id": 2,
      "name": "Chicken & Mushroom Truffle",
      "description": "Chicken and mushroom pizza with creamy cheese and Heinz Truffle Sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__2.png"
  },
  {
      "id": 3,
      "name": "Spinach Alfredo Chicken Pesto",
      "description": "Spinach Alfredo Sauce pizza with chicken, onions, and Heinz Pesto Sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__3.png"
  },
  {
      "id": 4,
      "name": "Meal for Two Chicken Shawarma",
      "description": "Medium Chicken Shawarma, wedges, and 2 drink cans.",
      "category": "Combo",
      "price": "69.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__4.png"
  },
  {
      "id": 5,
      "name": "Shawarma Pizza",
      "description": "Chicken Shawarma Pizza with pickles, wedges, and garlic sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__5.png"
  },
  {
      "id": 6,
      "name": "Shawarma Potato Wedges",
      "description": "Potato wedges with Shawarma spice and toum sauce.",
      "category": "Side",
      "price": "15.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__6.png"
  },
  {
      "id": 7,
      "name": "Pizza Tower",
      "description": "4 small pizzas, Mix Box, and 1.5L drink.",
      "category": "Pizza Combo",
      "price": "125.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__7.png"
  },
  {
      "id": 8,
      "name": "Pizza Tower (Small pizzas)",
      "description": "4 small pizzas of your choice.",
      "category": "Pizza Combo",
      "price": "89.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__8.png"
  },
  {
      "id": 9,
      "name": "Papa's Solo Meal",
      "description": "Small 8' pizza, potato wedges, and drink can.",
      "category": "Pizza Combo",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__9.png"
  },
  {
      "id": 10,
      "name": "Papa's Family Meal",
      "description": "2 medium pizzas, 2 starters, and 1.5L drink.",
      "category": "Pizza Combo",
      "price": "119.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__10.png"
  },
  {
      "id": 11,
      "name": "Papa's Party Meal",
      "description": "3 medium pizzas, 2 starters, and 2.26L drink.",
      "category": "Pizza Combo",
      "price": "149.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__11.png"
  },
  {
      "id": 12,
      "name": "Papa's Meal for Two",
      "description": "Medium pizza, 2 starters, and 2 drink cans.",
      "category": "Pizza Combo",
      "price": "69.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__12.png"
  },
  {
      "id": 13,
      "name": "Trio Plus",
      "description": "3 medium pizzas and 1.5L drink bottle.",
      "category": "Pizza Combo",
      "price": "99.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__13.png"
  },
  {
      "id": 14,
      "name": "Duo Plus",
      "description": "2 medium pizzas and 1.5L drink.",
      "category": "Pizza Combo",
      "price": "79.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__14.png"
  },
  {
      "id": 15,
      "name": "Papadia Meal for Two",
      "description": "2 Papadias, wedges, and 2 drink cans.",
      "category": "Combo",
      "price": "60.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__15.png"
  },
  {
      "id": 16,
      "name": "Papadia Meal for One",
      "description": "One Papadia, potato wedges, and a soft drink.",
      "category": "Combo",
      "price": "37.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__16.png"
  },
  {
      "id": 17,
      "name": "Vegan Papadia Meal for Two",
      "description": "Two Vegan Papadias, wedges for two, and drinks.",
      "category": "Combo",
      "price": "60.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__17.png"
  },
  {
      "id": 18,
      "name": "Vegan Papadia Meal for One",
      "description": "One Vegan Papadia, wedges, and a soft drink.",
      "category": "Combo",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__18.png"
  },
  {
      "id": 19,
      "name": "Cheese Pizza Kid's Meals",
      "description": "Cheese pizza and fruit juice.",
      "category": "Kids",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__19.png"
  },
  {
      "id": 20,
      "name": "Mini Cheesesticks Kids Meal",
      "description": "8 mini cheese sticks and fruit juice.",
      "category": "Kids",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__20.png"
  },
  {
      "id": 21,
      "name": "Happy Face Kids Meal",
      "description": " Happy Face pizza and a kid's drink.",
      "category": "Kids",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__21.png"
  },
  {
      "id": 22,
      "name": "Chicken Poppers Kids Meal",
      "description": "5 Chicken Poppers, wedges, and fruit juice.",
      "category": "Kids",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__22.png"
  },
  {
      "id": 23,
      "name": "Grilled Cheddar Cheese",
      "description": "Mozzarella, cheddar cheese, and crispy panko crumbs.",
      "category": "Pizza",
      "price": "31.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__23.png"
  },
  {
      "id": 24,
      "name": "Spicy Chicken Ranch",
      "description": "Chicken pizza with ranch sauce, jalapeños, and tomatoes.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__24.png"
  },
  {
      "id": 25,
      "name": "Margherita",
      "description": "Classic pizza with tomato sauce and mozzarella.",
      "category": "Pizza",
      "price": "27.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__25.png"
  },
  {
      "id": 26,
      "name": "Pepperoni",
      "description": "Loaded with pepperoni and extra mozzarella.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__26.png"
  },
  {
      "id": 27,
      "name": "Super Papa",
      "description": "Pizza with three meats, vegetables, and olives.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__27.png"
  },
  {
      "id": 28,
      "name": "Chicken BBQ",
      "description": "Chicken pizza with BBQ sauce and vegetables.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__28.png"
  },
  {
      "id": 29,
      "name": "Hawaiian",
      "description": "Pizza with turkey ham, pineapple, and mozzarella.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__29.png"
  },
  {
      "id": 30,
      "name": "All The Meats™",
      "description": "Pizza with pepperoni, turkey ham, and sausage.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__30.png"
  },
  {
      "id": 31,
      "name": "Chicken Super Papa's",
      "description": "Chicken pizza with sausage, veggies, and black olives.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__31.png"
  },
  {
      "id": 32,
      "name": "Garden Special",
      "description": "Veggie pizza with tomatoes, mushrooms, olives, and peppers.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__32.png"
  },
  {
      "id": 33,
      "name": "Green Garden Delight",
      "description": "Spinach Alfredo pizza with veggies and mozzarella.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__33.png"
  },
  {
      "id": 34,
      "name": "Garlic Parmesan Chicken",
      "description": "Chicken pizza with garlic parmesan swirl and jalapeños.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__34.png"
  },
  {
      "id": 35,
      "name": "Chicken Florentine",
      "description": "Spinach Alfredo pizza with chicken, tomatoes, and mushrooms.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__35.png"
  },
  {
      "id": 36,
      "name": "Little Italy",
      "description": "Italian pizza with pepperoni, beef sausage, and olives.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__36.png"
  },
  {
      "id": 37,
      "name": "Mexican Ole",
      "description": "Fiery pizza with chicken, jalapeños, and tomatoes.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__37.png"
  },
  {
      "id": 38,
      "name": "Hot & Spicy",
      "description": "Spicy pizza with beef, jalapeños, and veggies.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__38.png"
  },
  {
      "id": 39,
      "name": "Fresh Spinach & Tomato Alfredo",
      "description": "Spinach Alfredo pizza with tomatoes and seasoning.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__39.png"
  },
  {
      "id": 40,
      "name": "Paneer Makhani",
      "description": "Indian-inspired pizza with paneer and Makhani sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__40.png"
  },
  {
      "id": 41,
      "name": "Double Cheddar Cheese Burger",
      "description": "Pizza with cheddar, beef, pickles, and burger sauce.",
      "category": "Pizza",
      "price": "31.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__41.png"
  },
  {
      "id": 42,
      "name": "Cheddar Chicken Club",
      "description": "Chicken pizza with cheddar, turkey ham, and ranch drizzle.",
      "category": "Pizza",
      "price": "31.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__42.png"
  },
  {
      "id": 43,
      "name": "Cheddar Makhani",
      "description": "Indian pizza with Makhani sauce and cheddar.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__43.png"
  },
  {
      "id": 44,
      "name": "Cheddar Cheese Feast",
      "description": "Cheese pizza with mozzarella and cheddar.",
      "category": "Pizza",
      "price": "31.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__44.png"
  },
  {
      "id": 45,
      "name": "Butter Chicken",
      "description": "Indian-inspired pizza with chicken and Makhani sauce.",
      "category": "Pizza",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__45.png"
  },
  {
      "id": 46,
      "name": "Cheddar Mexican Chicken",
      "description": "Chicken pizza with cheddar, jalapeños, and veggies.",
      "category": "Pizza",
      "price": "31.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__46.png"
  },
  {
      "id": 47,
      "name": "Plant Based Chicken Kofta",
      "description": "Vegan pizza with plant-based kofta, chili, and tomatoes.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__47.png"
  },
  {
      "id": 48,
      "name": "Plant Based Chicken BBQ",
      "description": "Vegan pizza with plant-based strips and BBQ drizzle.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__48.png"
  },
  {
      "id": 49,
      "name": "Plant Based Super Papa Chicken",
      "description": "Vegan pizza with plant-based chicken, olives, and veggies.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__49.png"
  },
  {
      "id": 50,
      "name": "Plant Based Chicken Mexican Ole",
      "description": "Vegan pizza with plant-based chicken, jalapeños, and tomatoes.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__50.png"
  },
  {
      "id": 51,
      "name": "Plant Based Cheese Green",
      "description": "Vegan pizza with spinach, mushrooms, and tomatoes.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__51.png"
  },
  {
      "id": 52,
      "name": "Plant Based Cheese Hot Pepper Passion",
      "description": "Vegan pizza with peppers, onions, and chili.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__52.png"
  },
  {
      "id": 53,
      "name": "Plant Based Cheese Margherita",
      "description": "Vegan Margherita pizza with vegan cheese.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__53.png"
  },
  {
      "id": 54,
      "name": "Plant Based Garden Special",
      "description": "Vegan pizza with tomatoes, mushrooms, and olives.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__54.png"
  },
  {
      "id": 55,
      "name": "Plant Based Spicy Garden Special",
      "description": "Vegan pizza with chilies, mushrooms, and olives.",
      "category": "Vegan Pizza",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__55.png"
  },
  {
      "id": 56,
      "name": "Create Your Own",
      "description": "Build your pizza with your favorite toppings.",
      "category": "Pizza",
      "price": "27.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__56.png"
  },
  {
      "id": 57,
      "name": "Starters Mix Box",
      "description": "Chicken wings, potato wedges, jalapeño poppers, and chocolate scrolls.",
      "category": "Starter",
      "price": "39.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__57.png"
  },
  {
      "id": 58,
      "name": "Cheddar Cheesesticks 14 pcs",
      "description": "Garlic dough with mozzarella and cheddar cheese.",
      "category": "Starter",
      "price": "24.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__58.png"
  },
  {
      "id": 59,
      "name": "Cheddar Rolls 4 pcs",
      "description": "Bite-sized rolls with cheddar and mozzarella.",
      "category": "Starter",
      "price": "16.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__59.png"
  },
  {
      "id": 60,
      "name": "Cheddar Rolls 8 pcs",
      "description": "Bite-sized rolls with cheddar and mozzarella.",
      "category": "Starter",
      "price": "24.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__60.png"
  },
  {
      "id": 61,
      "name": "Garlic Parmesan Breadsticks 6 pcs",
      "description": "Breadsticks with garlic sauce and parmesan.",
      "category": "Starter",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__61.png"
  },
  {
      "id": 62,
      "name": "Breadsticks 6 pcs",
      "description": "Golden brown oven-baked dough sticks.",
      "category": "Starter",
      "price": "10.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__62.png"
  },
  {
      "id": 63,
      "name": "Spicy Pepperoni Rolls 8 pcs",
      "description": "Pepperoni rolls with jalapeños and ranch sauce.",
      "category": "Starter",
      "price": "26.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__63.png"
  },
  {
      "id": 64,
      "name": "Chili Ranch Saucy Poppers 6 pcs",
      "description": "Chicken poppers tossed in chili ranch sauce.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__64.png"
  },
  {
      "id": 65,
      "name": "Chili Ranch Saucy Poppers 12 pcs",
      "description": "Chicken poppers tossed in chili ranch sauce.",
      "category": "Starter",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__65.png"
  },
  {
      "id": 66,
      "name": "Potato Wedges",
      "description": "Golden, crispy oven-baked wedges.",
      "category": "Side",
      "price": "13.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__66.png"
  },
  {
      "id": 67,
      "name": "Pepperoni Rolls 4 pcs",
      "description": "Pepperoni rolls with ranch sauce and mozzarella.",
      "category": "Starter",
      "price": "16.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__67.png"
  },
  {
      "id": 68,
      "name": "Pepperoni Rolls 8 pcs",
      "description": "Pepperoni rolls with ranch sauce and mozzarella.",
      "category": "Starter",
      "price": "24.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__68.png"
  },
  {
      "id": 69,
      "name": "Jalapeño Poppers 4 pcs",
      "description": "Creamy, spicy stuffed dough poppers.",
      "category": "Starter",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__69.png"
  },
  {
      "id": 70,
      "name": "Jalapeño Poppers 8 pcs",
      "description": "Creamy, spicy stuffed dough poppers.",
      "category": "Starter",
      "price": "20.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__70.png"
  },
  {
      "id": 71,
      "name": "Spicy Pepperoni Rolls 4 pcs",
      "description": "Pepperoni rolls with jalapeños and ranch sauce.",
      "category": "Starter",
      "price": "18.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__71.png"
  },
  {
      "id": 72,
      "name": "Firecracker Wings 4 pcs",
      "description": "Wings with a fiery chili blend.",
      "category": "Starter",
      "price": "22.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__72.png"
  },
  {
      "id": 73,
      "name": "Firecracker Wings 8 pcs",
      "description": "Wings with a fiery chili blend.",
      "category": "Starter",
      "price": "38.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__73.png"
  },
  {
      "id": 74,
      "name": "Firecracker Wings 12 pcs",
      "description": "Wings with a fiery chili blend.",
      "category": "Starter",
      "price": "52.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__74.png"
  },
  {
      "id": 75,
      "name": "Special Garlic Saucy Poppers 6 pcs",
      "description": "Chicken poppers in special garlic sauce.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__75.png"
  },
  {
      "id": 76,
      "name": "Special Garlic Saucy Poppers 12 pcs",
      "description": "Chicken poppers in special garlic sauce.",
      "category": "Starter",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__76.png"
  },
  {
      "id": 77,
      "name": "Chickenstrips 4 pcs",
      "description": "Breaded chicken strips, crispy and golden brown.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__77.png"
  },
  {
      "id": 78,
      "name": "Chickenstrips 8 pcs",
      "description": "Breaded chicken strips, crispy and golden brown.",
      "category": "Starter",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__78.png"
  },
  {
      "id": 79,
      "name": "Chicken Wings 4 pcs",
      "description": "Oven-baked, Italian seasoned chicken wings.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__79.png"
  },
  {
      "id": 80,
      "name": "Chicken Wings 8 pcs",
      "description": "Oven-baked, Italian seasoned chicken wings.",
      "category": "Starter",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__80.png"
  },
  {
      "id": 81,
      "name": "Chicken Wings 12 pcs",
      "description": "Oven-baked, Italian seasoned chicken wings.",
      "category": "Starter",
      "price": "49.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__81.png"
  },
  {
      "id": 82,
      "name": "Chicken Poppers 6 pcs",
      "description": "Lightly breaded, oven-baked chicken poppers.",
      "category": "Starter",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__82.png"
  },
  {
      "id": 83,
      "name": "Chicken Poppers 12 pcs",
      "description": "Lightly breaded, oven-baked chicken poppers.",
      "category": "Starter",
      "price": "22.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__83.png"
  },
  {
      "id": 84,
      "name": "Cheesesticks 8 pcs",
      "description": "Oven-baked dough with garlic and mozzarella.",
      "category": "Starter",
      "price": "15.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__84.png"
  },
  {
      "id": 85,
      "name": "Cheesesticks 14 pcs",
      "description": "Oven-baked dough with garlic and mozzarella.",
      "category": "Starter",
      "price": "20.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__85.png"
  },
  {
      "id": 86,
      "name": "Buffalo Saucy Poppers 6 pcs",
      "description": "Chicken poppers tossed in buffalo sauce.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__86.png"
  },
  {
      "id": 87,
      "name": "Buffalo Saucy Poppers 12 pcs",
      "description": "Chicken poppers tossed in buffalo sauce.",
      "category": "Starter",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__87.png"
  },
  {
      "id": 88,
      "name": "BBQ Saucy Poppers 6 pcs",
      "description": "Chicken poppers tossed in BBQ sauce.",
      "category": "Starter",
      "price": "19.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__88.png"
  },
  {
      "id": 89,
      "name": "BBQ Saucy Poppers 12 pcs",
      "description": "Chicken poppers tossed in BBQ sauce.",
      "category": "Starter",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__89.png"
  },
  {
      "id": 90,
      "name": "Papas Vegan Cheese Loaded Wedges",
      "description": "Wedges topped with vegan cheese and a dipping sauce.",
      "category": "Vegan Side",
      "price": "20.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__90.png"
  },
  {
      "id": 91,
      "name": "Vegan Cheese Wedges",
      "description": "Wedges with pizza sauce, vegan cheese, and veggies.",
      "category": "Vegan Side",
      "price": "15.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__91.png"
  },
  {
      "id": 92,
      "name": "Vegan Cheesesticks",
      "description": "14 pieces of dough topped with vegan cheese.",
      "category": "Vegan Side",
      "price": "25.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__92.png"
  },
  {
      "id": 93,
      "name": "Plant Based Pops 12 pcs",
      "description": "Spicy plant-based chicken pops with BBQ sauce.",
      "category": "Vegan Starter",
      "price": "30.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__93.png"
  },
  {
      "id": 94,
      "name": "Plant Based Pops 15 pcs",
      "description": "Spicy plant-based chicken pops with BBQ sauce.",
      "category": "Vegan Starter",
      "price": "35.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__94.png"
  },
  {
      "id": 95,
      "name": "New Year Buy1Get1 Medium",
      "description": "Buy 1 Medium Pizza, Get 1 Free!",
      "category": "Offer",
      "price": "46.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__95.png"
  },
  {
      "id": 96,
      "name": "New Year Buy1Get1 Large",
      "description": "Buy 1 Large Pizza, Get 1 Free!",
      "category": "Offer",
      "price": "64.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__96.png"
  },
  {
      "id": 97,
      "name": "Veggie Papadia",
      "description": "Fresh dough with ranch, veggies, and mozzarella.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__97.png"
  },
  {
      "id": 98,
      "name": "Spicy Italian Papadia",
      "description": "Papadia with sausage, pepperoni, and jalapeños.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__98.png"
  },
  {
      "id": 99,
      "name": "BBQ Chicken Papadia",
      "description": "Papadia with chicken, veggies, and BBQ drizzle.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__99.png"
  },
  {
      "id": 100,
      "name": "Spicy Chicken Ranch Papadia",
      "description": "Papadia with ranch, chicken, and jalapeños.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__100.png"
  },
  {
      "id": 101,
      "name": "Cheddar Chicken Club Papadia",
      "description": "Papadia with cheddar, chicken, and ranch drizzle.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__101.png"
  },
  {
      "id": 102,
      "name": "Cheddar Cheeseburger Papadia",
      "description": "Papadia with cheddar, beef, and pickles.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__102.png"
  },
  {
      "id": 103,
      "name": "Vegan Chicken Barbeque Papadia",
      "description": "Vegan papadia with BBQ chicken strips.",
      "category": "Vegan Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__103.png"
  },
  {
      "id": 104,
      "name": "Vegan Garden Party Papadia",
      "description": "Vegan papadia with mushrooms, olives, and peppers.",
      "category": "Vegan Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__104.png"
  },
  {
      "id": 105,
      "name": "Cheddar Mexican Chicken Papadia",
      "description": "Papadia with cheddar, chicken, and jalapeños.",
      "category": "Papadia",
      "price": "29.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__105.png"
  },
  {
      "id": 106,
      "name": "Veggie Pasta",
      "description": "Vegetable pasta in creamy Alfredo sauce.",
      "category": "Pasta",
      "price": "22.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__106.png"
  },
  {
      "id": 107,
      "name": "Chicken Florentine Pasta",
      "description": "Pasta with chicken, veggies, and Alfredo sauce.",
      "category": "Pasta",
      "price": "25.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__107.png"
  },
  {
      "id": 108,
      "name": "Chicken Tender Salad",
      "description": "Breaded chicken with greens, tomato, and cucumber.",
      "category": "Salad",
      "price": "25.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__108.png"
  },
  {
      "id": 109,
      "name": "Chocolate Scrolls 4 pcs",
      "description": "Fresh dough with chocolate spread and drizzle.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__109.png"
  },
  {
      "id": 110,
      "name": "Apple Pie Scrolls 4 pcs",
      "description": "Dough with apple filling and vanilla icing.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__110.png"
  },
  {
      "id": 111,
      "name": "Chocolate Scrolls 8 pcs",
      "description": "Fresh dough with chocolate spread and drizzle.",
      "category": "Dessert",
      "price": "15.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__111.png"
  },
  {
      "id": 112,
      "name": "Apple Pie Scrolls 8 pcs",
      "description": "Dough with apple filling and vanilla icing.",
      "category": "Dessert",
      "price": "15.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__112.png"
  },
  {
      "id": 113,
      "name": "Sprite [300ml]",
      "description": "Refreshing sparkling lemon-lime drink.",
      "category": "Cold Beverage",
      "price": "6.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__113.png"
  },
  {
      "id": 114,
      "name": "Fanta Orange [300ml]",
      "description": "Bright and bubbly orange soda.",
      "category": "Cold Beverage",
      "price": "6.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__114.png"
  },
  {
      "id": 115,
      "name": "Coca-Cola Zero [300ml]",
      "description": "Sugar-free classic Coke taste.",
      "category": "Cold Beverage",
      "price": "6.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__115.png"
  },
  {
      "id": 116,
      "name": "Sprite Zero [300ml]",
      "description": "Zero sugar sparkling lemon-lime soda.",
      "category": "Cold Beverage",
      "price": "6.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__116.png"
  },
  {
      "id": 117,
      "name": "Arwa Water 500ml",
      "description": "Refreshing, low-sodium bottled water.",
      "category": "Water",
      "price": "5.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__117.png"
  },
  {
      "id": 118,
      "name": "Coca-Cola [1.5L]",
      "description": "Classic Coke in a larger bottle.",
      "category": "Cold Beverage",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__118.png"
  },
  {
      "id": 119,
      "name": "Sprite [1.5L]",
      "description": "Refreshing sparkling lemon-lime drink.",
      "category": "Cold Beverage",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__119.png"
  },
  {
      "id": 120,
      "name": "Fanta Orange [1.5L]",
      "description": "Bright and bubbly orange soda.",
      "category": "Cold Beverage",
      "price": "12.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__120.png"
  },
  {
      "id": 121,
      "name": "Coca-Cola [2.26L]",
      "description": "Classic Coke in a family-size bottle.",
      "category": "Cold Beverage",
      "price": "Cold 14.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__121.png"
  },
  {
      "id": 122,
      "name": "Sprite [2.26L]",
      "description": "Refreshing sparkling lemon-lime drink.",
      "category": "Cold Beverage",
      "price": "14.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__122.png"
  },
  {
      "id": 123,
      "name": "Fanta Orange [2.26L]",
      "description": "Bright and bubbly orange soda.",
      "category": "Cold Beverage",
      "price": "14.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__123.png"
  },
  {
      "id": 124,
      "name": "Coca-Cola [300ml]",
      "description": "Classic Coke in a handy can.",
      "category": "Cold Beverage",
      "price": "6.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__124.png"
  },
  {
      "id": 125,
      "name": "Pepperoncini 2 pcs",
      "description": "Sweet green pickled chili peppers.",
      "category": "Extras",
      "price": "1.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__125.png"
  },
  {
      "id": 126,
      "name": "Special Garlic Dipping Sauce",
      "description": "Buttery garlic dipping sauce.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__126.png"
  },
  {
      "id": 127,
      "name": "Pizza Dipping Sauce",
      "description": "Rich tomato-based pizza sauce.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__127.png"
  },
  {
      "id": 128,
      "name": "Buffalo Dipping Sauce",
      "description": "Tangy, rich, and spicy sauce.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__128.png"
  },
  {
      "id": 129,
      "name": "BBQ Dipping Sauce",
      "description": "Smoky and sweet BBQ sauce.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__129.png"
  },
  {
      "id": 130,
      "name": "Ranch Dipping Sauce",
      "description": "Creamy ranch with a herb kick.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__130.png"
  },
  {
      "id": 131,
      "name": "Thousand Island Dressing",
      "description": "Tangy mayo and tomato dressing.",
      "category": "Extras",
      "price": "3.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__131.png"
  },
  {
      "id": 132,
      "name": "Special Seasoning Packet",
      "description": "Spicy seasoning with garlic and paprika.",
      "category": "Extras",
      "price": "1.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__132.png"
  },
  {
      "id": 133,
      "name": "Crushed Red Pepper Packet",
      "description": "Dried, spicy red chili flakes.",
      "category": "Extras",
      "price": "1.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__133.png"
  },
  {
      "id": 134,
      "name": "Heinz Tomato Ketchup Sachet",
      "description": "Handy ketchup sachet.",
      "category": "Extras",
      "price": "1.00 AED",
      "restaurant": "Papa Jones",
      "image": "/dunkin_papajones_frontend/papa_jones_images/image__134.png"
  },
  {
      "id": 135,
      "name": "Choco Overload Box of 6",
      "description": "Box of 6 donuts with choco overload.",
      "category": "Dessert",
      "price": "41.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__1.png"
  },
  {
      "id": 136,
      "name": "Choco Brownie Overload",
      "description": "Donut with brownie chunks and chocolate drizzle.",
      "category": "Dessert",
      "price": "8.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__2.png"
  },
  {
      "id": 137,
      "name": "Double Choco Overload",
      "description": "Donut with chocolate glaze and sprinkles.",
      "category": "Dessert",
      "price": "8.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__3.png"
  },
  {
      "id": 138,
      "name": "The Viral Pistachio Kunafa Box of 6",
      "description": "Box of 6 donuts with pistachio kunafa.",
      "category": "Dessert",
      "price": "47.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__4.png"
  },
  {
      "id": 139,
      "name": "The Viral Pistachio Kunafa Donut",
      "description": "Donut with pistachio kunafa and crushed pistachios.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__5.png"
  },
  {
      "id": 140,
      "name": "Nutella Donut Box of 6",
      "description": "Box of 6 Nutella donuts in assorted flavors.",
      "category": "Dessert",
      "price": "45.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__6.png"
  },
  {
      "id": 141,
      "name": "Nutella Munchkins - 10 pieces",
      "description": "Bite-sized delights filled with creamy Nutella.",
      "category": "Dessert",
      "price": "15.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__7.png"
  },
  {
      "id": 142,
      "name": "Nutella Wonder Star",
      "description": "Star-shaped donut filled with Nutella and brownie chunks.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__8.png"
  },
  {
      "id": 143,
      "name": "Choco Surprise",
      "description": "Nutella frosted donut topped with a chocolate munchkin.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__9.png"
  },
  {
      "id": 144,
      "name": "Dream Cake",
      "description": " cake donut with Nutella frosting and hazelnuts.",
      "category": "Dessert",
      "price": "9.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__10.png"
  },
  {
      "id": 145,
      "name": "Nutella Frappe",
      "description": "Rich Nutella frappe topped with whipped cream.",
      "category": "Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__11.png"
  },
  {
      "id": 146,
      "name": "Nutella Croissant",
      "description": "Golden croissant filled with creamy Nutella.",
      "category": "Dessert",
      "price": "15.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__12.png"
  },
  {
      "id": 147,
      "name": "Nutella Hot Chocolate",
      "description": "Velvety hot chocolate infused with Nutella.",
      "category": "Hot Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__13.png"
  },
  {
      "id": 148,
      "name": "Bubble Tea",
      "description": "Brown sugar milk tea with boba.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__14.png"
  },
  {
      "id": 149,
      "name": "Hami Melon Bubble Tea",
      "description": "Milk tea with Hami melon and boba.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__15.png"
  },
  {
      "id": 150,
      "name": "Taro Bubble Tea",
      "description": "Milk tea with taro flavor and boba.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__16.png"
  },
  {
      "id": 151,
      "name": "Matcha Bubble Tea",
      "description": "Milk tea with matcha and boba.",
      "category": "Cold Beverage",
      "price": "24.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__17.png"
  },
  {
      "id": 152,
      "name": "Iced Americano",
      "description": "Dairy and sugar-free iced coffee.",
      "category": "Cold Beverage",
      "price": "16.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__18.png"
  },
  {
      "id": 153,
      "name": "Iced Tea",
      "description": "Refreshing iced tea.",
      "category": "Cold Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__19.png"
  },
  {
      "id": 154,
      "name": "Shaken Iced Espresso",
      "description": "Smooth iced espresso shaken for flavor.",
      "category": "Cold Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__20.png"
  },
  {
      "id": 155,
      "name": "Iced Latte",
      "description": "Dairy and sugar-free iced latte.",
      "category": "Cold Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__21.png"
  },
  {
      "id": 156,
      "name": "Iced Coffee (Drip Coffee)",
      "description": "Dairy and sugar-free drip coffee.",
      "category": "Cold Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__22.png"
  },
  {
      "id": 157,
      "name": "Iced Spanish Latte",
      "description": "Creamy iced Spanish latte.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__23.png"
  },
  {
      "id": 158,
      "name": "Iced Chocolate",
      "description": "Refreshing iced chocolate drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__24.png"
  },
  {
      "id": 159,
      "name": "Iced Caramel Macchiato",
      "description": "Iced coffee with caramel flavor.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__25.png"
  },
  {
      "id": 160,
      "name": "Iced Mocha",
      "description": "Iced coffee with a hint of mocha.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__26.png"
  },
  {
      "id": 161,
      "name": "Iced French Vanilla Latte",
      "description": "Iced latte with French vanilla flavor.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__27.png"
  },
  {
      "id": 162,
      "name": "Iced Matcha Green Tea",
      "description": "Iced tea with matcha flavor.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__28.png"
  },
  {
      "id": 163,
      "name": "Strawberry & Cream Frappe",
      "description": "Strawberry frappe served without whipped cream.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__29.png"
  },
  {
      "id": 164,
      "name": "Cookies & Cream Frappe - Made with Oreo",
      "description": "Oreo frappe served without whipped cream.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__30.png"
  },
  {
      "id": 165,
      "name": "Strawberry Cheesecake Crush Frappe",
      "description": "Creamy strawberry cheesecake frappe.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__31.png"
  },
  {
      "id": 166,
      "name": "Double Chocolate Frappe",
      "description": "Rich chocolate frappe without whipped cream.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__32.png"
  },
  {
      "id": 167,
      "name": "Banana Blueberry Frappe",
      "description": "Fruity frappe with banana and blueberry.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__33.png"
  },
  {
      "id": 168,
      "name": "Boston Kreme Frappe",
      "description": "Boston kreme frappe blended with milk and ice.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__34.png"
  },
  {
      "id": 169,
      "name": "Caramel Frappe",
      "description": "Caramel frappe served without whipped cream.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__35.png"
  },
  {
      "id": 170,
      "name": "Madagascar Vanilla Frappe",
      "description": "Vanilla frappe served without whipped cream.",
      "category": "Cold Beverage",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__36.png"
  },
  {
      "id": 171,
      "name": "Lotus Cheesecake Dream Frappe",
      "description": "Blended Lotus Biscoff with cheesecake and milk.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__37.png"
  },
  {
      "id": 172,
      "name": "Dulce De Leche Frappe",
      "description": "Rich and creamy indulgent Dulce De Leche frappe.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__38.png"
  },
  {
      "id": 173,
      "name": "Matcha Frappe",
      "description": "Matcha frappe served without whipped cream.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__39.png"
  },
  {
      "id": 174,
      "name": "Mango Cheesecake Bliss Frappe",
      "description": "Mango cheesecake frappe for fruity delight.",
      "category": "Cold Beverage",
      "price": "22.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__40.png"
  },
  {
      "id": 175,
      "name": "Chicken Tikka Lunch Combo",
      "description": "Sandwich, refresher, and fresh donut combo.",
      "category": "Meal Deal",
      "price": "52.73 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__41.png"
  },
  {
      "id": 176,
      "name": "Spicy Cheese Lunch Combo",
      "description": "Sandwich, refresher, and fresh donut combo.",
      "category": "Meal Deal",
      "price": "52.73 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__42.png"
  },
  {
      "id": 177,
      "name": "Turkey & Cheese Lunch Combo",
      "description": "Sandwich, refresher, and fresh donut combo.",
      "category": "Meal Deal",
      "price": "52.73 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__43.png"
  },
  {
      "id": 178,
      "name": "Chicken Tikka Sourdough Meal",
      "description": "Chicken Tikka sandwich with coffee.",
      "category": "Meal Deal",
      "price": "28.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__44.png"
  },
  {
      "id": 179,
      "name": "Spicy Cheese Sandwich Meal",
      "description": "Paneer Tikka sandwich with coffee.",
      "category": "Meal Deal",
      "price": "28.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__45.png"
  },
  {
      "id": 180,
      "name": "Turkey & Cheese Sourdough Meal",
      "description": "Turkey & cheese sandwich with coffee.",
      "category": "Meal Deal",
      "price": "28.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__46.png"
  },
  {
      "id": 181,
      "name": "Build Your Own Double Egg Sandwich Combo",
      "description": "Egg sandwich and coffee combo.",
      "category": "Meal Deal",
      "price": "25.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__47.png"
  },
  {
      "id": 182,
      "name": "Egg Sandwich Combo",
      "description": "Egg sandwich and any coffee.",
      "category": "Meal Deal",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__48.png"
  },
  {
      "id": 183,
      "name": "Cream Cheese Bagel Combo",
      "description": "Bagel with cream cheese and coffee.",
      "category": "Meal Deal",
      "price": "19.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__49.png"
  },
  {
      "id": 184,
      "name": "Plain Croissant Combo",
      "description": "Plain croissant with any coffee.",
      "category": "Meal Deal",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__50.png"
  },
  {
      "id": 185,
      "name": "Cheese Croissant Combo",
      "description": "Cheese croissant with any coffee.",
      "category": "Meal Deal",
      "price": "21.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__51.png"
  },
  {
      "id": 186,
      "name": "Turkey and Cheese Croissant Combo",
      "description": "Turkey & cheese croissant with coffee.",
      "category": "Meal Deal",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__52.png"
  },
  {
      "id": 187,
      "name": "Happy Birthday Dozen Box",
      "description": "Celebrate with 12 freshly-made donuts.",
      "category": "Gifting Box",
      "price": "58.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__53.png"
  },
  {
      "id": 188,
      "name": "Thank You Dozen Box",
      "description": "Say thanks with 12 handcrafted donuts.",
      "category": "Gifting Box",
      "price": "58.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__54.png"
  },
  {
      "id": 189,
      "name": "Congrats Dozen Box",
      "description": "Celebrate with 12 freshly-handcrafted donuts.",
      "category": "Gifting Box",
      "price": "58.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__55.png"
  },
  {
      "id": 190,
      "name": "2 Dozen Donuts",
      "description": "Enjoy 24 fresh, hand-made donuts.",
      "category": "Special Offers",
      "price": "99.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__56.png"
  },
  {
      "id": 191,
      "name": "Dozen Donuts Buy 8 get 4 Free",
      "description": "12 freshly handcrafted donuts.",
      "category": "Special Offers",
      "price": "56.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__57.png"
  },
  {
      "id": 192,
      "name": "Half Dozen Donuts (Buy 5 get 1 Free)",
      "description": "6 freshly hand-made donuts.",
      "category": "Special Offers",
      "price": "35.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__58.png"
  },
  {
      "id": 193,
      "name": "Assorted Box Of 12 Buy 8 Get 4 Free",
      "description": "12 assorted fresh donuts.",
      "category": "Special Offers",
      "price": "56.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__59.png"
  },
  {
      "id": 194,
      "name": "Assorted Box of 6 (Buy 5 get 1 Free)",
      "description": "6 assorted fresh donuts.",
      "category": "Special Offers",
      "price": "35.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__60.png"
  },
  {
      "id": 195,
      "name": "Box Of 3 Donuts",
      "description": "Enjoy 3 freshly-made donuts.",
      "category": "Special Offers",
      "price": "19.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__61.png"
  },
  {
      "id": 196,
      "name": "Munchkins Bundle",
      "description": "20 munchkins with a medium coffee box.",
      "category": "Dessert Bundles",
      "price": "52.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__62.png"
  },
  {
      "id": 197,
      "name": "Family Deal",
      "description": "Perfect meal for the family.",
      "category": "Dessert Bundles",
      "price": "59.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__63.png"
  },
  {
      "id": 198,
      "name": "Super Family Deal",
      "description": "12 donuts + 4 coffee servings.",
      "category": "Dessert Bundles",
      "price": "71.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__64.png"
  },
  {
      "id": 199,
      "name": "Dunkin' Medium Coffee Box Serves 4",
      "description": "Coffee box for 4 servings.",
      "category": "Dessert Bundles",
      "price": "32.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__65.png"
  },
  {
      "id": 200,
      "name": "Dunkin' Large Coffee Box Serves 10",
      "description": "Coffee box for 10 servings.",
      "category": "Dessert Bundles",
      "price": "99.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__66.png"
  },
  {
      "id": 201,
      "name": "Wow Deal For 1",
      "description": "Hot/Cold Medium Coffee with 2 donuts.",
      "category": "Combo",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__67.png"
  },
  {
      "id": 202,
      "name": "Assorted Freshly Made Munchkins 10 Pcs",
      "description": "10 assorted munchkins in pre-selected flavors.",
      "category": "Dessert Snack",
      "price": "12.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__68.png"
  },
  {
      "id": 203,
      "name": "Freshly Made Munchkins 20pcs",
      "description": "20 assorted munchkins with various flavors.",
      "category": "Dessert Snack",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__69.png"
  },
  {
      "id": 204,
      "name": "Espresso Double",
      "description": "Rich double espresso shot.",
      "category": "Hot Beverage",
      "price": "13.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__70.png"
  },
  {
      "id": 205,
      "name": "Americano",
      "description": "Smooth, rich Americano coffee.",
      "category": "Cold Beverage",
      "price": "16.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__71.png"
  },
  {
      "id": 206,
      "name": "Tea",
      "description": "Classic tea blend.",
      "category": "Hot Beverage",
      "price": "16.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__72.png"
  },
  {
      "id": 207,
      "name": "Cappuccino",
      "description": "Creamy cappuccino with frothy milk.",
      "category": "Hot Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__73.png"
  },
  {
      "id": 208,
      "name": "Latte",
      "description": "Smooth latte with steamed milk.",
      "category": "Cold Beverage",
      "price": "18.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__74.png"
  },
  {
      "id": 209,
      "name": "Spanish Latte",
      "description": "Rich latte with Spanish flavors.",
      "category": "Cold Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__75.png"
  },
  {
      "id": 210,
      "name": "Matcha Green Tea Latte",
      "description": "Green tea latte with matcha flavors.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__76.png"
  },
  {
      "id": 211,
      "name": "Hot Chocolate",
      "description": "Rich, creamy hot chocolate.",
      "category": "Hot Beverage",
      "price": "23.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__77.png"
  },
  {
      "id": 212,
      "name": "Dulce De Leche Latte",
      "description": "Sweet latte with Dulce De Leche flavors.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__78.png"
  },
  {
      "id": 213,
      "name": "Dunkin Original Coffee",
      "description": "Classic Dunkin coffee blend.",
      "category": "Hot Beverage",
      "price": "11.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__79.png"
  },
  {
      "id": 214,
      "name": "Caramel Macchiato",
      "description": "Sweet caramel coffee blend.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__80.png"
  },
  {
      "id": 215,
      "name": "French Vanilla Latte",
      "description": "Classic latte with French vanilla.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__81.png"
  },
  {
      "id": 216,
      "name": "Mocha",
      "description": "Rich mocha coffee blend.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontenddunkin_dubai_images/image__82.png"
  },
  {
      "id": 217,
      "name": "Peach Refresher",
      "description": "Fruity and refreshing peach drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__83.png"
  },
  {
      "id": 218,
      "name": "Strawberry Refresher",
      "description": "Fruity and refreshing strawberry drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__84.png"
  },
  {
      "id": 219,
      "name": "Blue Lagoon Refresher",
      "description": "Refreshing blue lagoon drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__85.png"
  },
  {
      "id": 220,
      "name": "Watermelon Refresher",
      "description": "Fruity watermelon drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__86.png"
  },
  {
      "id": 221,
      "name": "Mango Refresher",
      "description": "Tropical mango drink.",
      "category": "Cold Beverage",
      "price": "20.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__87.png"
  },
  {
      "id": 222,
      "name": "Sugared Donut",
      "description": "Classic sugared donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__88.png"
  },
  {
      "id": 223,
      "name": "Glazed Donut",
      "description": "Soft glazed donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__89.png"
  },
  {
      "id": 224,
      "name": "Choco Frosted Donut",
      "description": "Chocolate frosted donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__90.png"
  },
  {
      "id": 225,
      "name": "Strawberry Frosted Donut",
      "description": "Strawberry frosted donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__91.png"
  },
  {
      "id": 226,
      "name": "Bavarian Donut",
      "description": "Cream-filled Bavarian donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__92.png"
  },
  {
      "id": 227,
      "name": "Chocolate Sprinkles Donut",
      "description": "Donut with chocolate sprinkles.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__93.png"
  },
  {
      "id": 228,
      "name": "Cinnamon Roll",
      "description": "Classic cinnamon roll.",
      "category": "Pastry",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__94.png"
  },
  {
      "id": 229,
      "name": "Blue Marble Donut",
      "description": "Blue marble-styled donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__95.png"
  },
  {
      "id": 230,
      "name": "Boston Kreme Donut",
      "description": "Boston Kreme-filled donut.",
      "category": "Donut",
      "price": "7.00 AED",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__96.png"
  },
  {
      "id": 231,
      "name": "Chocolate Eclair",
      "description": "",
      "category": null,
      "price": "AED 8",
      "restaurant": "Dunkin Dubai",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__97.png"
  },
  {
      "id": 232,
      "name": "Vanilla All",
      "description": "",
      "category": "Pastry",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__98.png"
  },
  {
      "id": 233,
      "name": "Choco Wacko Donut",
      "description": "Choco Wacko Donut",
      "category": "Donut",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__99.png"
  },
  {
      "id": 234,
      "name": "Cookies & Cream Made with Oreo",
      "description": "",
      "category": "Donut",
      "price": "AED 8",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__100.png"
  },
  {
      "id": 235,
      "name": "Choco Butternut Donut",
      "description": "",
      "category": "Donut",
      "price": "AED 8",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__101.png"
  },
  {
      "id": 236,
      "name": "Chicken Tikka Sourdough",
      "description": "Enjoy the bold flavors of our freshly made Chicken Tikka Sourdough Sandwich with juicy chicken tikka, creamy mayonnaise, zesty sriracha, and melted cheese.",
      "category": "Sandwich",
      "price": "AED 23",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__102.png"
  },
  {
      "id": 237,
      "name": "Spicy Cheese Sandwich",
      "description": "Paneer Tikka Sourdough Sandwich with creamy mayonnaise, spicy sriracha, and gooey cheese.",
      "category": "Sandwich",
      "price": "AED 23",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__103.png"
  },
  {
      "id": 238,
      "name": "Egg Sandwich",
      "description": "Egg sandwich with your choice of sauce and optional cheese.",
      "category": "Sandwich",
      "price": "AED 14",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__104.png"
  },
  {
      "id": 239,
      "name": "Double Egg Bagel",
      "description": "",
      "category": "Bagel",
      "price": "AED 18",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__105.png"
  },
  {
      "id": 240,
      "name": "Cream Cheese Bagel",
      "description": "Bagel with cream cheese filling.",
      "category": "Bagel",
      "price": "AED 14",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__106.png"
  },
  {
      "id": 241,
      "name": "Cheese Croissant",
      "description": "Cheese in a flaky buttery croissant.",
      "category": "Pastry",
      "price": "AED 16",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__107.png"
  },
  {
      "id": 242,
      "name": "Double Egg Croissant",
      "description": "",
      "category": "Pastry",
      "price": "AED 18",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__108.png"
  },
  {
      "id": 243,
      "name": "Turkey & Cheese Sourdough",
      "description": "",
      "category": "Sandwich",
      "price": "AED 21",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__109.png"
  },
  {
      "id": 244,
      "name": "Double Egg Potato Bun Sandwich",
      "description": "Choice of double egg sandwich with your choice of sauce and optional cheese.",
      "category": "Sandwich",
      "price": "AED 18",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__110.png"
  },
  {
      "id": 245,
      "name": "Egg Croissant",
      "description": "",
      "category": "Pastry",
      "price": "AED 14",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__111.png"
  },
  {
      "id": 246,
      "name": "Turkey and Cheese Croissant",
      "description": "Turkey and cheese in a flaky buttery croissant.",
      "category": "Pastry",
      "price": "AED 18",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__112.png"
  },
  {
      "id": 247,
      "name": "Plain Croissant",
      "description": "Made with layers of flaky and buttery pastry dough.",
      "category": "Pastry",
      "price": "AED 11",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__113.png"
  },
  {
      "id": 248,
      "name": "Sandwiches",
      "description": "Chicken Caesar Wrap",
      "category": "Sandwich",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__114.png"
  },
  {
      "id": 249,
      "name": "Halloumi & Avocado Muffin",
      "description": "",
      "category": "Muffin",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__115.png"
  },
  {
      "id": 250,
      "name": "Cheese Toastie",
      "description": "",
      "category": "Toast",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__116.png"
  },
  {
      "id": 251,
      "name": "Grilled Chicken Pesto",
      "description": "",
      "category": "Sandwich",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__117.png"
  },
  {
      "id": 252,
      "name": "Roasted Beef",
      "description": "",
      "category": "Sandwich",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__118.png"
  },
  {
      "id": 253,
      "name": "Tuna Melt",
      "description": "",
      "category": "Sandwich",
      "price": "AED 24",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__119.png"
  },
  {
      "id": 254,
      "name": "Bakery",
      "description": "Walnut Brownies made with walnuts, dense, fudgy, and with a chewy texture. The walnuts add a nutty flavor and crunch.",
      "category": "Bakery",
      "price": "AED 10",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__120.png"
  },
  {
      "id": 255,
      "name": "Chocolate Muffins with Filling",
      "description": "Mixed with chocolate chips and filled with chocolate sauce.",
      "category": "Muffin",
      "price": "AED 13",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__121.png"
  },
  {
      "id": 256,
      "name": "Blueberry Muffins with Filling",
      "description": "",
      "category": "Muffin",
      "price": "AED 13",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__122.png"
  },
  {
      "id": 257,
      "name": "Brew At Home",
      "description": "Dunkin Espresso Capsules - Signature Blend (10 Capsules). Smooth and flavorful medium-dark roast espresso.",
      "category": "Beverage Capsules",
      "price": "AED 21.50",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__123.png"
  },
  {
      "id": 258,
      "name": "Dunkin Espresso Capsules - Light Roast (10 Capsules)",
      "description": "Bright and balanced taste. Recommended anytime of the day.",
      "category": "Beverage Capsules",
      "price": "AED 21.50",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__124.png"
  },
  {
      "id": 259,
      "name": "Dunkin Espresso Capsules - Bold Roast (10 Capsules)",
      "description": "A deliciously smooth dark-roasted espresso with a robust finish.",
      "category": "Beverage Capsules",
      "price": "AED 21.50",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__125.png"
  },
  {
      "id": 260,
      "name": "Hazelnut (Ground)",
      "description": "100% Arabica Coffee.",
      "category": "Beverages Capsules",
      "price": "AED 51",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__126.png"
  },
  {
      "id": 261,
      "name": "Original Blend (Whole Bean)",
      "description": "100% Arabica Coffee.",
      "category": "Beverages Capsules",
      "price": "AED 51",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__127.png"
  },
  {
      "id": 262,
      "name": "Dark Roast Ground",
      "description": "100% Arabica Coffee.",
      "category": "Beverages Capsules",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__128.png"
  },
  {
      "id": 263,
      "name": "Original Blend (Ground)",
      "description": "100% Arabica Coffee.",
      "category": "Beverages Capsules",
      "price": "AED 51",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__129.png"
  },
  {
      "id": 264,
      "name": "Other Beverages",
      "description": "Water",
      "category": "Water",
      "price": "AED 6",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__130.png"
  },
  {
      "id": 265,
      "name": "BLU - Sparkling Water",
      "description": "",
      "category": "Beverages",
      "price": "AED 8",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__131.png"
  },
  {
      "id": 266,
      "name": "Fresh Orange Juice",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 13",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__132.png"
  },
  {
      "id": 267,
      "name": "Coke",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__133.png"
  },
  {
      "id": 268,
      "name": "Sprite",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__134.png"
  },
  {
      "id": 269,
      "name": "Fanta",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__135.png"
  },
  {
      "id": 270,
      "name": "Diet Coke",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 7",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__136.png"
  },
  {
      "id": 271,
      "name": "Red Bull",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 17",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__137.png"
  },
  {
      "id": 272,
      "name": "Red Bull - Sugar Free",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 17",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__138.png"
  },
  {
      "id": 273,
      "name": "Red Bull - Red Edition",
      "description": "",
      "category": "Cold Beverages",
      "price": "AED 17",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__139.png"
  },
  {
      "id": 274,
      "name": "Stainless Thermos Bottle White 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__140.png"
  },
  {
      "id": 275,
      "name": "Stainless Thermos Bottle Pink 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__141.png"
  },
  {
      "id": 276,
      "name": "Stainless Thermos Bottle Gold 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__142.png"
  },
  {
      "id": 277,
      "name": "Stainless Thermos Bottle Orange 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__143.png"
  },
  {
      "id": 278,
      "name": "Double Walled Water Bottle White 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__144.png"
  },
  {
      "id": 279,
      "name": "Double Walled Water Bottle Pink 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__145.png"
  },
  {
      "id": 280,
      "name": "Double Walled Water Bottle Gold 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__146.png"
  },
  {
      "id": 281,
      "name": "Double Walled Water Bottle Orange 500ML",
      "description": "",
      "category": "Bottle Merchandise",
      "price": "AED 61",
      "restaurant": "Dunkin Donut",
      "image": "/dunkin_papajones_frontend/dunkin_dubai_images/image__143.png"
  },
]

  useEffect(() => {   
    const welcomeMessages = [
      {
        sender: "bot",
        text: "👋 Welcome to gobblHODL! I'm your personal food ordering assistant.",
      },
      {
        sender: "bot",
        text: "You can interact with me in several ways:",
      },
      {
        sender: "bot",
        text:
          "• Upload an image, and I'll recommend a food bundle customized for you.\n" +
          "• Order directly through chat by telling me what you'd like to eat.\n" +
          "• Enjoy a discount if you pay with your crypto wallet!",
      },
      { sender: "bot", text: "What would you feel like to eat today? 🍕" },
    ];
    setMessages(welcomeMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
    }, [messages]);

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        setUploadedImage(file);
    }
};
  
  const getClosestRoadPoint = (x, y) => {
    // Get closest point on the road network
    const roads = [
      { y: 20 }, // Horizontal roads
      { y: 50 },
      { y: 80 },
      { x: 20 }, // Vertical roads
      { x: 50 },
      { x: 80 }
    ];
    
    // Find closest horizontal and vertical roads
    const closestHorizontal = roads.slice(0, 3)
      .reduce((closest, road) => 
        Math.abs(road.y - y) < Math.abs(closest.y - y) ? road : closest
      );
      
    const closestVertical = roads.slice(3)
      .reduce((closest, road) => 
        Math.abs(road.x - x) < Math.abs(closest.x - x) ? road : closest
      );
      
    return {
      x: closestVertical.x,
      y: closestHorizontal.y
    };
  };

  const handleOrder = useCallback((orderDetails, bundlePrice) => {
    // Generate random delivery coordinates
    const rawX = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
    const rawY = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
  
    // Snap to nearest road intersection
    const deliveryLocation = getClosestRoadPoint(rawX, rawY);
    const orderId = Date.now();
  
    const newOrder = {
      id: orderId,
      ...orderDetails,
      location: deliveryLocation,
      status: 'preparing',
      price: bundlePrice, // Use the passed bundle price
    };
  
    // Show "Proceeding to Payment..." Toast
    toast.success("Proceeding to payment...");
  
    // Delay the payment completion logic
    setTimeout(() => {
      // Update state for payment and order
      setState((prev) => ({
        ...prev,
        orders: [...prev.orders, newOrder],
        payments: {
          ...prev.payments,
          totalRevenue: prev.payments.totalRevenue + parseFloat(bundlePrice),
          completedPayments: prev.payments.completedPayments + parseFloat(bundlePrice),
        },
      }));
  
      // Reflect payment completion in accounting
      addMessage(
        "accounting",
        `Payment completed for ${orderDetails.item} bundle: AED ${bundlePrice}`
      );
  
      // Show "Payment Completed!" Toast
      toast.success("Payment completed!");
  
      // Send Consumer message
      addMessage("consumer", `New order received: ${newOrder.item} bundle`);
  
      // Send Restaurant message
      addMessage("restaurant", `Preparing ${newOrder.item} bundle`);
  
      // Update bot messages
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Your order for ${newOrder.item} bundle.` },
      ]);
  
      // Start delivery after prep time
      setTimeout(() => {
        const deliveryOrder = { ...newOrder, status: "delivering" };
        setActiveDelivery(deliveryOrder);
  
        addMessage("restaurant", `Order ready: ${orderDetails.item} bundle`);
        addMessage("delivery", `Starting delivery for ${orderDetails.item} bundle.`);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Your ${orderDetails.item} bundle is out for delivery!`,
          },
        ]);
  
        // Complete delivery after delivery time
        setTimeout(() => {
          setActiveDelivery(null);
          setState((prev) => ({
            ...prev,
            orders: prev.orders.map((order) =>
              order.id === orderId
                ? { ...order, status: "delivered", awaitingReview: true }
                : order
            ),
          }));
  
          addMessage("delivery", `Delivery completed for ${orderDetails.item} bundle!`);
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: `Your ${orderDetails.item}bundle has been delivered. Enjoy your meal!` },
            {
              sender: "bot",
              text: `We'd love to hear your feedback! Please provide a rating (1-5) and a short review for your ${orderDetails.item}.`,
            },
          ]);
        }, DELIVERY_TIME);
      }, PREP_TIME);
    }, 3000); // 3-second delay for payment completion
  }, [addMessage]);

  const analyzePizzaRequest = async (userQuery) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pizza-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userQuery }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }
  
      const data = await response.json(); // Parse JSON response
      setErrorOccurred(false);
      return data; // Return data to be used in the frontend
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setErrorOccurred(true);
      return {
        recommendations: [],
        explanation: 'Unable to process your request. Please try again later.',
      };
    }
  };


  const processReview = useCallback((input) => {
    const pendingReviewOrder = state.orders.find(order => order.awaitingReview);
    
    if (!pendingReviewOrder) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "No active order found to review. Please try again." 
      }]);
      return;
    }

    const ratingMatch = input.match(/\b[1-5]\b/);
    const rating = ratingMatch ? parseInt(ratingMatch[0], 10) : null;
    const review = input.replace(/\b[1-5]\b/, "").trim();

    if (!rating || !review) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Please provide both a valid rating (1-5) and a review."
      }]);
      return;
    }

    setState(prev => ({
      ...prev,
      orders: prev.orders.map(order => 
        order.id === pendingReviewOrder.id 
          ? { ...order, awaitingReview: false }
          : order
      ),
      reviews: [...prev.reviews, {
        orderId: pendingReviewOrder.id,
        item: pendingReviewOrder.item,
        rating,
        review,
        timestamp: new Date().toLocaleString()
      }]
    }));

    setMessages(prev => [...prev, {
      sender: "bot",
      text: `Thank you for your ${rating}-star review of ${pendingReviewOrder.item}!`
    },
    {
      sender: "bot",
      text: "What would you like to order next? 🍕",
    }]);
  }, [state.orders]);

  const sendMessage = useCallback(async (isImageUpload = false) => {
    if (!input.trim() && !isImageUpload) return;
  
    if (isImageUpload && uploadedImage) {
      const userMessage = {
        sender: "user",
        text: "📸 Uploaded an image for bundle recommendation",
      };
      setMessages((prev) => [...prev, userMessage]);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Analyzing your image to create the perfect bundle...",
        },
      ]);
      await analyzeImage(uploadedImage);
      setInput("");
      return;
    }
  
    const userMessage = {
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
  
    const lastBotMessage = [...messages]
      .reverse()
      .find((msg) => msg.sender === "bot");
    const isAwaitingReview =
      lastBotMessage?.text.includes(
        "Please provide a rating (1-5) and a short review"
      );
  
    if (isAwaitingReview) {
      processReview(input);
      setInput("");
      return;
    }
  
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Typing...", isTyping: true },
    ]);
  
    try {
      const analysis = await analyzePizzaRequest(input);
  
      const recommendedPizzas = analysis.recommendations.map((id) =>
        pizzas.find((pizza) => pizza.id === id)
      );
  
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          sender: "bot",
          text: analysis.explanation || "Here are some pizzas you might like:",
          suggestions: recommendedPizzas,
        },
      ]);
    } catch (error) {
      console.error("Error processing request:", error);
  
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          sender: "bot",
          text: "I apologize, but I encountered an error processing your request. Let me show you our popular options instead.",
          suggestions: pizzas.slice(0, 4),
        },
      ]);
    }
  
    setInput("");
  }, [input, uploadedImage, processReview, messages, analyzePizzaRequest, pizzas]);
  
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col">
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
  
      {/* Main Section */}
      <main className="flex-grow grid grid-cols-3 gap-4 p-4">
        {/* Chatbot Section */}
        <div className="col-span-1 border-4 border-green-400 rounded-lg p-6 bg-gray-800 flex flex-col h-full shadow-lg">
          <div className="h-[70vh] overflow-y-auto mb-2 w-full">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <p className={`inline-block p-3 rounded-lg transition-all duration-300 ${msg.sender === "user" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  {msg.text}
                </p>
                {msg.suggestions && (
                  <div className="mt-4">
                  {!errorOccurred ? (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {msg.suggestions.map((pizza) => (
                          <div
                            key={pizza.id}
                            className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center hover:shadow-xl transition-transform transform hover:scale-105"
                          >
                            <img
                              src={pizza.image}
                              alt={pizza.name}
                              className="w-24 h-24 rounded-full mr-4"
                            />
                            <div>
                              <h4 className="text-lg font-bold mb-1">{pizza.name}</h4>
                              <p className="text-sm text-gray-400 mb-1">{pizza.description}</p>
                              <p className="text-sm text-green-400 font-bold">{pizza.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                
                      <div className="mt-4 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                        <div className="flex items-center">
                          <Store className="text-green-400 mr-3" size={20} />
                          <h3 className="text-xl text-white">
                            Restaurant: {msg.suggestions[0]?.restaurant || "Restaurant Name"}
                          </h3>
                        </div>
                      </div>
                
                      <div className="mt-4 p-6 bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
                        <div className="flex items-center mb-2">
                          <DollarSign className="text-gray-400 mr-3" size={20} />
                          <p className="text-lg text-gray-400 font-bold line-through">
                            Regular Price: AED{" "}
                            {msg.suggestions.reduce((sum, pizza) => sum + (parseFloat(pizza.price) || 0), 0).toFixed(2)}
                          </p>
                        </div>
                
                        <div className="flex items-center">
                          <Package className="text-green-400 mr-3" size={20} />
                          <p className="text-lg text-green-400 font-bold">
                            Bundle Price: AED{" "}
                            {(msg.suggestions.reduce((sum, pizza) => sum + (parseFloat(pizza.price) || 0), 0) * 0.95).toFixed(2)}
                          </p>
                        </div>
                      </div>
                
                      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex justify-around mb-4">
                          <button
                            onClick={() => {
                              setPaymentMethod("card");
                              toast.success("Card payment method selected!");
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                              paymentMethod === "card"
                                ? "bg-green-500 text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            <CreditCard size={20} />
                            <span>Card</span>
                          </button>
                
                          <button
                            onClick={() => {
                              setPaymentMethod("crypto");
                              toast.success("Crypto payment method selected!");
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                              paymentMethod === "crypto"
                                ? "bg-green-500 text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            <Bitcoin size={20} />
                            <span>Crypto</span>
                          </button>
                        </div>
                
                        {paymentMethod === "crypto" && (
                          <div className="mb-4">
                            <button
                              onClick={() => toast.success("Wallet connected successfully!")}
                              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400"
                            >
                              Connect Wallet
                            </button>
                          </div>
                        )}
                
                        <button
                          onClick={() => {
                            const bundlePrice = (
                              msg.suggestions.reduce(
                                (sum, pizza) => sum + (parseFloat(pizza.price) || 0),
                                0
                              ) * 0.95
                            ).toFixed(2);
                
                            handleOrder(
                              { item: msg.suggestions[0].name }, // Pass required item details
                              bundlePrice // Pass the calculated bundle price
                            );
                          }}
                          className="w-full bg-green-500 text-black py-3 px-6 rounded-lg hover:bg-green-400 font-bold"
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-500 font-bold">Unable to process your request. Please try again later.</p>
                  )}
                </div>
                
                )}
              </div>
            ))}
            {/* Ref to ensure auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
  
          {uploadedImage && (
            <div className="mb-4 flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button
                onClick={() => {
                  setUploadedImage(null);
                  toast.error('Image removed!');
                }}
                className="text-red-500 font-bold hover:underline"
              >
                Remove
              </button>
            </div>
          )}
  
          <div className="flex items-center gap-1 mt-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow p-2 rounded-lg bg-gray-700 text-white mr-2 focus:ring-2 focus:ring-green-400"
              placeholder="Type your message here..."
            />
            <label className="cursor-pointer mr-2">
              <Paperclip className="w-6 h-6 text-green-400 hover:text-green-500" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={sendMessage}
              className="bg-green-500 text-black py-2 px-4 rounded-lg hover:bg-green-400"
            >
              Send
            </button>
          </div>
        </div>
  
        {/* Delivery Details Section */}
        <div className="col-span-1 grid grid-rows-[1fr,auto] gap-4">
          {/* Delivery Status */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {Object.entries({
              Consumer: MapPin,
              Delivery: Navigation,
              Restaurant: Store,
              Accounting: DollarSign,
            }).map(([title, Icon]) => (
              <div key={title} className="bg-gray-800 rounded-lg p-4 border border-blue-400 hover:shadow-xl transition-transform transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <Icon className="mr-2 w-6 h-6" />
                  <h3 className="font-bold text-lg text-blue-400">{title}</h3>
                </div>
                <div className="h-32 overflow-y-auto bg-gray-700 rounded p-2">
                  {state.messages[title.toLowerCase()].map((msg, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-gray-400 text-xs block">{msg.timestamp}</span>
                      <p className="text-gray-200 text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-800 rounded-lg p-4 border border-green-400">
            <h3 className="font-bold text-lg text-green-400 mb-4">Payment Summary</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                <span className="text-xs text-gray-400">Revenue</span>
                <p className="font-bold text-green-400 text-lg">
                    AED {state.payments.totalRevenue.toFixed(2)}
                </p>
                </div>
                <div>
                <span className="text-xs text-gray-400">Pending</span>
                <p className="font-bold text-yellow-400 text-lg">
                    AED {state.payments.pendingPayments.toFixed(2)}
                </p>
                </div>
                <div>
                <span className="text-xs text-gray-400">Completed</span>
                <p className="font-bold text-blue-400 text-lg">
                    AED {state.payments.completedPayments.toFixed(2)}
                </p>
                </div>
            </div>
            </div>
        </div>

      {/* Map and Reviews Section */}
        <section className="grid grid-cols-3 gap-4">
        {/* Map Section */}
        <div className="col-span-3 bg-gray-900 rounded-lg shadow-2xl">
            <EnhancedDeliveryMap
            activeDelivery={activeDelivery}
            prepTime={PREP_TIME}
            deliveryTime={DELIVERY_TIME}
            />
        </div>

        {/* Customer Reviews Section */}
        <div className="col-span-3 bg-gray-800 rounded-lg p-4 border border-green-400">
            <h3 className="font-bold text-lg text-green-400 mb-4">Customer Reviews</h3>
            <div className="space-y-2">
            {state.reviews.length > 0 ? (
                state.reviews.map((review, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded">
                    <p className="text-yellow-400">Rating: {review.rating} / 5</p>
                    <p className="text-gray-200">{review.review}</p>
                    <p className="text-gray-400 text-sm">- {review.item}</p>
                </div>
                ))
            ) : (
                <p className="text-gray-400">No reviews yet. Be the first to share your feedback!</p>
            )}
            </div>
            
        </div>
        </section>
        
      </main>

    </div>
  );
};

export default GobblDeliverySystem;
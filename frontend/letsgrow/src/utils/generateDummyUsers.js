import axios from 'axios';

const categories = [
  "Agriculture", "Health", "Education", "Technology", "Finance", 
  "Real Estate", "Retail", "Manufacturing", "Transportation", 
  "Energy", "Telecommunications", "Entertainment", "Tourism", 
  "Food and Beverage", "Construction"
];

const priceRanges = [
  "$10,000-$20,000", "$20,000-$50,000", "$50,000-$100,000", 
  "$100,000-$250,000", "$250,000-$500,000", "$500,000-$1,000,000", 
  "Above $1,000,000"
];

const generateDummyUsers = () => {
  const users = [];
  let id = 1;

  categories.forEach(category => {
    for (let i = 0; i < 3; i++) {
      // Add 3 Investors
      users.push({
        id: id++,
        firstName: `Investor${id}`,
        lastName: `LastName${id}`,
        phoneNumber: `12345${id.toString().padStart(5, '0')}`, // Unique phone number
        email: `investor${id}@example.com`, // Unique email
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "Investor",
        pricerange: priceRanges[Math.floor(Math.random() * priceRanges.length)],
        catergories: category
      });

      // Add 3 Startups
      users.push({
        id: id++,
        firstName: `Startup${id}`,
        lastName: `LastName${id}`,
        phoneNumber: `12345${id.toString().padStart(5, '0')}`, // Unique phone number
        email: `startup${id}@example.com`, // Unique email
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "Startup",
        pricerange: priceRanges[Math.floor(Math.random() * priceRanges.length)],
        catergories: category
      });
    }
  });

  return users;
};

const registerUsers = async () => {
  const users = generateDummyUsers();
  const apiUrl = 'http://localhost:3000/register'; // Replace with your actual API endpoint

  for (const user of users) {
    try {
      const response = await axios.post(apiUrl, user);
      console.log(`User ${user.email} registered successfully:`, response.data);
    } catch (error) {
      console.error(`Error registering user ${user.email}:`, error.response?.data || error.message);
    }
  }
};

registerUsers();
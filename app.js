const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const UserRoutes=require('./routes/User.routes');
const BlogRoutes=require('./routes/Blog.routes')
const TestimonialRoutes=require('./routes/Testimonial.routes');
const GalleryRoutes=require('./routes/Gallery.routes');
const CrouselRoutes=require('./routes/Crousel.routes');
const BookingRoutes=require('./routes/Booking.routes');
const chefRoutes=require('./routes/Chef.routes');
const Connect=require('./routes/Connect.routes')
const ServiceRoutes=require("./routes/Service.routes");
const HomeRoutes=require('./routes/HomePage.routes');
const InvestorContactRoutes=require('./routes/InvestorContact.routes');
const contactRoutes = require('./routes/Contact.routes');
const Investor=require('./routes/Investor.routes')
const FoodRoutes=require('./routes/Food.routes')
const JoinRoutes=require('./routes/Join.routes')
const FoodGallRoutes=require('./routes/FoodGall.routes')
const otp=require('./routes/Otp.routes')
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
connectDB()

app.use(cors({
  origin: [
    'http://localhost:3000', // for local testing
    'https://chefkart-frontend.vercel.app' // for deployed frontend
  ],
  credentials: true
}));


app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});
 
app.use('/auth', UserRoutes);
app.use('/blog',  BlogRoutes)
app.use('/testimonial', TestimonialRoutes );
app.use('/gallery',GalleryRoutes)
app.use('/crousel', CrouselRoutes)
app.use('/chef',chefRoutes);
app.use('/InvestorContactRoutes',InvestorContactRoutes)
app.use("/ser",ServiceRoutes )
app.use('/home',HomeRoutes )
app.use('/investor',Investor)
app.use('/booking',BookingRoutes)
app.use('/connect',Connect)
app.use('/foodGall',FoodGallRoutes)
app.use('/food',FoodRoutes);
app.use('/join',JoinRoutes);
app.use('/investContact',InvestorContactRoutes);
app.use('/contact', contactRoutes);
app.use('/otp', otp);

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
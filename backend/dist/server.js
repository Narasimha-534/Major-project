import express from 'express';         
import cors from 'cors';              
import dotenv from 'dotenv';  
import path from 'path';       
import authRoutes from './routes/auth.js'; 
import eventRoutes from './routes/events.js';
import reportRoutes from './routes/reports.js'; 
import performanceRoutes from './routes/performance.js'; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/reports', express.static(path.join(process.cwd(), 'reports')));
app.use('/reports/images', express.static(path.join(process.cwd(), 'reports/images')));


const reportsPath = path.join(process.cwd(), 'reports');
console.log('Serving reports from:', reportsPath);



app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', reportRoutes);
app.use('/api', performanceRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

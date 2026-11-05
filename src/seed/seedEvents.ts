import { connectDB } from '../config/db';
import { EventDocument } from '../routes/event.routes';

const initialEvents: Omit<EventDocument, '_id'>[] = [
  {
    title: 'Winter Clothes Distribution',
    description: 'Distributing warm jackets, sweaters, and mufflers to over 300 underprivileged children and elderly citizens.',
    eventType: 'Donation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    location: 'Mirpur 10 Roundabout, Dhaka',
    eventDate: '2026-11-15',
    creatorEmail: 'community.lead@goodgather.org',
    creatorName: 'Ayesha Rahman',
    createdAt: new Date(),
  },
  {
    title: 'Blanket Distribution for the Needy',
    description: 'Providing heavy winter blankets to vulnerable families sleeping on streets and slums during harsh cold weather.',
    eventType: 'Donation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    location: 'Mohammadpur Town Hall Ground, Dhaka',
    eventDate: '2026-11-18',
    creatorEmail: 'volunteers@goodgather.org',
    creatorName: 'Tanvir Ahmed',
    createdAt: new Date(),
  },
  {
    title: 'Urban Afforestation & Tree Plantation Drive',
    description: 'Planting 1,000 native shade and fruit trees across residential avenues to battle urban heat island effects.',
    eventType: 'Plantation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    location: 'Uttara Sector 11 Lake Park, Dhaka',
    eventDate: '2026-11-22',
    creatorEmail: 'greenearth@goodgather.org',
    creatorName: 'Kazi Farhan',
    createdAt: new Date(),
  },
  {
    title: 'Clean Dhaka Lake Cleanup Initiative',
    description: 'Community cleanup operation removing plastic debris, polythene, and waste traps from the lakeside.',
    eventType: 'Cleanup',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    location: 'Dhanmondi Lake Amphitheater, Dhaka',
    eventDate: '2026-11-25',
    creatorEmail: 'cleancrew@goodgather.org',
    creatorName: 'Nusrat Jahan',
    createdAt: new Date(),
  },
  {
    title: 'Free Pediatric & Maternal Health Camp',
    description: 'Free consultations by certified physicians, basic diagnostics, and distribution of essential medicines.',
    eventType: 'Healthcare',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    location: 'Korail Community Center, Banani, Dhaka',
    eventDate: '2026-11-29',
    creatorEmail: 'healthfirst@goodgather.org',
    creatorName: 'Dr. Shahriar Kabir',
    createdAt: new Date(),
  },
  {
    title: 'Books & Stationery Collection for Street Schools',
    description: 'Gathering new and gently used notebooks, reading books, and pens to distribute across 5 slum schools.',
    eventType: 'Education',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    location: 'TSC, Dhaka University Campus',
    eventDate: '2026-12-05',
    creatorEmail: 'eduforall@goodgather.org',
    creatorName: 'Samir Hossain',
    createdAt: new Date(),
  },
  {
    title: 'Emergency Blood Donation & Screening Camp',
    description: 'Volunteer blood donation camp with immediate cross-matching and blood group identification services.',
    eventType: 'Healthcare',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    location: 'Mirpur 2 Stadium Gate, Dhaka',
    eventDate: '2026-12-10',
    creatorEmail: 'redlifeline@goodgather.org',
    creatorName: 'Mahmudul Hasan',
    createdAt: new Date(),
  },
  {
    title: 'Old Town Heritage & Alleyway Cleanliness Drive',
    description: 'Sensitizing residents on solid waste management and deep-cleaning pedestrian walkaways in Old Dhaka.',
    eventType: 'Cleanup',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    location: 'Shankhari Bazaar, Old Dhaka',
    eventDate: '2026-12-14',
    creatorEmail: 'heritagecare@goodgather.org',
    creatorName: 'Farhana Yasmin',
    createdAt: new Date(),
  },
  {
    title: 'Hot Meals for Rickshaw Pullers & Daily Laborers',
    description: 'Serving hot, nutritious meal boxes and clean drinking water to over 500 low-wage transport workers.',
    eventType: 'Donation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    location: 'Gabtoli Bus Terminal Perimeter, Dhaka',
    eventDate: '2026-12-18',
    creatorEmail: 'feeddhaka@goodgather.org',
    creatorName: 'Zahid Karim',
    createdAt: new Date(),
  },
  {
    title: 'Rooftop Gardening & Green Space Workshop',
    description: 'Hands-on training session on growing organic kitchen herbs and composting kitchen organic matter.',
    eventType: 'Plantation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    location: 'Gulshan 2 Youth Club Field, Dhaka',
    eventDate: '2026-12-24',
    creatorEmail: 'ecocitizen@goodgather.org',
    creatorName: 'Sadia Sultana',
    createdAt: new Date(),
  },
];

async function seed() {
  const db = await connectDB();
  const collection = db.collection('events');
  await collection.deleteMany({});
  await collection.insertMany(initialEvents);
  console.log('10 Seed events inserted successfully.');
  process.exit(0);
}

seed();
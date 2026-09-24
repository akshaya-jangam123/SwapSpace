import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Skill } from './models/Skill';
import { Item } from './models/Item';
import { ExchangeRequest } from './models/ExchangeRequest';
import { Message } from './models/Message';
import { Review } from './models/Review';
import { Report } from './models/Report';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swapspace';
    console.log(`[Seed] Connecting to ${mongoURI}...`);
    await mongoose.connect(mongoURI);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      Item.deleteMany({}),
      ExchangeRequest.deleteMany({}),
      Message.deleteMany({}),
      Review.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@swapspace.dev',
        password: defaultPassword,
        college: 'MIT School of Engineering',
        location: 'Boston, MA',
        bio: 'CS junior passionate about backend systems, distributed architectures, and competitive programming.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['Java', 'Spring Boot', 'Data Structures'],
        skillsWanted: ['Python', 'Machine Learning', 'UI/UX Design'],
        itemsOffered: ['Java Programming Book', 'Scientific Calculator'],
        itemsWanted: ['Arduino Kit', 'Engineering Drawing Board'],
        role: 'user',
        avgRating: 4.8,
        totalReviews: 3,
      },
      {
        name: 'Priya Patel',
        email: 'priya@swapspace.dev',
        password: defaultPassword,
        college: 'Stanford University',
        location: 'Palo Alto, CA',
        bio: 'Data Science enthusiast and Python developer. Love helping fellow students learn ML and AI basics.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['Python', 'Machine Learning', 'Data Analysis with Pandas'],
        skillsWanted: ['Java', 'React', 'Photography'],
        itemsOffered: ['Arduino Starter Kit', 'Python Data Science Handbook'],
        itemsWanted: ['Mechanical Keyboard', 'Java Programming Book'],
        role: 'user',
        avgRating: 4.9,
        totalReviews: 4,
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan@swapspace.dev',
        password: defaultPassword,
        college: 'UC Berkeley',
        location: 'Berkeley, CA',
        bio: 'Frontend enthusiast, React developer, and amateur photographer. Eager to swap web design skills for backend or hardware.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['React', 'Web Development', 'Photography'],
        skillsWanted: ['Java', 'Video Editing', 'Excel'],
        itemsOffered: ['Mechanical Keyboard RGB', '64GB USB 3.0 Flash Drive'],
        itemsWanted: ['Scientific Calculator', 'Lab Coat'],
        role: 'user',
        avgRating: 4.7,
        totalReviews: 2,
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya@swapspace.dev',
        password: defaultPassword,
        college: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        bio: 'Design student specializing in Graphic Design, UI/UX, and Video Editing. Looking to learn public speaking and coding.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['Graphic Design', 'Video Editing', 'Figma'],
        skillsWanted: ['Public Speaking', 'Web Development', 'Excel'],
        itemsOffered: ['Artist Drawing Kit', 'Engineering Drawing Notes'],
        itemsWanted: ['Scientific Calculator', 'Python Book'],
        role: 'user',
        avgRating: 5.0,
        totalReviews: 3,
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@swapspace.dev',
        password: defaultPassword,
        college: 'Georgia Tech',
        location: 'Atlanta, GA',
        bio: 'Industrial engineering major with expertise in Public Speaking, Debate, and Advanced Microsoft Excel modeling.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['Public Speaking', 'Excel', 'Financial Modeling'],
        skillsWanted: ['React', 'Graphic Design', 'Python'],
        itemsOffered: ['Chemistry Lab Coat (Size M)', 'Engineering Mathematics Textbook'],
        itemsWanted: ['64GB USB Drive', 'Mechanical Keyboard'],
        role: 'user',
        avgRating: 4.6,
        totalReviews: 2,
      },
      {
        name: 'SwapSpace Admin',
        email: 'admin@swapspace.dev',
        password: defaultPassword,
        college: 'Platform Headquarters',
        location: 'San Francisco, CA',
        bio: 'Official SwapSpace administrator and moderation lead.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skillsOffered: ['Platform Management'],
        skillsWanted: [],
        itemsOffered: [],
        itemsWanted: [],
        role: 'admin',
        avgRating: 5.0,
        totalReviews: 0,
      },
    ];

    const users = await User.insertMany(usersData);
    const [aarav, priya, rohan, ananya, vikram, admin] = users;

    console.log('[Seed] Creating 8 realistic skills...');
    const skillsData = [
      {
        owner: aarav._id,
        name: 'Java & Object Oriented Programming',
        category: 'Programming & Tech',
        description: 'Comprehensive 1-on-1 tutoring covering Core Java, OOP principles, Collections framework, and multi-threading.',
        level: 'Intermediate',
        availability: 'Weekends & weekday evenings (6 PM - 9 PM)',
        wantInExchange: 'Python tutoring or Machine Learning basics',
      },
      {
        owner: priya._id,
        name: 'Python for Beginners & Data Analysis',
        category: 'Programming & Tech',
        description: 'Learn Python syntax, scripting, and data manipulation using Pandas and NumPy with hands-on practice notebooks.',
        level: 'Advanced',
        availability: 'Tuesdays and Thursdays (4 PM - 7 PM)',
        wantInExchange: 'Java tutoring or React development help',
      },
      {
        owner: rohan._id,
        name: 'Modern React & Web Development',
        category: 'Programming & Tech',
        description: 'Hands-on frontend development coaching with React, TypeScript, Tailwind CSS, and API integration.',
        level: 'Intermediate',
        availability: 'Flexible weekends',
        wantInExchange: 'Video editing or Java tutoring',
      },
      {
        owner: ananya._id,
        name: 'Graphic Design & UI/UX with Figma',
        category: 'Design & Creative',
        description: 'Master UI layout design, color theory, typography, and interactive prototyping in Figma.',
        level: 'Advanced',
        availability: 'Monday & Wednesday afternoons',
        wantInExchange: 'Public Speaking practice or Web Development',
      },
      {
        owner: ananya._id,
        name: 'Video Editing with Premiere Pro',
        category: 'Design & Creative',
        description: 'Learn video cutting, smooth transitions, color grading, audio synchronization, and export workflows.',
        level: 'Intermediate',
        availability: 'Saturday mornings',
        wantInExchange: 'Excel data modeling or React basics',
      },
      {
        owner: vikram._id,
        name: 'Public Speaking & Presentation Skills',
        category: 'Communication & Soft Skills',
        description: 'Overcome stage fear, master speech structuring, pitch decks, and effective body language.',
        level: 'Advanced',
        availability: 'Weekday nights after 8 PM',
        wantInExchange: 'Graphic design for portfolio or Python basics',
      },
      {
        owner: vikram._id,
        name: 'Advanced Microsoft Excel & Modeling',
        category: 'Business & Analytics',
        description: 'Master VLOOKUP/XLOOKUP, INDEX/MATCH, Pivot Tables, dashboard creation, and basic VBA macros.',
        level: 'Advanced',
        availability: 'Sunday afternoons',
        wantInExchange: 'React web development coaching',
      },
      {
        owner: rohan._id,
        name: 'Campus Photography & Lightroom Editing',
        category: 'Design & Creative',
        description: 'Camera settings (ISO, Aperture, Shutter Speed), composition, portrait techniques, and Lightroom color grading.',
        level: 'Intermediate',
        availability: 'Saturday afternoons',
        wantInExchange: 'Data Structures and Algorithms mentoring',
      },
    ];

    const skills = await Skill.insertMany(skillsData);

    console.log('[Seed] Creating 8 realistic items...');
    const itemsData = [
      {
        owner: aarav._id,
        name: 'Java: The Complete Reference (12th Edition)',
        category: 'Books',
        description: 'Comprehensive textbook on Java programming. Minor highlights on chapter 4, otherwise in pristine condition.',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
        availability: 'Immediate on campus pickup',
        wantInExchange: 'Arduino Starter Kit or Python Book',
      },
      {
        owner: aarav._id,
        name: 'Casio fx-991EX Scientific Calculator',
        category: 'Electronics',
        description: 'High-speed scientific calculator ideal for engineering math and physics exams. Fresh batteries installed.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=80',
        availability: 'Available weekdays',
        wantInExchange: 'Drawing board or Python reference book',
      },
      {
        owner: priya._id,
        name: 'Arduino Uno Ultimate Starter Kit',
        category: 'Electronics',
        description: 'Includes Arduino Uno R3, breadboard, 50+ sensors, jumper wires, servo motor, and LCD module.',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&auto=format&fit=crop&q=80',
        availability: 'Immediate pickup at Stanford Student Union',
        wantInExchange: 'Java Programming Book or Mechanical Keyboard',
      },
      {
        owner: rohan._id,
        name: 'Mechanical Gaming Keyboard (Blue Switches)',
        category: 'Electronics',
        description: 'Tenkeyless RGB mechanical keyboard with tactile blue switches. Works with Mac & Windows.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
        availability: 'Evenings near campus library',
        wantInExchange: 'Scientific Calculator or Chemistry Lab Coat',
      },
      {
        owner: ananya._id,
        name: 'Professional Sketching & Drawing Pencil Set',
        category: 'Stationery',
        description: '24-piece graphite and charcoal drawing set in metal tin with kneaded eraser and blending stumps.',
        condition: 'New',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80',
        availability: 'Available anytime this week',
        wantInExchange: 'Scientific calculator or USB flash drive',
      },
      {
        owner: ananya._id,
        name: 'Engineering Graphics & CAD Printed Notes',
        category: 'Study Materials',
        description: 'Clean spiral-bound study guide covering orthographic projections, isometric views, and CAD basics.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80',
        availability: 'Campus center',
        wantInExchange: 'Python or Data Science cheat sheets',
      },
      {
        owner: vikram._id,
        name: 'Cotton Chemistry Lab Coat (Medium)',
        category: 'Study Materials',
        description: '100% white cotton lab coat with 3 front pockets and snap buttons. Washed and sanitized.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
        availability: 'Engineering building locker',
        wantInExchange: 'SanDisk 64GB USB Drive',
      },
      {
        owner: rohan._id,
        name: 'SanDisk Ultra 64GB USB 3.0 Flash Drive',
        category: 'Electronics',
        description: 'High speed USB 3.0 drive, formatted and ready for carrying OS images and college project archives.',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80',
        availability: 'Anytime',
        wantInExchange: 'Lab coat or engineering notes',
      },
    ];

    const items = await Item.insertMany(itemsData);

    console.log('[Seed] Creating 5 realistic exchange requests...');
    const exchangesData = [
      // 1. Aarav <-> Priya (Java <-> Python) - Accepted (Perfect match!)
      {
        sender: aarav._id,
        receiver: priya._id,
        exchangeType: 'Skill',
        offeredSkill: skills[0]._id, // Java
        requestedSkill: skills[1]._id, // Python
        message: 'Hi Priya! I saw you are teaching Python and looking for Java tutoring. I have 2 years of Java experience and would love to do a mutual exchange!',
        status: 'Accepted',
      },
      // 2. Priya <-> Aarav (Arduino <-> Java Book) - Completed (Item swap)
      {
        sender: priya._id,
        receiver: aarav._id,
        exchangeType: 'Item',
        offeredItem: items[2]._id, // Arduino kit
        requestedItem: items[0]._id, // Java book
        message: 'Hey Aarav, I have the Arduino kit you are looking for. Let us swap for your Java textbook!',
        status: 'Completed',
        completedBySender: true,
        completedByReceiver: true,
      },
      // 3. Rohan <-> Ananya (React <-> Graphic Design) - Pending
      {
        sender: rohan._id,
        receiver: ananya._id,
        exchangeType: 'Skill',
        offeredSkill: skills[2]._id, // React
        requestedSkill: skills[3]._id, // Graphic Design
        message: 'Hi Ananya! I can help you build your portfolio website in React if you can help me design UI mockups for my app.',
        status: 'Pending',
      },
      // 4. Vikram <-> Rohan (Lab coat <-> USB Drive) - Accepted
      {
        sender: vikram._id,
        receiver: rohan._id,
        exchangeType: 'Item',
        offeredItem: items[6]._id, // Lab coat
        requestedItem: items[7]._id, // USB drive
        message: 'Hey Rohan, I have the lab coat you need for chemistry class. Can we swap for your 64GB USB drive?',
        status: 'Accepted',
      },
      // 5. Ananya <-> Vikram (Video Editing <-> Public Speaking) - Completed
      {
        sender: ananya._id,
        receiver: vikram._id,
        exchangeType: 'Skill',
        offeredSkill: skills[4]._id, // Video editing
        requestedSkill: skills[5]._id, // Public speaking
        message: 'Hi Vikram! Would love to trade video editing lessons for your speech & presentation coaching!',
        status: 'Completed',
        completedBySender: true,
        completedByReceiver: true,
      },
    ];

    const exchanges = await ExchangeRequest.insertMany(exchangesData);

    console.log('[Seed] Creating demo chat messages for active/completed exchanges...');
    const messagesData = [
      {
        sender: aarav._id,
        receiver: priya._id,
        exchange: exchanges[0]._id,
        content: 'Hi Priya! Thanks for accepting. When are you free for our first 1-hour session?',
        isRead: true,
      },
      {
        sender: priya._id,
        receiver: aarav._id,
        exchange: exchanges[0]._id,
        content: 'Hey Aarav! How about this Saturday at 3 PM on Google Meet or at the campus library?',
        isRead: true,
      },
      {
        sender: aarav._id,
        receiver: priya._id,
        exchange: exchanges[0]._id,
        content: 'Saturday 3 PM at the library works great for me! I will prepare the Java notes.',
        isRead: false,
      },
      {
        sender: vikram._id,
        receiver: rohan._id,
        exchange: exchanges[3]._id,
        content: 'Hey Rohan! I have the lab coat packed and ready. Can we meet near the Student Center at noon?',
        isRead: true,
      },
      {
        sender: rohan._id,
        receiver: vikram._id,
        exchange: exchanges[3]._id,
        content: 'Sounds good Vikram, see you at noon by the main entrance!',
        isRead: true,
      },
    ];

    await Message.insertMany(messagesData);

    console.log('[Seed] Creating 5 realistic reviews for completed exchanges...');
    const reviewsData = [
      {
        reviewer: priya._id,
        reviewee: aarav._id,
        exchange: exchanges[1]._id,
        rating: 5,
        comment: 'Aarav was super prompt and the Java textbook was in spotless condition. Awesome swap!',
      },
      {
        reviewer: aarav._id,
        reviewee: priya._id,
        exchange: exchanges[1]._id,
        rating: 5,
        comment: 'Priya provided the complete Arduino kit with all original sensors and components. 10/10 exchange!',
      },
      {
        reviewer: vikram._id,
        reviewee: ananya._id,
        exchange: exchanges[4]._id,
        rating: 5,
        comment: 'Ananya is an exceptional video editing teacher. She walked me through Premiere Pro step-by-step.',
      },
      {
        reviewer: ananya._id,
        reviewee: vikram._id,
        exchange: exchanges[4]._id,
        rating: 5,
        comment: 'Vikram gave great actionable advice on speech structure and stage presence. Highly recommended!',
      },
      {
        reviewer: rohan._id,
        reviewee: priya._id,
        exchange: exchanges[1]._id,
        rating: 5,
        comment: 'Great peer to work with. Highly trustworthy and helpful!',
      },
    ];

    await Review.insertMany(reviewsData);

    console.log('[Seed] Creating a demo moderation report for Admin dashboard...');
    await Report.create({
      reporter: aarav._id,
      targetType: 'Item',
      targetId: items[3]._id,
      targetTitle: 'Mechanical Gaming Keyboard',
      reason: 'Incorrect category or clarification needed',
      description: 'Testing report workflow for admin dashboard moderation demonstration.',
      status: 'Pending',
    });

    console.log('\n=============================================');
    console.log('🎉 [SwapSpace Seed] Database Seeded Successfully!');
    console.log('=============================================');
    console.log('Demo Accounts:');
    console.log('  1. Aarav (Java)          : aarav@swapspace.dev  / password123');
    console.log('  2. Priya (Python/ML)     : priya@swapspace.dev  / password123');
    console.log('  3. Rohan (React/UI)      : rohan@swapspace.dev  / password123');
    console.log('  4. Ananya (Design/Video) : ananya@swapspace.dev / password123');
    console.log('  5. Vikram (Speech/Excel) : vikram@swapspace.dev / password123');
    console.log('  6. Admin                 : admin@swapspace.dev  / password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

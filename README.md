# 🎓 EduLearn - Personal Learning Platform

A comprehensive learning platform that helps users organize their studies through notes, interactive quizzes, and vocabulary building tools.

## 🌟 Features

### 📝 Notes Management
- Create, edit, and organize personal study notes
- Rich text content support
- Quick access to all your notes
- Search and filter capabilities

### 🧠 Interactive Quizzes
- Access thousands of trivia questions via Open Trivia Database
- Customizable quiz settings:
  - **Categories**: General Knowledge, Science, History, Entertainment, Sports, and more
  - **Difficulty Levels**: Easy, Medium, Hard, or Any
  - **Question Types**: Multiple Choice, True/False, or Mixed
  - **Question Count**: 5-50 questions per quiz
- Real-time scoring and results tracking
- Immediate feedback on answers

### 📚 Dictionary (Coming Soon)
- Vocabulary building tools
- Word definitions and meanings
- Personal word collections

### 👤 User Profile
- Personal account management
- Learning progress tracking
- Customizable user settings

## 🚀 How to Use

### Getting Started
1. **Sign Up**: Create your account with email and password
2. **Login**: Access your personal learning dashboard
3. **Explore**: Navigate through different learning tools

### Taking Quizzes
1. Go to the **Quizzes** section
2. Configure your quiz settings:
   - Select a category (or choose "Any Category")
   - Pick difficulty level
   - Choose question type
   - Set number of questions (5-50)
3. Click **Start Quiz** to begin
4. Answer questions and get instant feedback
5. View your final score and review answers

### Managing Notes
1. Navigate to the **Notes** section
2. Click **Create New Note** to add content
3. Write your study materials with title and content
4. Save and organize your notes for easy access
5. Edit or delete notes as needed

### Profile Management
1. Access your **Profile** to update personal information
2. View your learning statistics
3. Manage account settings

## 🛠️ Technologies Used

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI (shadcn/ui)
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite
- **External APIs**: Open Trivia Database API

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, etc.)
│   └── ui/             # Design system components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── integrations/       # External service integrations
```

### Key Services
- **AuthService**: Handles user authentication and profile management
- **NotesService**: Manages CRUD operations for user notes
- **QuizService**: Integrates with Open Trivia DB API for quiz functionality

## 🔐 Authentication & Security

- Secure user authentication via Supabase Auth
- Row Level Security (RLS) policies protect user data
- JWT-based session management
- Automatic session persistence

## 📱 Responsive Design

The platform is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Design System

- Custom color palette with semantic tokens
- Consistent typography and spacing
- Dark/light mode support (inherited from system)
- Accessible components following WCAG guidelines

## 🚀 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173` in your browser

### Environment Variables
The application uses Supabase for backend services. Configuration is managed through the integrated Supabase client.

## 📊 Quiz Categories Available

- General Knowledge
- Entertainment (Books, Film, Music, TV, Video Games)
- Science & Nature
- Mathematics
- Mythology
- Sports
- Geography
- History
- Politics
- Art
- Celebrities
- Animals
- Vehicles
- Comics
- Gadgets
- Japanese Anime & Manga
- Cartoon & Animations

## 🎯 Future Enhancements

- Advanced note-taking features (markdown support, tags)
- Quiz progress analytics and detailed statistics
- Collaborative study features
- Spaced repetition learning system
- Mobile app version
- Offline capability
- Advanced dictionary with etymology and examples

## 🤝 Contributing

This is a personal learning platform. For suggestions or feedback, please create an issue or reach out to the development team.

## 📄 License

This project is developed for educational purposes.

---

**Start your learning journey today!** 🚀

Visit the platform and create your account to access personalized study tools and track your learning progress.
# AnotherPad 📝

A beautiful, minimalist notepad application built with Vue 3, TypeScript, and Tailwind CSS 4. Your notes are saved locally in your browser's storage, ensuring privacy and offline access.

![AnotherPad Screenshot](https://via.placeholder.com/800x400/1e293b/ffffff?text=AnotherPad+Notepad+App)

## ✨ Features

- **🎨 Beautiful UI**: Clean, modern interface with dark/light theme support
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🏷️ Smart Organization**: Tag your notes and use advanced filtering
- **📌 Pin Important Notes**: Keep important notes at the top
- **🔍 Powerful Search**: Find notes by title, content, or tags
- **💾 Local Storage**: All data stays in your browser - no server required
- **⚡ Real-time Autosave**: Your changes are saved automatically
- **📊 Writing Stats**: Track word count and character count
- **🎯 Focus Mode**: Distraction-free writing experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/anotherpad.git
cd anotherpad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. Push your code to the `main` branch
2. Enable GitHub Pages in your repository settings
3. Select "GitHub Actions" as the source
4. Your app will be automatically deployed!

Alternatively, you can deploy manually:

```bash
npm run deploy
```

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Icons**: Lucide Vue
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── NoteEditor.vue  # Main note editing interface
│   └── NoteSidebar.vue # Notes list and filters
├── composables/        # Vue composables
│   ├── useNotes.ts    # Notes management logic
│   └── useTheme.ts    # Theme management
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.vue           # Main application component
├── main.ts          # Application entry point
└── style.css       # Global styles
```

## 🎨 Customization

### Themes

The app supports both light and dark themes with automatic system preference detection. You can customize the theme colors in the Tailwind configuration.

### Storage

By default, notes are stored in localStorage. You can extend the storage system to support:
- IndexedDB for larger storage capacity
- Cloud storage integration
- Export/import functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon set
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

Made with ❤️ and ☕ by [Your Name]

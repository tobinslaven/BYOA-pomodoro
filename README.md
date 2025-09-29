# Pomodoro Timer

A beautiful, Apple Watch-inspired Pomodoro timer with concentric progress rings and auto-start functionality.

## Features

- 🍅 **Classic Pomodoro Technique** - 25-minute work sessions with 5-minute breaks
- ⭕ **Concentric Progress Rings** - Visual tracking with persistent ring history
- 🔄 **Auto-Start Sessions** - Automatically starts new sessions after completion
- ⏰ **+5 Min Extension** - Add time to running sessions when in the flow
- 🎨 **Apple Watch Design** - Beautiful, modern interface with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚙️ **Customizable Settings** - Adjust work/break times and session counts

## Live Demo

🌐 **GitHub Pages**: [https://tobinslaven.github.io/BYOA-pomodoro/](https://tobinslaven.github.io/BYOA-pomodoro/)

## Embeddable Widget

### Quick Embed (iframe)

Add this code to your website to embed the full Pomodoro timer:

```html
<iframe 
    src="https://tobinslaven.github.io/BYOA-pomodoro/" 
    width="480" 
    height="600" 
    frameborder="0"
    style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
</iframe>
```

### Compact Widget Embed

For a smaller, more compact version, use the widget:

```html
<iframe 
    src="https://tobinslaven.github.io/BYOA-pomodoro/widget.html" 
    width="400" 
    height="500" 
    frameborder="0"
    style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
</iframe>
```

### Responsive Embed

For responsive design that adapts to different screen sizes:

```html
<div style="position: relative; width: 100%; max-width: 480px; margin: 0 auto;">
    <iframe 
        src="https://tobinslaven.github.io/BYOA-pomodoro/" 
        width="100%" 
        height="600" 
        frameborder="0"
        style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
    </iframe>
</div>
```

## Usage

### Basic Workflow

1. **Start Work** - Click "Start" to begin a 25-minute focus session
2. **Take Breaks** - Click "Time For A Break?" to switch to break mode
3. **Extend Sessions** - Use "+5 Min" to add time when in the flow
4. **Auto-Continue** - Sessions automatically restart after 5 seconds

### Features Explained

- **Concentric Rings**: Each session creates a new inner ring, building a visual history
- **Persistent Progress**: Rings maintain their progress when switching between work/break
- **Auto-Start**: After completing a session, a new one automatically begins
- **Smart Extensions**: Add 5 minutes to running sessions without losing progress

## Customization

### Settings

Access the settings menu to customize:
- **Focus Time**: 1-60 minutes (default: 25)
- **Short Break**: 1-30 minutes (default: 5)
- **Long Break**: 1-60 minutes (default: 15)
- **Sessions Before Long Break**: 1-10 (default: 4)

### Styling

The widget uses scoped CSS classes to prevent conflicts with your site's styling:
- All classes are prefixed with `widget-` or `pomodoro-widget`
- Colors and styling are self-contained
- Responsive design adapts to container size

## Technical Details

### Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dependencies

- **None!** Pure HTML, CSS, and JavaScript
- No external libraries or frameworks
- Works offline after initial load

### Performance

- **Lightweight**: ~15KB total (HTML + CSS + JS)
- **Fast Loading**: Optimized for quick embed
- **Smooth Animations**: 60fps CSS animations
- **Memory Efficient**: Minimal resource usage

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/tobinslaven/BYOA-pomodoro.git

# Navigate to the directory
cd BYOA-pomodoro

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### File Structure

```
BYOA-pomodoro/
├── index.html          # Main application
├── widget.html         # Embeddable widget
├── style.css           # Main styles
├── script.js           # Main JavaScript
└── README.md           # This file
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help with embedding, please open an issue on GitHub.

---

**Made with ❤️ for productive work sessions**
